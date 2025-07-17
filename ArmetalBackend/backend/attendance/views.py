from django.shortcuts import render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

import datetime
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

        today = timezone.localdate()
        company_tz = get_company_timezone(employee)

        timestamp_str = request.data.get("timestamp")
        if timestamp_str:
            try:
                # ✅ Remove trailing 'Z' and replace with +00:00 to make it ISO compliant
                if timestamp_str.endswith('Z'):
                    timestamp_str = timestamp_str.replace('Z', '+00:00')

                now = parse_datetime(timestamp_str)
                if now is None:
                    raise ValueError("Could not parse timestamp")

                # Make timezone-aware if needed
                if timezone.is_naive(now):
                    now = timezone.make_aware(now, timezone.utc)

                now = now.astimezone(company_tz)
            except Exception as e:
                print("❌ Invalid timestamp:", timestamp_str, "| Error:", str(e))
                return Response({"error": "Invalid timestamp format"}, status=400)
        else:
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
            user_timezone = request.data.get('timezone', str(company_tz))

            datetime_in = latest_session.time_in

            # 🔧 Ensure datetime_in is a datetime object
           # 🔧 If datetime_in is a time object, combine with today’s date
           
          # Ensure datetime_in is a datetime object and timezone-aware
        if not isinstance(datetime_in, datetime):
            return Response({"error": "Invalid time_in format"}, status=400)

        if timezone.is_naive(datetime_in):
            datetime_in = timezone.make_aware(datetime_in, timezone=pytz.UTC)


            try:
                time_in_local = convert_to_company_timezone(datetime_in, employee)

            except Exception as e:
                print("⛔ ERROR converting timezone:", str(e))
                return Response({"error": "Failed to convert timezone"}, status=500)

            print(f"🧠 now: {now} | time_in_local: {time_in_local}")

            if time_in_local is not None and now <= time_in_local:
                return Response({
                    "message": "Invalid punch out time. Punch out must be after punch in.",
                    "time_in": time_in_local.strftime("%I:%M %p"),
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

