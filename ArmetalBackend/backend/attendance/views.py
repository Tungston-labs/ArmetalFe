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
from geopy.distance import geodesic
import logging
from datetime import datetime, time
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Attendance, AttendanceSession
# attendance/views.py

from project.models import Project  # Import your Project model
from django.db.models import Q
from geopy.geocoders import Nominatim
logger = logging.getLogger(__name__)


class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            employee = getattr(user, 'employee_db', None)
            logger.info(f"AttendanceSwipeView request.data={request.data}")

            if not employee:
                return Response({'error': 'Employee not found'}, status=404)

            # ✅ Step 1: Check if employee is assigned to a project
            project = Project.objects.filter(employees=employee).first()
            if not project:
                return Response({'error': 'Employee not assigned to any project'}, status=400)

            emp_lat = request.data.get("latitude")
            emp_lon = request.data.get("longitude")
            if emp_lat is None or emp_lon is None:
                return Response({"error": "Latitude and longitude are required"}, status=400)

            try:
                emp_lat, emp_lon = float(emp_lat), float(emp_lon)
            except ValueError:
                return Response({"error": "Invalid latitude/longitude"}, status=400)

            # ✅ Step 2: Determine punch type
            punch_type = project.punch_in_type.lower()  # 'onsite' or 'variant'

            # ✅ Step 3: Validate location only for onsite
            if punch_type == "onsite":
                project_location = (float(project.latitude), float(project.longitude))
                employee_location = (emp_lat, emp_lon)
                distance = geodesic(employee_location, project_location).meters

                if distance > 50:
                    return Response({
                        "error": f"You are too far from the project site ({int(distance)}m). Must be within 50m."
                    }, status=400)

            # ✅ Step 4: Get readable address from lat/lon (optional)
            address = self._get_location_address(emp_lat, emp_lon)

            # ✅ Step 5: Proceed with punch logic
            company_tz = get_company_timezone(employee)
            now_utc = timezone.now()
            now_company_tz = now_utc.astimezone(company_tz)
            today = now_company_tz.date()

            attendance, _ = Attendance.objects.get_or_create(employee=employee, date=today)
            latest_session = attendance.sessions.last()
            should_punch_in = self._should_punch_in(latest_session)

            if should_punch_in:
                return self._handle_punch_in(attendance, now_company_tz, company_tz, emp_lat, emp_lon, address)
            else:
                return self._handle_punch_out(latest_session, now_company_tz, company_tz, emp_lat, emp_lon, address, attendance)

        except Exception as e:
            logger.critical(f"Unhandled error in AttendanceSwipeView: {e}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=500)

    def _should_punch_in(self, latest_session):
        if not latest_session:
            return True
        if not latest_session.time_out:
            return False
        return True

    def _handle_punch_in(self, attendance, now_company_tz, company_tz, lat, lon, address):
        try:
            session = AttendanceSession.objects.create(
                attendance=attendance,
                time_in=now_company_tz,
                timezone=company_tz.zone,
                punch_in_latitude=lat,
                punch_in_longitude=lon,
                punch_in_location=address
            )
            return Response({
                'status': 'success',
                'action': 'punch_in',
                'time': now_company_tz.strftime("%H:%M:%S"),
                'date': now_company_tz.date().isoformat(),
                'session_id': session.id,
                'location': address
            }, status=201)
        except Exception as e:
            logger.error(f"Error during punch in: {e}")
            return Response({'error': 'Failed to punch in'}, status=500)

    def _handle_punch_out(self, latest_session, now_company_tz, company_tz, lat, lon, address, attendance):
        try:
            time_in = latest_session.time_in
            if isinstance(time_in, time):
                time_in = datetime.combine(attendance.date, time_in)
                time_in = company_tz.localize(time_in)

            if now_company_tz <= time_in:
                return Response({
                    'error': 'Punch out must be after punch in',
                }, status=400)

            latest_session.time_out = now_company_tz
            latest_session.punch_out_latitude = lat
            latest_session.punch_out_longitude = lon
            latest_session.punch_out_location = address
            latest_session.save()

            session_duration = latest_session.get_duration()

            return Response({
                'status': 'success',
                'action': 'punch_out',
                'time': now_company_tz.strftime("%H:%M:%S"),
                'session_duration': session_duration,
                'location': address,
                'timezone': company_tz.zone
            }, status=200)
        except Exception as e:
            logger.error(f"Error during punch out: {e}")
            return Response({'error': 'Failed to punch out'}, status=500)

    def _get_location_address(self, lat, lon):
        """Convert lat/lon to human-readable address (optional)"""
        try:
            geolocator = Nominatim(user_agent="attendance_app")
            location = geolocator.reverse(f"{lat}, {lon}")
            return location.address if location else None
        except Exception as e:
            logger.warning(f"Geocoding failed: {e}")
            return None


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
from rest_framework.exceptions import ValidationError



class AttendanceAdminListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'date']
    pagination_class = CustomPagination

    def get_queryset(self):
        department_id = self.request.query_params.get('department_id')
        if not department_id:
            raise ValidationError({"department_id": "This query parameter is required."})

        queryset = Attendance.objects.filter(
            employee__department_id=department_id
        ).order_by('-date')

        # Optional date filter
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)

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

