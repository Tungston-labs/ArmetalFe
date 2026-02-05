from django.shortcuts import render
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from datetime import datetime,time,date,timedelta
from rest_framework import status, generics, filters
from rest_framework.generics import RetrieveAPIView
from employee.models import Employee_db
from .serializers import AttendanceSerializer, AttendanceSessionSerializer, AttendanceDetailSerializer,AttendanceLocationSerializer
from shared.pagination import CustomPagination
from .utils.timezone_utils import get_company_timezone, ensure_timezone,safe_parse_datetime
from user.permissions import IsEmployee, IsHRAdmin, IsHRorIsEmployee
import pytz
from geopy.distance import geodesic
import logging
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from project.models import Project
from django.db.models import Q
from geopy.geocoders import Nominatim
from django.utils import timezone
from attendance.models import AttendanceSession, Attendance
from shared.pagination import CustomPagination
from rest_framework.exceptions import ValidationError
from rest_framework import status
logger = logging.getLogger(__name__)

# --------------------------------------------------------------view for swipe in/out
class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            employee = getattr(user, 'employee_db', None)

            if not employee:
                return Response({'error': 'Employee not found'}, status=404)

            emp_lat = request.data.get("latitude")
            emp_lon = request.data.get("longitude")
            if emp_lat is None or emp_lon is None:
                return Response({"error": "Latitude and longitude are required"}, status=400)

            emp_lat, emp_lon = float(emp_lat), float(emp_lon)

            # ✅ Step 1: Get project & validate status
            project = Project.objects.filter(employees=employee).first()

            if project:
                if project.status != "in_progress":
                    return Response(
                        {"error": f"Your project '{project.name}' is not active (status: {project.status}). Punching is not allowed."},
                        status=400
                    )
                punch_type = project.punch_type.lower()
            else:
                punch_type = "company"  # No project then company punch rules



            # ✅ Step 2: Validate distance based on punch type
            if punch_type == "onsite":
                project_location = (float(project.latitude), float(project.longitude))
                employee_location = (emp_lat, emp_lon)
                distance_project = geodesic(employee_location, project_location).meters

                company = employee.department.company
                company_location = (float(company.latitude), float(company.longitude))
                distance_company = geodesic(employee_location, company_location).meters

                # Allow if within 50m of project OR company
                if distance_project > 50 and distance_company > 50:
                    return Response(
                        {"error": f"You are too far from project/company site "
                                f"(Project: {int(distance_project)}m, Company: {int(distance_company)}m). "
                                f"Must be within 50m of either."},
                        status=400
                    )
                
            elif punch_type == "bench":
                company = employee.department.company
                company_location = (float(company.latitude), float(company.longitude))
                employee_location = (emp_lat, emp_lon)
                distance = geodesic(employee_location, company_location).meters
                if distance > 50:
                    return Response(
                        {"error": f"Bench employees must punch from company location ({int(distance)}m). Allowed within 50m."},
                        status=400
                    )    

            elif punch_type == "company":
                company = employee.department.company
                company_location = (float(company.latitude), float(company.longitude))
                employee_location = (emp_lat, emp_lon)
                distance = geodesic(employee_location, company_location).meters
                if distance > 50:
                    return Response(
                        {"error": f"You are too far from company location ({int(distance)}m). Must be within 50m."},
                        status=400
                    )

            elif punch_type == "variant":
                # Variant employees can punch in/out from anywhere
                pass
            else:
                # Default fallback (optional)
                return Response({"error": f"Invalid punch type: {punch_type}"}, status=400)

            # ✅ Step 3: Address & timezone
            address = self._get_location_address(emp_lat, emp_lon)
            company_tz = get_company_timezone(employee)
            now_utc = timezone.now()
            now_company_tz = now_utc.astimezone(company_tz)
            today = now_company_tz.date()

            # ✅ Step 4: Check if employee is on approved leave today
            from leave.models import LeaveRequest
            is_on_leave = LeaveRequest.objects.filter(
                employee=employee,
                status="approved",
                from_date__lte=today,
                to_date__gte=today
            ).exists()

            if is_on_leave:
                return Response(
                    {"error": "You are currently on approved leave and cannot mark attendance."},
                    status=400
                )

            # ✅ Step 5: Attendance logic
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


# ----------------------------------to add a note to the corresponding punch out section



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






# -----------------------------------------------------view for list attendance for admin

from datetime import date as today_date
from django.db.models import Min, Case, When, IntegerField, BooleanField, Count, Q
from rest_framework import generics, filters
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from employee.models import Employee_db
from attendance.models import Attendance
from .serializers import AttendanceSerializer
from django.db import models
from django.db.models import OuterRef, Subquery, BooleanField, Case, When, Value
from django.db.models.functions import Coalesce

# -----------------------------------------------------view for list attendance for admin

from datetime import date as today_date

from django.db.models import OuterRef, Subquery, BooleanField, Case, When, Value, F
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from employee.models import Employee_db
from attendance.models import Attendance, AttendanceSession
from .serializers import AttendanceSerializer


from django.db.models import OuterRef, Subquery, F, Value, Case, When, BooleanField



class AttendanceAdminListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        department_id = self.request.query_params.get("department_id")
        selected_date = self.request.query_params.get("date") or today_date.today()

        if not department_id:
            raise ValidationError({"department_id": "department_id is required"})

        # Attendance for selected day
        attendance_qs = Attendance.objects.filter(
            employee=OuterRef("pk"),
            date=selected_date,
        )

        # First session
        first_session = AttendanceSession.objects.filter(
            attendance__employee=OuterRef("pk"),
            attendance__date=selected_date,
        ).order_by("time_in")

        # Last session
        last_session = AttendanceSession.objects.filter(
            attendance__employee=OuterRef("pk"),
            attendance__date=selected_date,
        ).order_by("-time_out")

        queryset = (
            Employee_db.objects
            .filter(department_id=department_id)
            .annotate(
                date=Subquery(attendance_qs.values("date")[:1]),
                total_hours=Subquery(attendance_qs.values("total_hours")[:1]),
                attendance_id=Subquery(attendance_qs.values("id")[:1]),  # ✅ annotated attendance id
                first_swipe_in=Subquery(first_session.values("time_in")[:1]),
                last_swipe_out=Subquery(last_session.values("time_out")[:1]),
                attendance_today=Case(
                    When(total_hours__isnull=False, then=Value(True)),
                    default=Value(False),
                    output_field=BooleanField(),
                ),
            )
            .order_by(F("first_swipe_in").asc(nulls_last=True))
        )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        swiped_count = queryset.filter(attendance_today=True).count()
        total_count = queryset.count()

        response = super().list(request, *args, **kwargs)

        # Add extra info to response
        response.data["swiped_employee_count"] = swiped_count
        response.data["total_employee_count"] = total_count

        return response


# -----------------------------------------------------attendance detail view group by date(admin)


# class AttendanceDetailByDateView(APIView):
#     permission_classes = [IsAuthenticated, IsHRorIsEmployee]

#     def get(self, request):
#         user = request.user
#         employee = getattr(user, 'employee_db', None)

#         if not employee:
#             return Response({'detail': 'Employee not found.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Use today's date by default
#         date_str = request.query_params.get('date')
#         if date_str:
#             try:
#                 selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
#             except ValueError:
#                 return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             selected_date = timezone.localdate()

#         try:
#             attendance = Attendance.objects.get(employee=employee, date=selected_date)
#             serializer = AttendanceDetailSerializer(attendance)
#             return Response(serializer.data)
#         except Attendance.DoesNotExist:
#             return Response({'detail': f'No attendance recorded on {selected_date}.'}, status=status.HTTP_404_NOT_FOUND)

from django.utils.dateparse import parse_date, parse_datetime

