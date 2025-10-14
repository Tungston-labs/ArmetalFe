from rest_framework import serializers
from .models import Project
from employee.models import Employee_db
from attendance.models import Attendance, AttendanceSession 
from attendance.serializers import AttendanceSessionSerializer
from datetime import timedelta
from django.db.models import Sum
from django.conf import settings


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    profile_pic = serializers.SerializerMethodField()  # <-- add this line

    class Meta:
        model = Employee_db
        fields = [
            'id', 'name', 'employee_id', 'email', 'designation',
            'department', 'department_name', 'profile_pic',
            'joining_date', 'gender'
        ]

    def get_profile_pic(self, obj):
        request = self.context.get('request')  # get request object
        if obj.profile_pic:
            # If API is accessed with request context (e.g. through a DRF View)
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            # fallback in case no request context is available
            return f"{settings.MEDIA_URL}{obj.profile_pic.url}"
        return None


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


        
from datetime import timedelta, date
from django.db.models import Sum

from datetime import timedelta, date
from django.db.models import Sum

class EmployeeAttendanceDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    sessions = AttendanceSessionSerializer(many=True, read_only=True)
    total_hours_formatted = serializers.SerializerMethodField()
    weekly_hours_formatted = serializers.SerializerMethodField()
    monthly_hours_formatted = serializers.SerializerMethodField()
    total_working_hours = serializers.SerializerMethodField()  # new field
    locations = serializers.SerializerMethodField()  # new field

    class Meta:
        model = Attendance
        fields = [
            'id', 'date', 'total_hours', 'total_hours_formatted',
            'weekly_hours_formatted', 'monthly_hours_formatted',
            'total_working_hours',  
            'locations',
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

    def get_total_working_hours(self, obj):
        """
        Calculate total expected working hours for the month
        Excluding Sundays and Public Holidays
        """
        from holidays.models import PublicHoliday  

        month_start = obj.date.replace(day=1)
        if month_start.month == 12:
            next_month_start = month_start.replace(year=month_start.year+1, month=1, day=1)
        else:
            next_month_start = month_start.replace(month=month_start.month+1, day=1)
        month_end = next_month_start - timedelta(days=1)

        # Fetch holidays in the month
        holidays = set(
            PublicHoliday.objects.filter(date__range=(month_start, month_end))
            .values_list('date', flat=True)
        )

        # Count working days (Mon-Sat) excluding holidays
        working_days = sum(
            1 for d in range((month_end - month_start).days + 1)
            if (month_start + timedelta(days=d)).weekday() != 6  # exclude Sundays
            and (month_start + timedelta(days=d)) not in holidays
        )

        return working_days * 8  # 8 hours per working day

    def get_locations(self, obj):
        """Return locations list as stored in Attendance.locations"""
        return obj.locations if obj.locations else []

    def format_hours(self, hours):
        if not hours:
            return "00:00"
        h = int(hours)
        m = int(round((hours - h) * 60))
        return f"{h:02d}:{m:02d}"
