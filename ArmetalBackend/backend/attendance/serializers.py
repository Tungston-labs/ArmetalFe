# attendance/serializers.py
from rest_framework import serializers
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
# serializers.py
from rest_framework import serializers
from .models import Attendance, AttendanceSession
from datetime import time,datetime
from rest_framework import serializers
from .models import Attendance, AttendanceSession
from .utils.timezone_utils import get_company_timezone,convert_to_company_timezone,safe_parse_datetime,ensure_timezone
import pytz
from django.db.models import Sum
from datetime import timedelta


class AttendanceSessionSerializer(serializers.ModelSerializer):
    time_in = serializers.SerializerMethodField()
    time_out = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['id', 'time_in', 'time_out', 'duration', 'note','punch_in_latitude',
            'punch_in_longitude',
            'punch_in_location',
            'punch_out_latitude',
            'punch_out_longitude',
            'punch_out_location',]

    def get_time_in(self, obj):
        return self._safe_convert(obj.time_in, obj)

    def get_time_out(self, obj):
        return self._safe_convert(obj.time_out, obj)

    def get_duration(self, obj):
        """Get session duration in hours"""
        return obj.get_duration()

    def _safe_convert(self, dt, obj):
        """Safely convert datetime to company timezone string"""
        if dt is None:
            return None
            
        try:
            # Handle time objects
            if isinstance(dt, time):
                # Combine with attendance date
                dt = datetime.combine(obj.attendance.date, dt)
            
            # Ensure it's a datetime object
            if not isinstance(dt, datetime):
                return None
                
            # Convert to company timezone
            return convert_to_company_timezone(dt, obj.attendance.employee)
            
        except Exception as e:
            # Fallback to UTC string
            if isinstance(dt, datetime):
                if dt.tzinfo is None:
                    dt = pytz.UTC.localize(dt)
                return dt.strftime('%Y-%m-%d %H:%M:%S')
            return None


class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.IntegerField(source="id", read_only=True)

    # direct model fields → NO source needed
    employee_name = serializers.CharField(source="name", read_only=True)
    employee_id = serializers.CharField(source="id",read_only=True)
    profile_pic = serializers.ImageField(read_only=True)

    total_hours = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True,
        allow_null=True
    )

    total_hours_formatted = serializers.SerializerMethodField()
    attendance_today = serializers.BooleanField(read_only=True)

    class Meta:
        model = Employee_db
        fields = [
            "employee",
            "employee_name",
            "employee_id",
            "profile_pic",
            "total_hours",
            "total_hours_formatted",
            "attendance_today",
        ]

    def get_total_hours_formatted(self, obj):
        hours = int(obj.total_hours or 0)
        minutes = int((float(obj.total_hours or 0) - hours) * 60)
        return f"{hours:02d}:{minutes:02d}"

    
from rest_framework import serializers
from employee.models import Employee_db


class AttendanceEmployeeRowSerializer(serializers.ModelSerializer):
    first_punch_in = serializers.TimeField(read_only=True)
    has_swipe_today = serializers.BooleanField(read_only=True)

    class Meta:
        model = Employee_db
        fields = [
            "id",
            "employee_id",
            "name",
            "profile_pic",
            "first_punch_in",
            "has_swipe_today",
        ]


class EmployeeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_db
        fields = ['id', 'name', 'email', 'employee_id', 'profile_pic', 'department', 'designation','address','dob','gender']
        depth = 1  # if department/designation are foreign keys

class AttendanceDetailSerializer(serializers.ModelSerializer):
    sessions = AttendanceSessionSerializer(many=True, read_only=True)
    employee = EmployeeInfoSerializer(read_only=True)
    total_hours_formatted = serializers.SerializerMethodField()
    weekly_hours_formatted = serializers.SerializerMethodField()
    monthly_hours_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            'id', 'date', 'total_hours', 'total_hours_formatted',
            'weekly_hours_formatted', 'monthly_hours_formatted',
            'remark', 'employee', 'sessions'
        ]

    def get_total_hours_formatted(self, obj):
        """Format total hours as HH:MM"""
        return self.format_hours(obj.total_hours)

    def get_weekly_hours_formatted(self, obj):
        """
        Calculate hours within the same month-based week.
        Example: Week 1 = 1-7, Week 2 = 8-14, etc.
        """
        day = obj.date.day
        month_start = obj.date.replace(day=1)

        # Determine week block
        if day <= 7:
            week_start = month_start
            week_end_day = 7
        elif day <= 14:
            week_start = month_start.replace(day=8)
            week_end_day = 14
        elif day <= 21:
            week_start = month_start.replace(day=15)
            week_end_day = 21
        elif day <= 28:
            week_start = month_start.replace(day=22)
            week_end_day = 28
        else:
            week_start = month_start.replace(day=29)
            # Handle variable month length
            if month_start.month == 12:
                next_month_start = month_start.replace(year=month_start.year + 1, month=1, day=1)
            else:
                next_month_start = month_start.replace(month=month_start.month + 1, day=1)
            week_end_day = (next_month_start - timedelta(days=1)).day

        week_end = month_start.replace(day=week_end_day)

        total = Attendance.objects.filter(
            employee=obj.employee,
            date__range=[week_start, week_end]
        ).aggregate(total=Sum('total_hours'))['total'] or 0

        return self.format_hours(total)

    def get_monthly_hours_formatted(self, obj):
        """Sum hours for the month of obj.date for that employee"""
        month_start = obj.date.replace(day=1)

        if month_start.month == 12:
            next_month_start = month_start.replace(year=month_start.year + 1, month=1, day=1)
        else:
            next_month_start = month_start.replace(month=month_start.month + 1, day=1)
        month_end = next_month_start - timedelta(days=1)

        total = Attendance.objects.filter(
            employee=obj.employee,
            date__range=[month_start, month_end]
        ).aggregate(total=Sum('total_hours'))['total'] or 0

        return self.format_hours(total)

    def format_hours(self, hours):
        """Helper to format decimal hours into HH:MM"""
        if not hours:
            return "00:00"
        h = int(hours)
        m = int(round((hours - h) * 60))
        return f"{h:02d}:{m:02d}"



class AttendanceLocationSerializer(serializers.Serializer):
    location = serializers.CharField()
    timestamp = serializers.DateTimeField(required=False)

# attendance/serializers.py
from rest_framework import serializers
from .models import HourlyLocationLog

class HourlyLocationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourlyLocationLog
        fields = ['employee', 'latitude', 'longitude', 'location_name', 'logged_at']
        read_only_fields = ['logged_at']





class DailyAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    status = serializers.CharField()
    total_hours = serializers.FloatField()


class EmployeeAttendanceSummarySerializer(serializers.Serializer):
    employee_id = serializers.CharField()
    employee_name = serializers.CharField()
    department = serializers.CharField()

    working_days = serializers.FloatField()
    present_days = serializers.FloatField()
    absent_days = serializers.FloatField()
    lop_days = serializers.FloatField()

    daily_records = DailyAttendanceSerializer(many=True)
