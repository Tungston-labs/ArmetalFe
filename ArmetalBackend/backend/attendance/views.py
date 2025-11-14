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
from project.models import Project  # Import your Project model
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

            # ✅ Step 1: Get punch type (company/onsite)
            project = Project.objects.filter(employees=employee).first()
            punch_type = project.punch_type.lower() if project else "company"

            # ✅ Step 2: Validate distance

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

from rest_framework.exceptions import ValidationError
from django.db.models import Max, Min, Case, When, IntegerField

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

        # Step 1 → Find latest attendance date for each employee in dept
        latest_attendance = (
            Attendance.objects
            .filter(employee__department_id=department_id)
            .values('employee')
            .annotate(latest_date=Max('date'))
        )

        # Convert to dict: {employee_id: latest_date}
        latest_map = {
            item['employee']: item['latest_date']
            for item in latest_attendance
        }

        # Step 2 → Get attendance rows matching latest date per employee
        queryset = Attendance.objects.filter(
            employee__in=latest_map.keys(),
            date__in=latest_map.values()
        ).annotate(
            first_punch_in=Min('sessions__time_in')
        )

        # Final ordering → latest date first
        queryset = queryset.order_by(
            '-date',
            Case(
                When(first_punch_in__isnull=True, then=1),
                default=0,
                output_field=IntegerField()
            ),
            'first_punch_in'
        )

        return queryset



class EmployeeSearchView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        query = request.GET.get("q", "").strip()

        if not query:
            return Response([])

        # Step 1 → Filter employees by search
        employees = (
            Employee_db.objects.filter(name__icontains=query)
            .select_related("department")
            .prefetch_related("attendance_set")
        )

        final_results = []

        for emp in employees:
            attendance = emp.attendance_set.order_by('-date').first()

            final_results.append({
                "id": emp.id,
                "employee_name": emp.name,
                "employee_id": emp.employee_id,
                "department": {
                    "id": emp.department.id,
                    "name": emp.department.name
                },
                "date": attendance.date if attendance else None,
                "time_in": attendance.sessions.first().time_in if attendance and attendance.sessions.exists() else None,
                "time_out": attendance.sessions.last().time_out if attendance and attendance.sessions.exists() else None,
            })

        return Response(final_results)



# -----------------------------------------------------attendance detail view group by date(admin)


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

# -----------------------------------------------------attendance list view (for admin)
class AttendanceAdminDetailView(RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceDetailSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        attendance_id = kwargs.get('id')
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
