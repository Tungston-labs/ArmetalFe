from employee.models import Employee_db
from employee.serializers import EmpBankPaymentSerializer
from rest_framework import serializers
from datetime import date, timedelta
from .models import EmployeePayrollRecord
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday
import calendar


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

        # Month range
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # Holidays in this month
        holidays = set(
            PublicHoliday.objects.filter(date__range=(first_day, last_day))
            .values_list('date', flat=True)
        )

        # Working days (Mon–Sat, excluding holidays & Sundays)
        working_days = sum(
            1 for d in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=d)).weekday() != 6
            and (first_day + timedelta(days=d)) not in holidays
        )

        # Company standard monthly hours (8 hrs per day)
        company_total_hours = working_days * 8

        # --- Attendance Analysis ---
        attendances = Attendance.objects.filter(employee=employee, date__range=(first_day, last_day))
        total_present_hours = 0
        full_days = 0
        half_days = 0

        for att in attendances:
            hours = float(att.total_hours or 0)
            total_present_hours += hours
            if hours >= 8:
                full_days += 1
            elif 4 <= hours < 8:
                half_days += 1

        # Convert hours to equivalent days
        days_present = full_days + (half_days * 0.5)

        # --- Approved Leaves ---
        leave_requests = LeaveRequest.objects.filter(
            employee=employee, status='approved',
            from_date__lte=last_day, to_date__gte=first_day
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

        # --- Salary Base ---
        basic_salary = float(instance.basic_salary or 0)
        housing_allowance = float(instance.housing_allowance or 0)
        transportation = float(instance.transportation or 0)
        tds = float(instance.tds_deduction_amount or 0)
        allowed_leaves = employee.total_leave or 0

        gross_earnings = basic_salary + housing_allowance + transportation

        # --- Working Hour–Based Absence ---
        # Adjust company hours by removing approved paid leave hours
        effective_company_hours = company_total_hours - (paid_leave * 8)
        missing_hours = max(0, effective_company_hours - total_present_hours)
        unswiped_days = round(missing_hours / 8, 2)

        # --- LOP (Loss of Pay) ---
        # Combine missing (unswiped) days + any excess unpaid leave
        # Yearly excess leaves check
        year_start = date(year, 1, 1)
        till_month_end = last_day
        prev_month_end = first_day - timedelta(days=1)

        yearly_leaves = LeaveRequest.objects.filter(
            employee=employee, status='approved',
            from_date__gte=year_start, to_date__lte=till_month_end
        )
        prev_yearly_leaves = LeaveRequest.objects.filter(
            employee=employee, status='approved',
            from_date__gte=year_start, to_date__lte=prev_month_end
        )

        cumulative_leave_days = sum((l.to_date - l.from_date).days + 1 for l in yearly_leaves)
        prev_cumulative = sum((l.to_date - l.from_date).days + 1 for l in prev_yearly_leaves)

        excess_till_now = max(0, cumulative_leave_days - allowed_leaves)
        excess_till_last = max(0, prev_cumulative - allowed_leaves)
        excess_leave_days = excess_till_now - excess_till_last

        # ✅ Convert to float before addition
        unswiped_days = float(unswiped_days or 0)
        excess_leave_days = float(excess_leave_days or 0)

        # Final LOP days = unswiped + excess leave
        lop_days = round(unswiped_days + excess_leave_days, 2)

        daily_basic = basic_salary / working_days if working_days > 0 else 0
        lop_amount = round(daily_basic * lop_days, 2)

        # Adjust salary
        adjusted_basic_salary = basic_salary - lop_amount
        adjusted_gross = adjusted_basic_salary + housing_allowance + transportation
        net_pay = adjusted_gross - tds

        # --- Final Output ---
        data.update({
            'working_days': working_days,
            'days_present': round(days_present, 2),
            'leave_taken': total_leave_days,
            'casual_leave': casual_leave,
            'paid_leave': paid_leave,
            'unswiped_days': unswiped_days,
            'lop_days': lop_days,
            'lop_amount': lop_amount,
            'gross_earnings': round(adjusted_gross, 2),
            'total_deductions': round(tds + lop_amount, 2),
            'net_pay': round(net_pay, 2),
            'earnings': [
                {'label': 'Basic Salary', 'amount': round(adjusted_basic_salary, 2)},
                {'label': 'Housing Allowance', 'amount': round(housing_allowance, 2)},
                {'label': 'Transportation', 'amount': round(transportation, 2)},
            ],
            'deductions': [
                {'label': 'TDS Deduction', 'value': round(tds, 2)},
                {'label': 'Loss of Pay', 'value': round(lop_amount, 2)} if lop_amount > 0 else None,
            ],
            "hr1_verified": instance.hr1_verified_by is not None,
            "hr2_verified": instance.hr2_verified_by is not None,
            "fully_verified": instance.is_fully_verified(),
            "verified_by": {
                "hr1": instance.hr1_verified_by.username if instance.hr1_verified_by else None,
                "hr2": instance.hr2_verified_by.username if instance.hr2_verified_by else None,
            }
        })

        # Clean up None entries
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

