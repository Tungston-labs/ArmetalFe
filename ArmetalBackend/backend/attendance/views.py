from django.shortcuts import render

# views.py
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin,IsHRorIsEmployee
from django.utils import timezone
from rest_framework import status
from rest_framework import generics, filters
from .serializers import AttendanceSerializer,AttendanceSessionSerializer,AttendanceDetailSerializer
from rest_framework.generics import RetrieveAPIView
from shared.pagination import CustomPagination

import pytz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
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

        # 🔥 Get current time in company timezone
        company_tz = get_company_timezone(employee)
        now = timezone.now().astimezone(company_tz)
        print("COMPANY TIMEZONE:", company_tz)
        print("NOW:", now)


        attendance, _ = Attendance.objects.get_or_create(employee=employee, date=today)
        latest_session = attendance.sessions.last()

        if not latest_session or (latest_session.time_in and latest_session.time_out):
            session = AttendanceSession.objects.create(attendance=attendance, time_in=now)
            return Response({
    "message": "Punch In recorded",
    "time_in": now.strftime("%I:%M %p")
})


        if latest_session.time_in and not latest_session.time_out:
            latest_session.time_out = now
            latest_session.save()
            attendance.update_total_hours()
            return Response({
                "message": "Punch Out recorded",
                "time_out": now.strftime("%I:%M %p"),
                "total_hours": attendance.total_hours
            })

        return Response({"message": "Invalid session state."}, status=400)



# HR - attendance view to list all employees attendance



class AttendanceAdminListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'date']
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date')
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

