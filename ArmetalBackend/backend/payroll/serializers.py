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
from rest_framework import serializers
from datetime import date, timedelta
import calendar

from .models import EmployeePayrollRecord
from attendance.models import Attendance
from leave.models import LeaveRequest

from datetime import date, timedelta
import calendar
from rest_framework import serializers
from .models import EmployeePayrollRecord, Attendance, LeaveRequest, Holiday

class EmployeePayrollRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    department = serializers.CharField(source='employee.department.name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    designation = serializers.CharField(source='employee.designation', read_only=True)
    email = serializers.EmailField(source='employee.email', read_only=True)
    joining_date = serializers.DateField(source='employee.joining_date', read_only=True)

    class Meta:
        model = EmployeePayrollRecord
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        employee = instance.employee
        year = instance.year
        month = instance.month

        # Define month range
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # Fetch all holidays within the month
        holidays = set(Holiday.objects.filter(date__range=(first_day, last_day)).values_list('date', flat=True))

        # Calculate working days: exclude Sundays and holidays
        working_days = sum(
            1 for day in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=day)).weekday() != 6  # exclude Sundays
            and (first_day + timedelta(days=day)) not in holidays
        )

        # Days present from Attendance
        attendance_days = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day)
        ).count()

        # Approved leaves
        leave_requests = LeaveRequest.objects.filter(
            employee=employee,
            status='approved',
            from_date__lte=last_day,
            to_date__gte=first_day
        )

        total_leave_days = 0
        casual_leave = 0
        paid_leave = 0

        for leave in leave_requests:
            leave_start = max(leave.from_date, first_day)
            leave_end = min(leave.to_date, last_day)
            days = (leave_end - leave_start).days + 1
            total_leave_days += days

            if leave.leave_type == 'casual':
                casual_leave += days
            elif leave.leave_type == 'earned':
                paid_leave += days

        # Gross earnings
        basic_salary = float(instance.basic_salary or 0)
        housing_allowance = float(instance.housing_allowance or 0)
        transportation = float(instance.transportation or 0)
        gross_earnings = basic_salary + housing_allowance + transportation

        # Deductions
        tds = float(instance.tds_deduction_amount or 0)
        total_deductions = tds

        # Get total allowed leaves
        allowed_leaves = employee.total_leave or 0

        # Compute loss of pay if leave taken exceeds allowed leaves
        lop_days = max(0, total_leave_days - allowed_leaves)
        lop_amount = 0
        if working_days > 0 and lop_days > 0:
            daily_basic = basic_salary / working_days
            lop_amount = round(daily_basic * lop_days, 2)

        adjusted_basic_salary = basic_salary - lop_amount
        adjusted_gross = adjusted_basic_salary + housing_allowance + transportation
        net_pay = adjusted_gross - total_deductions

        # Final data
        data.update({
            'working_days': working_days,
            'days_present': attendance_days,
            'leave_taken': total_leave_days,
            'casual_leave': casual_leave,
            'paid_leave': paid_leave,
            'gross_earnings': round(adjusted_gross, 2),
            'total_deductions': round(total_deductions, 2),
            'net_pay': round(net_pay, 2),
            'lop_days': lop_days,
            'lop_amount': lop_amount,
            'earnings': [
                {'label': 'Basic Salary', 'days': 0, 'hours': 0, 'amount': round(adjusted_basic_salary, 2)},
                {'label': 'Housing Allowance', 'days': 0, 'hours': 0, 'amount': round(housing_allowance, 2)},
                {'label': 'Transportation', 'days': 0, 'hours': 0, 'amount': round(transportation, 2)},
            ],
            'deductions': [
                {'label': 'TDS Deduction', 'value': round(tds, 2)},
                {'label': 'Loss of Pay', 'value': round(lop_amount, 2)} if lop_amount > 0 else None,
            ]
        })

        # Remove None values from deductions
        data['deductions'] = [d for d in data['deductions'] if d is not None]

        return data

    


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

