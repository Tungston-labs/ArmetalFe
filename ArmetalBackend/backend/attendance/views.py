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
from .utils.timezone_utils import get_company_timezone, convert_to_company_timezone
from user.permissions import IsEmployee, IsHRAdmin, IsHRorIsEmployee
import logging
from datetime import datetime, time
from django.utils import timezone
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
import pytz

logger = logging.getLogger(__name__)

class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        try:
            # 1. Initial Setup
            logger.info(f"Received swipe request: {request.data}")
            user = request.user
            logger.debug(f"Processing request for user: {user.id}")

            # 2. Employee Verification
            try:
                employee = user.employee_db
                if not employee:
                    logger.error(f"No employee record for user {user.id}")
                    return Response({'error': 'Employee profile not found'}, status=404)
                
                logger.debug(f"Employee found: {employee.id}")
            except Exception as e:
                logger.error(f"Employee lookup failed: {str(e)}")
                return Response({'error': 'Employee verification failed'}, status=400)

            # 3. Timezone Handling
            try:
                tz_string = employee.company.timezone or 'Asia/Kolkata'
                company_tz = pytz.timezone(tz_string)
                logger.debug(f"Using timezone: {company_tz.zone}")
            except Exception as e:
                logger.error(f"Timezone error: {str(e)}")
                return Response({'error': 'Invalid timezone configuration'}, status=500)

            # 4. Timestamp Processing
            try:
                if 'timestamp' in request.data:
                    timestamp_str = request.data['timestamp']
                    if timestamp_str.endswith('Z'):
                        timestamp_str = timestamp_str[:-1] + '+00:00'
                    now = timezone.make_aware(
                        parse_datetime(timestamp_str),
                        timezone=pytz.UTC
                    ).astimezone(company_tz)
                    logger.debug(f"Using provided timestamp: {now}")
                else:
                    now = timezone.now().astimezone(company_tz)
                    logger.debug(f"Using current time: {now}")
            except Exception as e:
                logger.error(f"Timestamp processing failed: {str(e)}")
                return Response({'error': 'Invalid timestamp format'}, status=400)

            today = now.date()

            # 5. Attendance Record Handling
            try:
                attendance, created = Attendance.objects.get_or_create(
                    employee=employee,
                    date=today
                )
                latest_session = attendance.sessions.last()
                logger.debug(f"Attendance record: {attendance.id}, Last session: {latest_session.id if latest_session else None}")
            except Exception as e:
                logger.error(f"Attendance record error: {str(e)}")
                return Response({'error': 'Failed to access attendance records'}, status=500)

            # 6. Punch In/Out Logic
            if not latest_session or latest_session.time_out:
                # Punch In Case
                try:
                    session = AttendanceSession.objects.create(
                        attendance=attendance,
                        time_in=now,
                        timezone=company_tz.zone
                    )
                    logger.info(f"Punch IN recorded for {employee.id} at {now}")
                    return Response({
                        'status': 'success',
                        'action': 'punch_in',
                        'time': now.strftime("%H:%M:%S"),
                        'date': today.isoformat(),
                        'timezone': company_tz.zone
                    }, status=201)
                except Exception as e:
                    logger.error(f"Punch IN failed: {str(e)}")
                    return Response({'error': 'Failed to record punch in'}, status=500)
            else:
                # Punch Out Case
                try:
                    time_in = latest_session.time_in
                    
                    # Handle both time and datetime objects
                    if isinstance(time_in, time):
                        time_in = timezone.make_aware(
                            datetime.combine(today, time_in),
                            timezone=company_tz
                        )
                        logger.debug(f"Converted time object to datetime: {time_in}")
                    elif timezone.is_naive(time_in):
                        time_in = timezone.make_aware(time_in, timezone=company_tz)
                        logger.debug(f"Made naive datetime timezone-aware: {time_in}")
                    else:
                        time_in = time_in.astimezone(company_tz)
                        logger.debug(f"Converted existing datetime to company tz: {time_in}")

                    # Validation
                    if now <= time_in:
                        logger.warning(f"Invalid punch out time for {employee.id}")
                        return Response({
                            'error': 'Punch out must be after punch in',
                            'punch_in': time_in.strftime("%Y-%m-%d %H:%M:%S"),
                            'attempted_punch_out': now.strftime("%Y-%m-%d %H:%M:%S")
                        }, status=400)

                    # Minimum duration check (1 minute)
                    if (now - time_in).total_seconds() < 60:
                        logger.warning(f"Session too short for {employee.id}")
                        return Response({
                            'error': 'Minimum session duration is 1 minute'
                        }, status=400)

                    latest_session.time_out = now
                    latest_session.save()
                    attendance.update_total_hours()
                    
                    logger.info(f"Punch OUT recorded for {employee.id} at {now}")
                    return Response({
                        'status': 'success',
                        'action': 'punch_out',
                        'time': now.strftime("%H:%M:%S"),
                        'total_hours': float(attendance.total_hours),
                        'timezone': company_tz.zone
                    })
                except Exception as e:
                    logger.error(f"Punch OUT failed: {str(e)}")
                    return Response({'error': 'Failed to record punch out'}, status=500)

        except Exception as e:
            logger.critical(f"Unhandled exception in swipe endpoint: {str(e)}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=500)

# HR - attendance view to list all employees attendance



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

        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)

        return queryset

    
class TodayAttendanceDetailView(APIView):
    permission_classes = [IsAuthenticated,IsHRorIsEmployee]

    def get(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_400_BAD_REQUEST)

        today = timezone.localdate()

        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({'detail': 'No attendance recorded today.'}, status=status.HTTP_404_NOT_FOUND)

        from .serializers import AttendanceDetailSerializer
        serializer = AttendanceDetailSerializer(attendance)
        return Response(serializer.data)
    

class AttendanceAdminDetailView(RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceDetailSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'id'     

