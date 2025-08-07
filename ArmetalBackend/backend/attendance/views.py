from django.shortcuts import render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

from datetime import datetime,time  
from datetime import timedelta
import pytz

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, filters
from rest_framework.generics import RetrieveAPIView

from .models import Attendance, AttendanceSession
from employee.models import Employee_db
from .serializers import AttendanceSerializer, AttendanceSessionSerializer, AttendanceDetailSerializer
from shared.pagination import CustomPagination
from .utils.timezone_utils import get_company_timezone, ensure_timezone,safe_parse_datetime
from user.permissions import IsEmployee, IsHRAdmin, IsHRorIsEmployee
import logging
from datetime import datetime, time
from django.utils import timezone
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
import pytz




# logger = logging.getLogger(__name__)
# class AttendanceSwipeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             user = request.user
#             employee = getattr(user, 'employee_db', None)

#             if not employee:
#                 return Response({'error': 'Employee not found'}, status=404)

#             company_tz = get_company_timezone(employee)
#             now = timezone.now().astimezone(company_tz)
#             today = now.date()

#             attendance, _ = Attendance.objects.get_or_create(employee=employee, date=today)
#             latest_session = attendance.sessions.last()

#             # Punch In
#             if not latest_session or latest_session.time_out:
#                 AttendanceSession.objects.create(
#                     attendance=attendance,
#                     time_in=now,
#                     timezone=company_tz.zone
#                 )
#                 return Response({
#                     'status': 'success',
#                     'action': 'punch_in',
#                     'time': now.strftime("%H:%M:%S"),
#                     'date': today.isoformat()
#                 }, status=201)

#             # Punch Out
#             time_in = latest_session.time_in

#             # ✅ SAFELY HANDLE time_in TYPES
#             if isinstance(time_in, time):
#                 # Convert to datetime
#                 time_in = datetime.combine(today, time_in)
#                 time_in = company_tz.localize(time_in)
#             elif isinstance(time_in, datetime):
#                 if timezone.is_naive(time_in):
#                     time_in = company_tz.localize(time_in)
#                 else:
#                     time_in = time_in.astimezone(company_tz)
#             else:
#                 logger.error("Invalid time_in format")
#                 return Response({'error': 'Invalid punch-in time'}, status=500)

#             if now <= time_in:
#                 return Response({
#                     'error': 'Punch out must be after punch in',
#                     'details': {
#                         'punch_in': str(time_in),
#                         'attempted_out': str(now)
#                     }
#                 }, status=400)

#             latest_session.time_out = now
#             latest_session.save()
#             attendance.update_total_hours()

#             return Response({
#                 'status': 'success',
#                 'action': 'punch_out',
#                 'time': now.strftime("%H:%M:%S"),
#                 'total_hours': float(attendance.total_hours),
#                 'timezone': company_tz.zone
#             }, status=200)

#         except Exception as e:
#             logger.critical(f"Unhandled error: {e}", exc_info=True)
#             return Response({'error': 'Internal server error'}, status=500)

