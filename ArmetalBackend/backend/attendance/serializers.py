# attendance/serializers.py
from rest_framework import serializers
from .models import Attendance, AttendanceSession
from employee.models import Employee_db
# serializers.py
from rest_framework import serializers
from .models import Attendance, AttendanceSession

from rest_framework import serializers
from .models import Attendance, AttendanceSession
from .utils.timezone_utils import get_company_timezone,convert_to_company_timezone,safe_parse_datetime,ensure_timezone



class AttendanceSessionSerializer(serializers.ModelSerializer):
    time_in = serializers.SerializerMethodField()
    time_out = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['time_in', 'time_out']

    def get_time_in(self, obj):
        return convert_to_company_timezone(obj.time_in, obj.attendance.employee)

    def get_time_out(self, obj):
        return convert_to_company_timezone(obj.time_out, obj.attendance.employee)




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

