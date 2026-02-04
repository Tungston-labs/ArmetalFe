from employee.models import Employee_db
from employee.serializers import EmpBankPaymentSerializer
from rest_framework import serializers
from datetime import date, timedelta,datetime
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
        department = employee.department
        company = department.company if department else None
        request = self.context.get('request')
        year, month = instance.year, instance.month

        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # --- Identify Company Off Days & Holidays ---
        holidays_qs = PublicHoliday.objects.filter(
            date__range=(first_day, last_day),
            company=employee.department.company
        )
        holidays = set()
        company_off_days = set()
        for h in holidays_qs:
            if h.holiday_type == 'company_off_day':
                company_off_days.add(h.date.weekday())
            else:
                holidays.add(h.date)

        # --- Working Days ---
        working_days = sum(
            1 for d in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=d)).weekday() not in company_off_days
            and (first_day + timedelta(days=d)) not in holidays
        )

        # --- Attendance ---
        attendances = Attendance.objects.filter(employee=employee, date__range=(first_day, last_day))
        full_days = half_days = 0
        attendance_dates = set()
        for att in attendances:
            hours = float(att.total_hours or 0)
            attendance_dates.add(att.date)
            if hours >= 8:
                full_days += 1
            elif 4 <= hours < 8:
                half_days += 1

        days_present = full_days + 0.5 * half_days

        # --- Approved Leave Days ---
        leave_requests = LeaveRequest.objects.filter(
            employee=employee, status='approved',
            from_date__lte=last_day, to_date__gte=first_day
        )
        approved_leave_dates = set()
        for leave in leave_requests:
            start = max(leave.from_date, first_day)
            end = min(leave.to_date, last_day)
            if isinstance(start, datetime):
                start = start.date()
            if isinstance(end, datetime):
                end = end.date()
            if start <= end:
                for n in range((end - start).days + 1):
                    approved_leave_dates.add(start + timedelta(days=n))

        # --- Unswiped Days (excluding approved leaves, holidays, off days) ---
        all_days = [(first_day + timedelta(days=i)) for i in range((last_day - first_day).days + 1)]
        unswiped_valid_days = [
            d for d in all_days
            if d not in attendance_dates
            and d not in holidays
            and d.weekday() not in company_off_days
            and d not in approved_leave_dates
        ]
        unswiped_days = float(len(unswiped_valid_days))

        # --- Paid Leave ---
        paid_leave_balance = float(employee.paid_leave or 0.0)

        # --- LOP Days (exclude paid leave) ---
        lop_days = max(unswiped_days - paid_leave_balance, 0)

        # --- Salary Components ---
        basic_salary = float(instance.basic_salary or 0)
        housing_allowance = float(instance.housing_allowance or 0)
        transportation = float(instance.transportation or 0)
        tds = float(instance.tds_deduction_amount or 0)

        daily_basic = basic_salary / working_days if working_days > 0 else 0
        lop_amount = round(daily_basic * lop_days, 2)

        adjusted_basic_salary = basic_salary - lop_amount
        adjusted_gross = adjusted_basic_salary + housing_allowance + transportation
        net_pay = adjusted_gross - tds
        # 🔒 Use frozen values if available
        if instance.working_days is not None:
            working_days = instance.working_days

        if instance.days_present is not None:
            days_present = instance.days_present

        if instance.lop_days is not None:
            lop_days = float(instance.lop_days)

        if instance.lop_amount is not None:
            lop_amount = float(instance.lop_amount)


        # --- Final Output ---
        data.update({
             'company': {
            'name': company.name if company else None,
            'address': company.address if company else None,
            'email': company.email if company else None,
            'contact_number': company.contact_number if company else None,
            'logo_url': request.build_absolute_uri(company.logo.url) if company and company.logo else None,
        },
            'working_days': working_days,
            'days_present': days_present,
            'unswiped_days': unswiped_days,
            'paid_leave_used': paid_leave_balance,
            'lop_days': lop_days,
            'lop_amount': lop_amount,
            'gross_earnings': round(adjusted_gross, 2),
            'total_deductions': round(tds + lop_amount, 2),
            'net_pay': round(net_pay, 2),
            'earnings': [
                {'label': 'Basic Salary', 'amount': round(basic_salary, 2)},
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

