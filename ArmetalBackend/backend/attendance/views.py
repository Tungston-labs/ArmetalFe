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


logger = logging.getLogger(__name__)
class AttendanceSwipeView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        try:
            # 1. Initial Setup
            user = request.user
            logger.info(f"Processing swipe for user {user.id}")

            # 2. Employee Verification
            try:
                employee = user.employee_db
                if not employee:
                    return Response({'error': 'Employee not found'}, status=404)
                
                company_tz = get_company_timezone(employee)
                logger.debug(f"Using timezone: {company_tz.zone}")
            except Exception as e:
                logger.error(f"Employee setup failed: {e}")
                return Response({'error': 'Employee verification failed'}, status=400)

            # 3. Timestamp Processing
            try:
                if 'timestamp' in request.data:
                    print('timestamp ',request.data)
                    timestamp = request.data['timestamp']
                    if isinstance(timestamp, str):
                        now = safe_parse_datetime(timestamp)
                    else:
                        now = datetime.fromtimestamp(timestamp)
                    
                    now = ensure_timezone(now, pytz.UTC).astimezone(company_tz)
                else:
                    now = timezone.now().astimezone(company_tz)
                
                logger.debug(f"Processed time: {now}")
            except Exception as e:
                logger.error(f"Time processing failed: {e}")
                return Response({'error': 'Invalid time format'}, status=400)

            today = now.date()

            # 4. Attendance Record Handling
            try:
                attendance, _ = Attendance.objects.get_or_create(
                    employee=employee,
                    date=today
                )
                latest_session = attendance.sessions.last()
            except Exception as e:
                logger.error(f"Attendance access failed: {e}")
                return Response({'error': 'Attendance system error'}, status=500)

            # 5. Punch In/Out Logic
            if not latest_session or latest_session.time_out:
                # Punch In
                try:
                    session = AttendanceSession.objects.create(
                        attendance=attendance,
                        time_in=now,
                        timezone=company_tz.zone
                    )
                    return Response({
                        'status': 'success',
                        'action': 'punch_in',
                        'time': now.strftime("%H:%M:%S"),
                        'date': today.isoformat()
                    }, status=201)
                except Exception as e:
                    logger.error(f"Punch in failed: {e}")
                    return Response({'error': 'Punch in failed'}, status=500)
            else:
                # Punch Out
                
                try:
                    time_in = latest_session.time_in

                    try:
                        if isinstance(time_in, str):
                            time_in = safe_parse_datetime(time_in)
                        elif isinstance(time_in, time):
                            time_in = datetime.combine(today, time_in)
                        elif isinstance(time_in, datetime):
                            pass
                        else:
                            raise ValueError("Unrecognized time_in format")

                        time_in = ensure_timezone(time_in, company_tz)

                    except Exception as e:
                        logger.error(f"Invalid time_in value: {e}")
                        return Response({'error': 'Invalid punch-in time'}, status=500)

                    # Validate punch out
                    if now <= time_in:
                        return Response({
                            'error': 'Punch out must be after punch in',
                            'details': {
                                'punch_in': str(time_in),
                                'attempted_out': str(now)
                            }
                        }, status=400)

                    latest_session.time_out = now
                    latest_session.save()
                    attendance.update_total_hours()

                    return Response({
                        'status': 'success',
                        'action': 'punch_out',
                        'time': now.strftime("%H:%M:%S"),
                        'total_hours': float(attendance.total_hours),
                        'timezone': company_tz.zone
                    })

                except Exception as e:
                    logger.error(f"Punch out failed: {e}")
                    return Response({'error': 'Punch out failed'}, status=500)


        except Exception as e:
            logger.critical(f"Unhandled error: {e}", exc_info=True)
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

