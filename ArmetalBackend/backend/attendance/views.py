from django.shortcuts import render
from datetime import datetime, time, timedelta
from django.utils import timezone



# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin,IsHRorIsEmployee
from rest_framework import status
from rest_framework import generics, filters
from .serializers import AttendanceSerializer,AttendanceSessionSerializer,AttendanceDetailSerializer
from rest_framework.generics import RetrieveAPIView
from shared.pagination import CustomPagination

import pytz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils.timezone_utils import get_company_timezone
from attendance.models import Attendance, AttendanceSession
from user.permissions import IsEmployee


class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=400)

        today = timezone.localdate()
        company_tz = get_company_timezone(employee)
        now = timezone.now().astimezone(company_tz)

        print("🌐 Company Timezone:", company_tz)
        print("🕒 Current Time:", now)

        attendance, _ = Attendance.objects.get_or_create(employee=employee, date=today)
        latest_session = attendance.sessions.last()

        # Case 1: No session or last session completed → Punch In
        if not latest_session or (latest_session.time_in and latest_session.time_out):
            session = AttendanceSession.objects.create(attendance=attendance, time_in=now)
            return Response({
                "message": "Punch In recorded",
                "time_in": now.strftime("%I:%M %p")
            })

        # Case 2: Ongoing session → Punch Out
        if latest_session.time_in and not latest_session.time_out:
            print(f"DEBUG: now type: {type(now)} | value: {now} | tzinfo: {now.tzinfo}")
            print(f"DEBUG: time_in type: {type(latest_session.time_in)} | value: {latest_session.time_in} | tzinfo: {latest_session.time_in.tzinfo}")
            print(f"🔍 Checking type of time_in: {type(latest_session.time_in)}")
            if isinstance(latest_session.time_in, time):
                today = timezone.localdate()  # or use latest_session.date if available
                datetime_in = datetime.combine(today, latest_session.time_in)
                datetime_in = timezone.make_aware(datetime_in, timezone=pytz.UTC)  # or your default
                time_in_local = convert_to_company_timezone(datetime_in, user_timezone)

                


            if now <= latest_session.time_in:


                return Response({
                    "message": "Invalid punch out time. Punch out must be after punch in.",
                    "time_in": latest_session.time_in.strftime("%I:%M %p"),
                    "attempted_time_out": now.strftime("%I:%M %p")
                }, status=400)

            try:
                latest_session.time_out = now
                latest_session.save()
                attendance.update_total_hours()

                return Response({
                    "message": "Punch Out recorded",
                    "time_out": now.strftime("%I:%M %p"),
                    "total_hours": attendance.total_hours
                })

            except Exception as e:
                print("❌ Error saving AttendanceSession:", str(e))
                return Response({
                    "message": "Failed to record punch out",
                    "error": str(e)
                }, status=500)

        return Response({"message": "Invalid session state."}, status=400)


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

