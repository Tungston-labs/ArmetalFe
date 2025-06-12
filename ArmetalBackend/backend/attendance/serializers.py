# attendance/serializers.py
from rest_framework import serializers
from .models import Attendance, AttendanceSession

class AttendanceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = ['time_in', 'time_out']

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    sessions = AttendanceSessionSerializer(many=True, read_only=True)  # from related_name='sessions'

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'total_hours', 'remark', 'sessions']

class AttendanceDetailSerializer(serializers.ModelSerializer):
    sessions = AttendanceSessionSerializer(many=True, read_only=True)

    class Meta:
        model = Attendance
        fields = ['date', 'total_hours', 'remark', 'sessions']
