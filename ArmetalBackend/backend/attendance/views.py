from django.shortcuts import render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

from datetime import datetime
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


class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=400)

        company_tz = get_company_timezone(employee)
        today = timezone.now().astimezone(company_tz).date()

        # Parse timestamp or use current time
        timestamp_str = request.data.get("timestamp")
        if timestamp_str:
            try:
                if timestamp_str.endswith('Z'):
                    timestamp_str = timestamp_str.replace('Z', '+00:00')
                now = parse_datetime(timestamp_str)
                if now is None:
                    raise ValueError("Invalid timestamp format")
                if timezone.is_naive(now):
                    now = timezone.make_aware(now, timezone.utc)
                now = now.astimezone(company_tz)
            except Exception as e:
                return Response({"error": f"Invalid timestamp: {str(e)}"}, status=400)
        else:
            now = timezone.now().astimezone(company_tz)

        attendance, _ = Attendance.objects.get_or_create(
            employee=employee, 
            date=today
        )
        latest_session = attendance.sessions.last()

        # Case 1: No session or last session completed → Punch In
        if not latest_session or (latest_session.time_in and latest_session.time_out):
            session = AttendanceSession.objects.create(
                attendance=attendance,
                time_in=now,
                timezone=str(company_tz)
            )
            return Response({
                "message": "Punch In recorded",
                "time_in": now.astimezone(company_tz).strftime("%I:%M %p"),
                "date": now.date().isoformat()
            })

        # Case 2: Ongoing session → Punch Out
        if latest_session.time_in and not latest_session.time_out:
            # Ensure we're comparing in the same timezone
            time_in = latest_session.time_in.astimezone(company_tz)
            now = now.astimezone(company_tz)

            # Validate punch out time
            if now <= time_in:
                return Response({
                    "message": "Invalid punch out time",
                    "details": {
                        "punch_in": time_in.strftime("%Y-%m-%d %I:%M %p"),
                        "attempted_punch_out": now.strftime("%Y-%m-%d %I:%M %p")
                    }
                }, status=400)

            try:
                latest_session.time_out = now
                latest_session.save()
                attendance.update_total_hours()
                
                return Response({
                    "message": "Punch Out recorded",
                    "time_out": now.strftime("%I:%M %p"),
                    "total_hours": attendance.total_hours,
                    "date": now.date().isoformat()
                })
            except Exception as e:
                return Response({
                    "message": "Failed to record punch out",
                    "error": str(e)
                }, status=500)

        return Response({"message": "Invalid session state"}, status=400)

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

