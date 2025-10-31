from rest_framework import serializers
from .models import ScheduleReminder
from django.db.models import Sum

from datetime import datetime
from .models import (
    Employee_db, EmpBankPaymentModel, EmpDocument, TempUpload
)
from departments.models import Department
from departments.models import Department
from attendance.models import Attendance
from task.models import DailyTask
from leave.models import LeaveRequest
from datetime import date, timedelta

# Custom field to handle datetime-to-date safely
class SafeDateField(serializers.DateField):
    def to_representation(self, value):
        if isinstance(value, datetime):
            return value.date().isoformat()
        return super().to_representation(value)





class EmployeeSerializer(serializers.ModelSerializer):
    dob = SafeDateField(required=False)
    joining_date = SafeDateField(required=False)
    visa_expiry_date = SafeDateField(required=False)
    iqama_number = serializers.CharField(required=False, allow_blank=True)
    aadar_number = serializers.CharField(required=False, allow_blank=True)
    insurance_number = serializers.CharField(required=False, allow_blank=True)

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

    def validate(self, data):
        country = self.context['request'].user.company.country

        # India-specific validation
        if country == "IN":
            if not data.get('aadar_number'):
                raise serializers.ValidationError({"aadar_number": "Aadhaar number is required for India"})
        else:
            # Non-India
            if not data.get('iqama_number'):
                raise serializers.ValidationError({"iqama_number": "Iqama number is required for this country"})
            if not data.get('visa_expiry_date'):
                raise serializers.ValidationError({"visa_expiry_date": "Visa expiry date is required"})

        # Insurance can be optional or required depending on your business rules
        if country != "IN" and not data.get('insurance_number'):
            raise serializers.ValidationError({"insurance_number": "Insurance number is required for non-India"})

        return data


class EmpBankPaymentSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    class Meta:
        model = EmpBankPaymentModel
        fields = '__all__'
        read_only_fields = ['employee']



class TempUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempUpload
        fields = ['id', 'file']

class EmpDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpDocument
        fields = [
            "employee",
            'passport_image1_url',
            'passport_image2_url',
            'insurance_image_url',
            'work_permit_urls',
            'contract_urls',
            'certificate_urls'
        ]
        read_only_fields = ['employee']


# for mobile app




class DepartmentForProfileSerializer(serializers.ModelSerializer):
    head = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['name', 'head']

    def get_head(self, obj):
        return obj.department_head.name if obj.department_head else None


from rest_framework import serializers
from .models import Employee_db

class EmployeeProfileSerializer(serializers.ModelSerializer):
    department = DepartmentForProfileSerializer()
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = Employee_db
        exclude = ['password']

    def get_company_logo(self, obj):
        # Option 1: via employee -> user -> company
        company = obj.user.company
        if company and company.logo:
            request = self.context.get("request")
            return request.build_absolute_uri(company.logo.url) if request else company.logo.url
        return None




from rest_framework import serializers
from employee.models import Employee_db, EmpDocument
from rest_framework import serializers
from .models import Employee_db

class EmployeeDocumentSummarySerializer(serializers.ModelSerializer):
    healthcard_number = serializers.CharField(source='insurance_number', allow_null=True)
    work_permit_urls = serializers.SerializerMethodField()
    contract_urls = serializers.SerializerMethodField()
    passport_number = serializers.CharField(allow_null=True)
    iqama_number = serializers.CharField(allow_null=True)
    aadar_number = serializers.CharField(allow_null=True)
    visa_expiry_date = serializers.DateField(allow_null=True)
    contract_expiry_date = serializers.DateField(allow_null=True)
    insurance_image_url = serializers.SerializerMethodField()
    id_card_image_url = serializers.SerializerMethodField()
    employee_id = serializers.IntegerField(source='id')

    class Meta:
        model = Employee_db
        fields = [
            'employee_id',
            'name',
            'healthcard_number',
            'passport_number',
            'iqama_number',
            'aadar_number',
            'contract_expiry_date',
            'visa_expiry_date',
            'work_permit_urls',
            'contract_urls',
            'insurance_image_url',
            'id_card_image_url',
        ]

    def get_work_permit_urls(self, obj):
        return getattr(getattr(obj, 'documents', None), 'work_permit_urls', [])

    def get_contract_urls(self, obj):
        return getattr(getattr(obj, 'documents', None), 'contract_urls', [])

    def get_insurance_image_url(self, obj):
        return getattr(getattr(obj, 'documents', None), 'insurance_image_url', None)

    def get_id_card_image_url(self, obj):
        if obj.idcard:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.idcard.url) if request else obj.idcard.url
        return None


    


