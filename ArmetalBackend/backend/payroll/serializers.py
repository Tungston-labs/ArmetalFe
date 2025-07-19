from employee.models import Employee_db
from employee.serializers import EmpBankPaymentSerializer
from rest_framework import serializers


class EmployeeWithBankDetailsSerializer(serializers.ModelSerializer):
    bank_details = EmpBankPaymentSerializer(read_only=True)

    class Meta:
        model = Employee_db
        fields = [
            'id',
            'name',
            'employee_id',
            'email',
            'department',
            'joining_date',
            'designation',
            'bank_details',
        ]

from datetime import date, timedelta
import calendar

from .models import EmployeePayrollRecord
from attendance.models import Attendance
from leave.models import LeaveRequest
from attendance.models import Attendance
from payroll.models import EmployeePayrollRecord
from holidays.models import PublicHoliday
from django.utils import timezone
from datetime import timedelta, date


class EmployeePayrollRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    department_name = serializers.CharField(source='employee.department.name', read_only=True)
    role_name = serializers.CharField(source='employee.role.name', read_only=True)

    leave_taken = serializers.SerializerMethodField()
    loss_of_pay = serializers.SerializerMethodField()

    class Meta:
        model = EmployeePayrollRecord
        fields = [
            'id',
            'employee',
            'employee_name',
            'employee_id',
            'department_name',
            'role_name',
            'month',
            'year',
            'gross_salary',
            'net_salary',
            'leave_taken',
            'loss_of_pay',
            'created_at',
        ]

    def get_leave_taken(self, obj):
        employee = obj.employee
        year = obj.year
        month = obj.month

        # Start and end of the payroll month
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)

        # Get employee's company
        company = getattr(employee.department, 'company', None)
        if not company:
            return None  # Or 0 if you prefer fallback

        # Get working days in month excluding public holidays and weekends
        holidays = set(PublicHoliday.objects.filter(
            date__range=(first_day, last_day),
            company=company
        ).values_list('date', flat=True))

        working_days = sum(
            1 for single_date in (first_day + timedelta(days=n) for n in range((last_day - first_day).days + 1))
            if single_date.weekday() < 6 and single_date not in holidays  # exclude Sundays and holidays
        )

        # Count attendance entries in the month
        attendance_days = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day)
        ).count()

        # Leave taken = number of working days - number of days present
        leave_taken = working_days - attendance_days
        return max(leave_taken, 0)

    def get_loss_of_pay(self, obj):
        employee = obj.employee
        year = obj.year
        month = obj.month
        gross_salary = obj.gross_salary or 0

        # Start and end of the payroll month
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)

        # Get employee's company
        company = getattr(employee.department, 'company', None)
        if not company or not gross_salary:
            return 0

        # Get working days in month excluding public holidays and weekends
        holidays = set(PublicHoliday.objects.filter(
            date__range=(first_day, last_day),
            company=company
        ).values_list('date', flat=True))

        working_days = sum(
            1 for single_date in (first_day + timedelta(days=n) for n in range((last_day - first_day).days + 1))
            if single_date.weekday() < 6 and single_date not in holidays  # exclude Sundays and holidays
        )

        attendance_days = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day)
        ).count()

        lop_days = working_days - attendance_days
        lop_amount = 0

        if working_days > 0 and lop_days > 0:
            per_day_salary = gross_salary / working_days
            lop_amount = per_day_salary * lop_days

        return round(lop_amount, 2)

    


class EmployeePayrollRecordSerializer2(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = EmployeePayrollRecord
        fields = '__all__'  # or list explicitly
        extra_fields = ['download_url']

    def get_download_url(self, obj):
        request = self.context.get('request')
        if obj.payslip_file:
            return request.build_absolute_uri(obj.payslip_file.url)
        return None

