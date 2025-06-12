from django.shortcuts import render

# views.py
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin
from django.utils import timezone
from rest_framework import status
from rest_framework import generics, filters
from .serializers import AttendanceSerializer

class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=400)

        today = timezone.localdate()
        now_time = timezone.localtime().time()

        attendance, created = Attendance.objects.get_or_create(employee=employee, date=today)

        # Get latest session
        latest_session = attendance.sessions.last()

        if not latest_session or latest_session.time_out:  # Punch In
            session = AttendanceSession.objects.create(attendance=attendance, time_in=now_time)
            return Response({"message": "Punch In recorded", "time_in": session.time_in})

        elif latest_session.time_in and not latest_session.time_out:  # Punch Out
            latest_session.time_out = now_time
            latest_session.save()

            # Update total hours
            attendance.update_total_hours()

            return Response({
                "message": "Punch Out recorded",
                "time_out": latest_session.time_out,
                "total_hours": attendance.total_hours
            })

        return Response({"message": "Invalid swipe action."}, status=400)



# HR - attendance view to list all employees attendance



class AttendanceAdminListView(generics.ListAPIView):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id', 'date']  # Optional filtering


class TodayAttendanceDetailView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

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