class AttendanceDetailByDateView(APIView):
    permission_classes = [IsAuthenticated, IsHRorIsEmployee]

    def get(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        print("USER ID:", request.user.id)
        print("USERNAME:", request.user.username)
        print("HAS EMPLOYEE:", hasattr(request.user, "employee_db"))


        if not employee:
            return Response(
                {'detail': 'Employee not found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        date_param = request.query_params.get('date')

        if date_param:
            # Handle both date & datetime formats (iOS safe)
            parsed_date = parse_date(date_param)

            if not parsed_date:
                parsed_datetime = parse_datetime(date_param)
                if parsed_datetime:
                    parsed_date = parsed_datetime.date()

            if not parsed_date:
                return Response(
                    {'detail': 'Invalid date format.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            selected_date = parsed_date
        else:
            selected_date = timezone.localdate()

        attendance = Attendance.objects.filter(
            employee=employee,
            date=selected_date
        ).first()

        if not attendance:
            return Response(
                {
                    'detail': 'No attendance found',
                    'date': selected_date
                },
                status=status.HTTP_200_OK  # IMPORTANT for mobile
            )

        serializer = AttendanceDetailSerializer(attendance)
        return Response(serializer.data)


# -----------------------------------------------------attendance list view (for admin)
class AttendanceAdminDetailView(RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceDetailSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        attendance_id = kwargs.get(self.lookup_field)
        date_str = request.query_params.get('date')

        # ✅ Base attendance record (for employee context)
        try:
            base_attendance = Attendance.objects.select_related('employee').get(id=attendance_id)
        except Attendance.DoesNotExist:
            return Response({"error": "Attendance not found"}, status=404)

        # ✅ If ?date= provided → get record for that employee/date
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

            attendance = Attendance.objects.filter(
                employee=base_attendance.employee,
                date=date_obj
            ).first()

            # ⚠️ If no attendance found for that date, still return basic info
            if not attendance:
                serializer = self.get_serializer(base_attendance)
                data = serializer.data

                # Wipe out time/session info (make it clear this date has no attendance)
                data.update({
                    "date": str(date_obj),
                    "sessions": [],
                    "total_hours": None,
                    "status": "Absent",
                    "note": f"No attendance available for {date_obj}"
                })

                return Response(data, status=200)

            serializer = self.get_serializer(attendance)
            return Response(serializer.data)

        # ✅ Default → show normal attendance by ID
        serializer = self.get_serializer(base_attendance)
        return Response(serializer.data)


# -----------------------------------------------------one hour location update from mobile app and view by admin

logger = logging.getLogger(__name__)

class AttendanceLocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Append employee's current location to today's attendance.
        Must be called after first punch-in.
        """
        serializer = AttendanceLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = request.user
            # Fetch employee linked to the logged-in user
            employee = Employee_db.objects.get(user=user)
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=404)

        # Get today's attendance
        today = timezone.localdate()
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
        except Attendance.DoesNotExist:
            return Response({"detail": "No active attendance session. Punch in first."},
                            status=400)

        # Append location
        loc_data = {
            "location": serializer.validated_data["location"],
            "timestamp": serializer.validated_data.get("timestamp", timezone.now().isoformat())
        }

        if attendance.locations is None:
            attendance.locations = []

        attendance.locations.append(loc_data)
        attendance.save(update_fields=['locations'])

        logger.info(f"Location updated for employee {employee.id}: {loc_data}")

        return Response({
            "detail": "Location updated successfully.",
            "locations": attendance.locations
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime, time

from employee.models import Employee_db
from .models import HourlyLocationLog
from .serializers import HourlyLocationLogSerializer
from .utils.geocoding_utils import get_location_name_sync
from shared.pagination import HourlyLocationLogPagination  # Import the pagination class

class BackgroundLocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        """
        Return background location logs for the given employee filtered by date
        with pagination.
        """
        try:
            employee = Employee_db.objects.get(id=employee_id)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        logs_qs = HourlyLocationLog.objects.filter(employee=employee).order_by("-logged_at")

        # Filter by date, from_date, to_date
        date_str = request.query_params.get("date")
        from_date_str = request.query_params.get("from_date")
        to_date_str = request.query_params.get("to_date")

        try:
            if date_str:
                date_obj = parse_date(date_str)
                if date_obj:
                    start = timezone.make_aware(datetime.combine(date_obj, time.min))
                    end = timezone.make_aware(datetime.combine(date_obj, time.max))
                    logs_qs = logs_qs.filter(logged_at__gte=start, logged_at__lte=end)
            
            elif from_date_str or to_date_str:
                if from_date_str:
                    from_date = parse_date(from_date_str)
                    if from_date:
                        start = timezone.make_aware(datetime.combine(from_date, time.min))
                        logs_qs = logs_qs.filter(logged_at__gte=start)
                if to_date_str:
                    to_date = parse_date(to_date_str)
                    if to_date:
                        end = timezone.make_aware(datetime.combine(to_date, time.max))
                        logs_qs = logs_qs.filter(logged_at__lte=end)
        except Exception:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Pagination
        paginator = HourlyLocationLogPagination()
        page = paginator.paginate_queryset(logs_qs, request)
        serializer = HourlyLocationLogSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, employee_id):
        """
        Save background location updates from mobile app.
        Reverse geocode latitude & longitude to get location_name.
        """
        try:
            employee = Employee_db.objects.get(id=employee_id)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data["employee"] = employee.id

        serializer = HourlyLocationLogSerializer(data=data)
        if serializer.is_valid():
            obj = serializer.save()
            print(f"🌍 Calling geocoding for lat={obj.latitude}, lon={obj.longitude}")

            if obj.latitude is not None and obj.longitude is not None:
                try:
                    obj.location_name = get_location_name_sync(obj.latitude, obj.longitude)
                    obj.save(update_fields=["location_name"])
                    print(f" Saved location_name '{obj.location_name}' for employee {employee_id}")
                except Exception as e:
                    print(f"⚠️ Geocoding failed for employee {employee_id}: {e}")

            return Response({"status": "success"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# payroll/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import date
import calendar

from employee.models import Employee_db
from .serializers import EmployeeAttendanceSummarySerializer
from .utils.dayscalculations import build_employee_month_calendar


class EmployeeAttendanceSummaryView(generics.ListAPIView):
    serializer_class = EmployeeAttendanceSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        qs = Employee_db.objects.select_related(
            "department", "department__company"
        ).prefetch_related(
            "attendances__sessions"
        ).filter(department__company=user.company)

        # Employee should see only their own attendance
        if user.is_employee:
            qs = qs.filter(user=user)

        return qs

    def list(self, request, *args, **kwargs):
        today = date.today()

        year = int(request.query_params.get("year", today.year))
        month = int(request.query_params.get("month", today.month))

        start_date = date(year, month, 1)
        end_date = date(year, month, calendar.monthrange(year, month)[1])

        employees = self.get_queryset()

        results = []

        for emp in employees:
            working_days, present_days, absent_days, lop_days, daily_records = (
                build_employee_month_calendar(emp, start_date, end_date)
            )

            results.append({
                "employee_id": emp.employee_id,
                "employee_name": emp.name,
                "department": emp.department.name if emp.department else None,
                "working_days": working_days,
                "present_days": present_days,
                "absent_days": absent_days,
                "lop_days": lop_days,
                "daily_records": daily_records,
            })

        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