class EmployeeDashboardSerializer(serializers.ModelSerializer):
    bank_details = EmpBankPaymentSerializer(read_only=True)
    company_days = serializers.SerializerMethodField()
    leave_summary = serializers.SerializerMethodField()
    attendance_summary = serializers.SerializerMethodField()
    department_employees = serializers.SerializerMethodField()
    daily_tasks = serializers.SerializerMethodField()
    today_sessions = serializers.SerializerMethodField()
    department_head = serializers.SerializerMethodField()
    dob = serializers.DateField(required=False)
    joining_date = serializers.DateField(required=False)
    visa_expiry_date = serializers.DateField(required=False)

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

    def get_company_days(self, obj):
        return (date.today() - obj.joining_date).days if obj.joining_date else 0

    def get_leave_summary(self, obj):
        total_leave = obj.total_leave or 0
        approved = LeaveRequest.objects.filter(employee=obj, status='approved').count()
        pending = total_leave - approved
        return {
            'total_leave': total_leave,
            'leave_taken': approved,
            'pending_leave': total_leave
        }

    def get_attendance_summary(self, obj):
        today = date.today()
        start_week = today - timedelta(days=today.weekday())
        start_month = today.replace(day=1)

        week_attendance = Attendance.objects.filter(employee=obj, date__gte=start_week, date__lte=today)
        month_attendance = Attendance.objects.filter(employee=obj, date__gte=start_month)

        weekly_hours = week_attendance.aggregate(total=Sum('total_hours'))['total'] or 0
        monthly_hours = month_attendance.aggregate(total=Sum('total_hours'))['total'] or 0

        return {
            'weekly_working_hours': float(weekly_hours),
            'weekly_days': week_attendance.count(),
            'monthly_working_hours': float(monthly_hours)
        }
    def get_department_head(self, obj):
        head = obj.department.department_head
        if head:
            return {
                "id": head.id,
                "name": head.name,
                "designation": head.designation,
                "profile_pic": head.profile_pic.url if head.profile_pic else None,
            }
        return None

    def get_department_employees(self, obj):
        employees = Employee_db.objects.filter(department=obj.department)
        return {
            'count': employees.count(),
            'employees': [{'id': emp.id, 'name': emp.name, 'designation': emp.designation, 'profile_pic': emp.profile_pic.url if emp.profile_pic else None
             } for emp in employees]
        }

    def get_daily_tasks(self, obj):
        today = date.today()
        tasks = DailyTask.objects.filter(employee=obj, created_at__date=today)
        return [
            {
                'project': task.project,
                'task': task.task,
                'time_taken': float(task.time_taken),
                'date':today
            } for task in tasks
        ]

    def get_today_sessions(self, obj):
        today = date.today()
        try:
            attendance = Attendance.objects.get(employee=obj, date=today)
            return [
                {
                    'time_in': session.time_in,
                    'time_out': session.time_out,
                    'note': session.note
                } for session in attendance.sessions.all()
            ]
        except Attendance.DoesNotExist:
            return []


class ScheduleReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleReminder
        fields = '__all__'
        read_only_fields = ('employee', 'created_at', 'notified')


