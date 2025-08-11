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


from datetime import datetime, time
import pytz

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
        t_in, t_out = obj.time_in, obj.time_out
        if not t_in or not t_out:
            return None

        # If they're time objects, combine with attendance date
        if isinstance(t_in, time):
            t_in = datetime.combine(obj.attendance.date, t_in)
        if isinstance(t_out, time):
            t_out = datetime.combine(obj.attendance.date, t_out)

        # Ensure both are datetime
        if not isinstance(t_in, datetime) or not isinstance(t_out, datetime):
            return None

        delta = t_out - t_in
        return round(delta.total_seconds() / 3600, 2)

    def _safe_convert(self, dt, obj):
        """Safely convert datetime to company timezone string"""
        if dt is None:
            return None
        try:
            if isinstance(dt, time):
                dt = datetime.combine(obj.attendance.date, dt)
            if not isinstance(dt, datetime):
                return None
            return convert_to_company_timezone(dt, obj.attendance.employee)
        except Exception:
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