logger = logging.getLogger(__name__)
class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            employee = getattr(user, 'employee_db', None)

            if not employee:
                return Response({'error': 'Employee not found'}, status=404)

            # Get company timezone and current time in that timezone
            company_tz = get_company_timezone(employee)
            now_utc = timezone.now()
            now_company_tz = now_utc.astimezone(company_tz)
            today = now_company_tz.date()

            # Get or create attendance for today
            attendance, _ = Attendance.objects.get_or_create(employee=employee, date=today)
            latest_session = attendance.sessions.last()

            # Check if we should punch in or punch out
            should_punch_in = self._should_punch_in(latest_session)
            
            if should_punch_in:
                return self._handle_punch_in(attendance, now_company_tz, company_tz)
            else:
                return self._handle_punch_out(latest_session, now_company_tz, company_tz, attendance)

        except Exception as e:
            logger.critical(f"Unhandled error in AttendanceSwipeView: {e}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=500)

    def _should_punch_in(self, latest_session):
        """Determine if user should punch in or punch out"""
        if not latest_session:
            return True
        
        # If latest session has no punch out, user should punch out
        if not latest_session.time_out:
            return False
            
        # If latest session has punch out, user should punch in
        return True

    def _handle_punch_in(self, attendance, now_company_tz, company_tz):
        """Handle punch in logic"""
        try:
            # Create new session with punch in
            session = AttendanceSession.objects.create(
                attendance=attendance,
                time_in=now_company_tz,
                timezone=company_tz.zone
            )
            
            return Response({
                'status': 'success',
                'action': 'punch_in',
                'time': now_company_tz.strftime("%H:%M:%S"),
                'date': now_company_tz.date().isoformat(),
                'session_id': session.id
            }, status=201)
            
        except Exception as e:
            logger.error(f"Error during punch in: {e}")
            return Response({'error': 'Failed to punch in'}, status=500)

    def _handle_punch_out(self, latest_session, now_company_tz, company_tz, attendance):
        """Handle punch out logic"""
        try:
            # Get the punch in time and ensure it's not modified
            time_in = latest_session.time_in
            
            # Log the current state for debugging
            logger.info(f"Punch out - Original time_in: {time_in}, time_out: {latest_session.time_out}")
            
            # Ensure time_in is a proper datetime object for validation only
            validation_time_in = time_in
            if isinstance(time_in, time):
                # Convert time to datetime using attendance date for validation
                validation_time_in = datetime.combine(attendance.date, time_in)
                validation_time_in = company_tz.localize(validation_time_in)
            elif isinstance(time_in, datetime):
                if timezone.is_naive(time_in):
                    validation_time_in = company_tz.localize(time_in)
                else:
                    validation_time_in = time_in.astimezone(company_tz)
            else:
                logger.error(f"Invalid time_in format: {type(time_in)}")
                return Response({'error': 'Invalid punch-in time format'}, status=500)

            # Validate punch out time
            if now_company_tz <= validation_time_in:
                return Response({
                    'error': 'Punch out time must be after punch in time',
                    'details': {
                        'punch_in': validation_time_in.strftime("%Y-%m-%d %H:%M:%S"),
                        'attempted_punch_out': now_company_tz.strftime("%Y-%m-%d %H:%M:%S")
                    }
                }, status=400)

            # Store the original time_in to ensure it doesn't get modified
            original_time_in = latest_session.time_in
            
            # Set punch out time only
            latest_session.time_out = now_company_tz
            
            # Log before saving
            logger.info(f"Before save - time_in: {latest_session.time_in}, time_out: {latest_session.time_out}")
            
            # Save the session
            latest_session.save()
            
            # Verify time_in wasn't modified
            latest_session.refresh_from_db()
            if latest_session.time_in != original_time_in:
                logger.error(f"time_in was modified during punch out! Original: {original_time_in}, Current: {latest_session.time_in}")
                # Restore the original time_in
                latest_session.time_in = original_time_in
                latest_session.save()
            
            # Log after saving
            logger.info(f"After save - time_in: {latest_session.time_in}, time_out: {latest_session.time_out}")

            # Calculate session duration
            session_duration = latest_session.get_duration()
            
            return Response({
                'status': 'success',
                'action': 'punch_out',
                'time': now_company_tz.strftime("%H:%M:%S"),
                'session_duration': session_duration,
                'total_hours': float(attendance.total_hours or 0),
                'timezone': company_tz.zone
            }, status=200)
            
        except Exception as e:
            logger.error(f"Error during punch out: {e}")
            return Response({'error': 'Failed to punch out'}, status=500)

        

# to add a note to the corresponding punch out section

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from attendance.models import AttendanceSession, Attendance
from datetime import date
import pytz

class AddPunchOutNoteView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        note = request.data.get('note', '').strip()
        user = request.user
        employee = getattr(user, 'employee_db', None)

        if not employee:
            return Response({'error': 'Employee not found'}, status=404)

        today = timezone.localdate()

        # Get today’s attendance
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({'error': 'No attendance found for today.'}, status=404)

        # Get the latest session with a punch-out
        latest_session = attendance.sessions.filter(time_out__isnull=False).order_by('-time_out').first()

        if not latest_session:
            return Response({'error': 'No punch-out session found to add note.'}, status=400)

        latest_session.note = note if note else None
        latest_session.save()

        return Response({
            'status': 'success',
            'message': 'Note added to the latest attendance session'
        }, status=200)




from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin  # Adjust import based on your project
from .models import Attendance
from .serializers import AttendanceSerializer
from shared.pagination import CustomPagination

class AttendanceAdminListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'date']
    pagination_class = CustomPagination

    def get_queryset(self):
        user_company = self.request.user.company
        queryset = Attendance.objects.filter(
            employee__department__company=user_company
        ).order_by('-date')

        # Optional date filter
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)

        # Optional department filter
        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(employee__department_id=department_id)

        return queryset


    
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
from .models import Attendance
from .serializers import AttendanceDetailSerializer

class AttendanceDetailByDateView(APIView):
    permission_classes = [IsAuthenticated, IsHRorIsEmployee]

    def get(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)

        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Use today's date by default
        date_str = request.query_params.get('date')
        if date_str:
            try:
                selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            selected_date = timezone.localdate()

        try:
            attendance = Attendance.objects.get(employee=employee, date=selected_date)
            serializer = AttendanceDetailSerializer(attendance)
            return Response(serializer.data)
        except Attendance.DoesNotExist:
            return Response({'detail': f'No attendance recorded on {selected_date}.'}, status=status.HTTP_404_NOT_FOUND)

    

class AttendanceAdminDetailView(RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceDetailSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'id'     

