from rest_framework import serializers
from .models import Project
from employee.models import Employee_db
from attendance.models import Attendance, AttendanceSession 
from attendance.serializers import AttendanceSessionSerializer
from datetime import timedelta
from django.db.models import Sum


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        fields = [
            'id', 'name', 'employee_id', 'email', 'designation', 
            'department', 'department_name', 'profile_pic', 'joining_date', 'gender'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(),
        many=True,
        required=False
    )
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'company', 'employees']
        read_only_fields = ['company']

    def update(self, instance, validated_data):
        # Extract employees if provided
        employees = validated_data.pop('employees', None)

        # Update other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle ManyToMany update separately
        if employees is not None:
            instance.employees.set(employees)

        return instance
    
class ProjectReadSerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True, read_only=True)
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'company', 'employees']
class ProjectWriteSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'employees']

    def update(self, instance, validated_data):
        employees = validated_data.pop('employees', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if employees is not None:
            instance.employees.set(employees)
        return instance


        
class EmployeeAttendanceDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    sessions = AttendanceSessionSerializer(many=True, read_only=True)
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
        return self.format_hours(obj.total_hours)

    def get_weekly_hours_formatted(self, obj):
        week_start = obj.date - timedelta(days=obj.date.weekday())
        week_end = week_start + timedelta(days=6)
        total = Attendance.objects.filter(employee=obj.employee, date__range=[week_start, week_end]).aggregate(total=Sum('total_hours'))['total'] or 0
        return self.format_hours(total)

    def get_monthly_hours_formatted(self, obj):
        month_start = obj.date.replace(day=1)
        if month_start.month == 12:
            next_month_start = month_start.replace(year=month_start.year+1, month=1, day=1)
        else:
            next_month_start = month_start.replace(month=month_start.month+1, day=1)
        month_end = next_month_start - timedelta(days=1)
        total = Attendance.objects.filter(employee=obj.employee, date__range=[month_start, month_end]).aggregate(total=Sum('total_hours'))['total'] or 0
        return self.format_hours(total)

    def format_hours(self, hours):
        if not hours:
            return "00:00"
        h = int(hours)
        m = int(round((hours - h) * 60))
        return f"{h:02d}:{m:02d}"
