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
class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=400)

        # Get company timezone (already returns a timezone object)
        company_tz = get_company_timezone(employee)
        today = timezone.now().astimezone(company_tz).date()

        # Handle timestamp input
        timestamp_str = request.data.get("timestamp")
        try:
            if timestamp_str:
                if timestamp_str.endswith('Z'):
                    timestamp_str = timestamp_str[:-1] + '+00:00'
                now = parse_datetime(timestamp_str)
                if not now:
                    raise ValueError("Invalid timestamp format")
            else:
                now = timezone.now()
            
            # Ensure timezone awareness
            if timezone.is_naive(now):
                now = timezone.make_aware(now, timezone.utc)
            now = now.astimezone(company_tz)
        except Exception as e:
            return Response({"error": f"Time processing error: {str(e)}"}, status=400)

        # Get or create attendance record
        attendance, _ = Attendance.objects.get_or_create(
            employee=employee,
            date=today
        )
        latest_session = attendance.sessions.last()

        # Case 1: New session (punch in)
        if not latest_session or (latest_session.time_out is not None):
            try:
                session = AttendanceSession.objects.create(
                    attendance=attendance,
                    time_in=now,
                    timezone=str(company_tz)
                )  # Fixed missing parenthesis here
                
                return Response({
                    "status": "success",
                    "action": "punch_in",
                    "time": now.strftime("%I:%M %p"),
                    "date": now.date().isoformat()
                }, status=201)
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        # Case 2: Existing session needs punch out
        if latest_session.time_in and not latest_session.time_out:
            try:
                # Convert stored time_in to datetime for comparison
                time_in = latest_session.time_in
                
                # Handle case where time_in might be stored as time object
                if isinstance(time_in, time):
                    time_in = datetime.combine(today, time_in)
                    time_in = timezone.make_aware(time_in, company_tz)
                
                # Final validation
                if now <= time_in:
                    return Response({
                        "error": "Punch out must be after punch in",
                        "punch_in": time_in.astimezone(company_tz).strftime("%Y-%m-%d %I:%M %p"),
                        "attempted_out": now.strftime("%Y-%m-%d %I:%M %p")
                    }, status=400)

                latest_session.time_out = now
                latest_session.save()
                attendance.update_total_hours()
                
                return Response({
                    "status": "success",
                    "action": "punch_out",
                    "time": now.strftime("%I:%M %p"),
                    "total_hours": float(attendance.total_hours)
                })
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        return Response({"error": "Invalid session state"}, status=400)

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

