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

        # Get first and last day of the month
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # 1. Working days (Mon–Fri)
        working_days = sum(1 for day in range((last_day - first_day).days + 1)
                           if (first_day + timedelta(days=day)).weekday() < 5)

        # 2. Days present from Attendance
        attendance_days = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day)
        ).count()

        # 3. Approved leaves in that month
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

        # Calculate Gross Earnings
        basic_salary = float(instance.basic_salary or 0)
        housing_allowance = float(instance.housing_allowance or 0)
        transportation = float(instance.transportation or 0)
        gross_earnings = basic_salary + housing_allowance + transportation

        # Calculate Deductions
        tds = float(instance.tds_deduction_amount or 0)
        total_deductions = tds
        net_pay = gross_earnings - total_deductions

        # Add custom calculated fields
        data.update({
            'working_days': working_days,
            'days_present': attendance_days,
            'leave_taken': total_leave_days,
            'casual_leave': casual_leave,
            'paid_leave': paid_leave,
            'gross_earnings': round(gross_earnings, 2),
            'total_deductions': round(total_deductions, 2),
            'net_pay': round(net_pay, 2),
            'earnings': [
                {'label': 'Basic Salary', 'days': 0, 'hours': 0, 'amount': round(basic_salary, 2)},
                {'label': 'Housing Allowance', 'days': 0, 'hours': 0, 'amount': round(housing_allowance, 2)},
                {'label': 'Transportation', 'days': 0, 'hours': 0, 'amount': round(transportation, 2)},
            ],
            'deductions': [
                {'label': 'TDS Deduction', 'value': round(tds, 2)},
            ]
        })

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

