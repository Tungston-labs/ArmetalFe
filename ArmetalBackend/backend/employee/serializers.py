from rest_framework import serializers
from .models import ScheduleReminder
from django.db.models import Sum
from datetime import datetime
from .models import (
    Employee_db, EmpBankPaymentModel, EmpDocument, TempUpload
)
from departments.models import Department
from attendance.models import Attendance
from task.models import DailyTask
from leave.models import LeaveRequest
from datetime import date, timedelta
from calendar import monthrange

class SafeDateField(serializers.DateField):
    def to_representation(self, value):
        if isinstance(value, datetime):
            return value.date().isoformat()
        return super().to_representation(value)

class EmployeeSerializer(serializers.ModelSerializer):

    dob = SafeDateField(required=False)
    joining_date = SafeDateField(required=False)
    visa_expiry_date = SafeDateField(required=False)

    iqama_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    aadar_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    insurance_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # Allow manual employee_id
    employee_id = serializers.CharField(
        required=False,
        allow_blank=True
    )
    employee_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )

    department = serializers.CharField(
        source='department.name',
        read_only=True
    )

    is_head = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

    def get_is_head(self, obj):
        return (
            obj.department
            and obj.department.department_head == obj
        )

    def validate(self, data):

        country = self.context['request'].user.company.country

        if country == "IN":
            if not data.get('aadar_number'):
                raise serializers.ValidationError({
                    "aadar_number":
                    "Aadhaar number is required for India"
                })

        else:
            if not data.get('iqama_number'):
                raise serializers.ValidationError({
                    "iqama_number":
                    "Iqama number is required for this country"
                })

            if not data.get('visa_expiry_date'):
                raise serializers.ValidationError({
                    "visa_expiry_date":
                    "Visa expiry date is required"
                })

        if (
            country != "IN"
            and not data.get('insurance_number')
        ):
            raise serializers.ValidationError({
                "insurance_number":
                "Insurance number is required for non-India"
            })

        return data

    def create(self, validated_data):

        employee = Employee_db.objects.create(
            **validated_data
        )

        return employee

    def update(self, instance, validated_data):

        employee_id = validated_data.get(
            "employee_id",
            instance.employee_id
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.employee_id = employee_id
        instance.save()

        return instance



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





class DepartmentForProfileSerializer(serializers.ModelSerializer):
    head = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['name', 'head']

    def get_head(self, obj):
        return obj.department_head.name if obj.department_head else None




class EmployeeProfileSerializer(serializers.ModelSerializer):
    department = DepartmentForProfileSerializer()
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = Employee_db
        exclude = ['password']

    def get_company_logo(self, obj):
        company = obj.user.company
        if company and company.logo:
            request = self.context.get("request")
            return request.build_absolute_uri(company.logo.url) if request else company.logo.url
        return None





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

from rest_framework import serializers
from datetime import date, timedelta
from calendar import day_name

from employee.models import Employee_db
from attendance.models import Attendance
from task.models import DailyTask
from leave.models import LeaveRequest


class EmployeeDashboardSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()
    department = serializers.CharField(source="department.name", read_only=True)
    contract = serializers.SerializerMethodField()
    salary = serializers.SerializerMethodField()
    pending_leave = serializers.SerializerMethodField()
    leave_taken = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    attendance_graph = serializers.SerializerMethodField()
    task_graph = serializers.SerializerMethodField()
    aadar_number = serializers.SerializerMethodField()
    iqama_number = serializers.SerializerMethodField()
    pan_number = serializers.SerializerMethodField()
    account_number = serializers.SerializerMethodField()
    passport_number = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()


    class Meta:
        model = Employee_db
        fields = [
            "id",
            "profile_pic",
            "name",
            "address",
            "phno",
            "email",
            "employee_id",
            "designation",
            "joining_date",
            "dob",                             
            "aadar_number",                    
            "iqama_number",                     
            "pan_number",                     
            "account_number",                   
            "passport_number",                  
            "department",
            "role",
            "salary",
            "contract",
            "visa_expiry_date",
            "leave_taken",
            "pending_leave",
            "projects",
            "attendance_graph",
            "task_graph",
            "is_active",
        ]

    # -------------------------
    #  FULL PROFILE PIC URL
    # -------------------------
    def get_profile_pic(self, obj):
        request = self.context.get("request")
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

    # -------------------------
    #  BANK DETAILS
    # -------------------------
    def get_salary(self, obj):
        if hasattr(obj, "bank_details") and obj.bank_details:
            return float(obj.bank_details.basic_salary)
        return None

    def get_account_number(self, obj):
        if hasattr(obj, "bank_details") and obj.bank_details:
            return obj.bank_details.account_number
        return None

    def get_pan_number(self, obj):
        if hasattr(obj, "bank_details") and obj.bank_details:
            return obj.bank_details.pan_number
        return None

    # -------------------------
    #  PERSONAL FIELDS
    # -------------------------
    def get_aadar_number(self, obj):
        return obj.aadar_number

    def get_iqama_number(self, obj):
        return obj.iqama_number

    def get_passport_number(self, obj):
        return obj.passport_number

    # -------------------------
    #  CONTRACT
    # -------------------------
    def get_contract(self, obj):
        return obj.contract_expiry_date

    # -------------------------
    #  LEAVES
    # -------------------------
    def get_leave_taken(self, obj):
        approved = LeaveRequest.objects.filter(employee=obj, status="approved")
        taken = sum([leave.calculate_leave_days() for leave in approved])
        return float(taken)

    def get_pending_leave(self, obj):
        return float(obj.total_leave or 0)

    # -------------------------
    #  PROJECTS
    # -------------------------
    def get_projects(self, obj):
        projects = obj.projects.all()

        ongoing_count = projects.filter(status="in_progress").count()
        completed_count = projects.filter(status="completed").count()

        return {
            "ongoing_count": ongoing_count,
            "completed_count": completed_count
        }



    # -------------------------
    #  ATTENDANCE GRAPH
    # -------------------------
    def get_attendance_graph(self, obj):
        today = date.today()
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)

        graph = {day: 0 for day in day_name}

        attendance = Attendance.objects.filter(
            employee=obj,
            date__range=[start_week, end_week]
        )

        for att in attendance:
            weekday = day_name[att.date.weekday()]
            graph[weekday] += float(att.total_hours or 0)

        return graph

    # -------------------------
    #  TASK GRAPH
    # -------------------------
    def get_task_graph(self, obj):
        today = date.today()
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)

        graph = {day: 0 for day in day_name}

        tasks = DailyTask.objects.filter(
            employee=obj,
            created_at__date__range=[start_week, end_week]
        )

        for task in tasks:
            weekday = day_name[task.created_at.weekday()]
            graph[weekday] += float(task.time_taken or 0)

        return graph
    
    #------------------ IS ACTIVE STATUS ------------------------------------
    
    def get_is_active(self, obj):
        today = date.today()

        attendance = Attendance.objects.filter(employee=obj, date=today).first()
        if not attendance:
            return False

        # Employee is active if any session has punch in but no punch-out
        return attendance.sessions.filter(time_in__isnull=False, time_out__isnull=True).exists()





class ScheduleReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleReminder
        fields = '__all__'
        read_only_fields = ('employee', 'created_at', 'notified')


# serializers.py

from rest_framework import serializers
from decimal import Decimal
from .models import SalaryIncrement,EmpBankPaymentModel


class SalaryIncrementSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalaryIncrement
        fields = "__all__"
        read_only_fields = ["total_salary"]

    def create(self, validated_data):
        employee = validated_data["employee"]
        increment_amount = Decimal(validated_data["increment_amount"])

        # Get last increment
        last_increment = SalaryIncrement.objects.filter(
            employee=employee
        ).order_by("-date").first()

        if last_increment:
            base_salary = last_increment.total_salary
        else:
            # First increment → take from bank model
            bank = EmpBankPaymentModel.objects.get(employee=employee)
            base_salary = bank.basic_salary

        total_salary = base_salary + increment_amount

        validated_data["total_salary"] = total_salary

        return super().create(validated_data)