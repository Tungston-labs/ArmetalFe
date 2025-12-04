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

    # ✅ Add is_head field
    is_head = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

    def get_is_head(self, obj):
        return obj.department and obj.department.department_head == obj

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

    # NEW FIELDS REQUESTED
    aadar_number = serializers.SerializerMethodField()
    iqama_number = serializers.SerializerMethodField()
    pan_number = serializers.SerializerMethodField()
    account_number = serializers.SerializerMethodField()
    passport_number = serializers.SerializerMethodField()

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
            "dob",                             # NEW
            "aadar_number",                     # NEW
            "iqama_number",                     # NEW
            "pan_number",                       # NEW
            "account_number",                   # NEW
            "passport_number",                  # NEW
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
        # Employee belongs to project via ManyToMany → obj.projects.all()
        projects = obj.projects.all()

        ongoing = projects.filter(status="in_progress").values("id", "name", "punch_type", "status")
        completed = projects.filter(status="completed").values("id", "name", "punch_type", "status")

        return {
            "ongoing": ongoing,
            "completed": completed
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


# class EmployeeDashboardSerializer(serializers.ModelSerializer):
#     bank_details = EmpBankPaymentSerializer(read_only=True)
#     company_days = serializers.SerializerMethodField()
#     leave_summary = serializers.SerializerMethodField()
#     attendance_summary = serializers.SerializerMethodField()
#     department_employees = serializers.SerializerMethodField()
#     daily_tasks = serializers.SerializerMethodField()
#     today_sessions = serializers.SerializerMethodField()
#     department_head = serializers.SerializerMethodField()
#     dob = serializers.DateField(required=False)
#     joining_date = serializers.DateField(required=False)
#     visa_expiry_date = serializers.DateField(required=False)

#     department_id = serializers.PrimaryKeyRelatedField(
#         source='department',
#         queryset=Department.objects.all(),
#         write_only=True
#     )
#     department = serializers.CharField(source='department.name', read_only=True)

#     class Meta:
#         model = Employee_db
#         exclude = ['user', 'password']

#     def get_company_days(self, obj):
#         return (date.today() - obj.joining_date).days if obj.joining_date else 0

#     def get_leave_summary(self, obj):
#         """
#         Calculate leave summary properly:
#         - total_leave: current available leave balance from Employee_db
#         - leave_taken: total days from approved leave requests
#         - pending_leave: same as total_leave (already updated in DB)
#         """
#         total_leave = obj.total_leave or 0

#         # ✅ Sum up all approved leave days
#         approved_leaves = LeaveRequest.objects.filter(employee=obj, status='approved')
#         leave_days_taken = 0

#         for leave in approved_leaves:
#             if leave.from_date and leave.to_date:
#                 # ✅ Use model method to correctly account for half days
#                 leave_days_taken += leave.calculate_leave_days()


#         return {
#             'total_leave': total_leave,         # current balance from DB
#             'leave_taken': leave_days_taken,    # sum of days, not count of requests
#             'pending_leave': total_leave        # same as balance
#         }


#     def get_attendance_summary(self, obj):
#         today = date.today()

#         # ✅ Month boundaries
#         start_month = today.replace(day=1)
#         _, last_day = monthrange(today.year, today.month)
#         end_month = today.replace(day=last_day)

#         # ✅ Determine which week of the month today belongs to (1–7, 8–14, 15–21, 22–28, 29–end)
#         day_of_month = today.day
#         week_number = (day_of_month - 1) // 7 + 1

#         start_week = start_month + timedelta(days=(week_number - 1) * 7)
#         end_week = min(start_week + timedelta(days=6), end_month)

#         # ✅ Fetch attendance data for week and month
#         week_attendance = Attendance.objects.filter(employee=obj, date__range=[start_week, end_week])
#         month_attendance = Attendance.objects.filter(employee=obj, date__range=[start_month, end_month])

#         # ✅ Format hours from float (e.g. 9.65 → "09:39")
#         def format_hours(hours):
#             hours = float(hours or 0)
#             h = int(hours)
#             m = int(round((hours - h) * 60))
#             return f"{h:02d}:{m:02d}"

#         weekly_total = week_attendance.aggregate(total=Sum('total_hours'))['total'] or 0
#         monthly_total = month_attendance.aggregate(total=Sum('total_hours'))['total'] or 0

#         return {
#             "weekly_working_hours": format_hours(weekly_total),
#             "weekly_days": week_attendance.count(),
#             "monthly_working_hours": format_hours(monthly_total),
#             "monthly_days": month_attendance.count(),
#             "week_range": f"{start_week.strftime('%d %b')} - {end_week.strftime('%d %b')}"
#         }
    
#     def get_department_head(self, obj):
#         head = obj.department.department_head
#         if head:
#             return {
#                 "id": head.id,
#                 "name": head.name,
#                 "designation": head.designation,
#                 "profile_pic": head.profile_pic.url if head.profile_pic else None,
#             }
#         return None

#     def get_department_employees(self, obj):
#         employees = Employee_db.objects.filter(department=obj.department)
#         return {
#             'count': employees.count(),
#             'employees': [{'id': emp.id, 'name': emp.name, 'designation': emp.designation, 'profile_pic': emp.profile_pic.url if emp.profile_pic else None
#              } for emp in employees]
#         }

#     def get_daily_tasks(self, obj):
#         today = date.today()
#         tasks = DailyTask.objects.filter(employee=obj, created_at__date=today)
#         return [
#             {
#                 'project': task.project,
#                 'task': task.task,
#                 'time_taken': float(task.time_taken),
#                 'date':today
#             } for task in tasks
#         ]

#     def get_today_sessions(self, obj):
#         today = date.today()
#         try:
#             attendance = Attendance.objects.get(employee=obj, date=today)
#             return [
#                 {
#                     'time_in': session.time_in,
#                     'time_out': session.time_out,
#                     'note': session.note
#                 } for session in attendance.sessions.all()
#             ]
#         except Attendance.DoesNotExist:
#             return []


class ScheduleReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleReminder
        fields = '__all__'
        read_only_fields = ('employee', 'created_at', 'notified')


