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
import pytz
from .utils.timezone_utils import get_company_timezone,convert_to_company_timezone,safe_parse_datetime,ensure_timezone


class AttendanceSessionSerializer(serializers.ModelSerializer):
    time_in = serializers.SerializerMethodField()
    time_out = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['id', 'time_in', 'time_out', 'duration', 'note']

    def get_time_in(self, obj):
        return self._safe_convert(obj.time_in, obj)

    def get_time_out(self, obj):
        return self._safe_convert(obj.time_out, obj)

    def get_duration(self, obj):
        """Get session duration in hours."""
        if obj.time_in and obj.time_out:
            delta = obj.time_out - obj.time_in
            return round(delta.total_seconds() / 3600, 2)
        return None

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

        except Exception:
            # Fallback to UTC string
            if isinstance(dt, datetime):
                if dt.tzinfo is None:
                    dt = pytz.UTC.localize(dt)
                return dt.strftime('%Y-%m-%d %H:%M:%S')
            return None



class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    profile_pic = serializers.ImageField(source='employee.profile_pic', read_only=True)
    sessions = AttendanceSessionSerializer(many=True, read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',
            'employee_name',
            'date',
            'profile_pic',
            'total_hours',
            'remark',
            'sessions'
        ]


class EmployeeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_db
        fields = ['id', 'name', 'email', 'employee_id', 'profile_pic', 'department', 'designation']
        depth = 1  # if department/designation are foreign keys

class AttendanceDetailSerializer(serializers.ModelSerializer):
    sessions = AttendanceSessionSerializer(many=True, read_only=True)
    employee = EmployeeInfoSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'date', 'total_hours', 'remark', 'employee', 'sessions']

