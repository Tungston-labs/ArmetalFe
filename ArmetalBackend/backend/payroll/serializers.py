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



from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday
from .models import EmployeePayrollRecord


from datetime import date, datetime, timedelta
import calendar
from decimal import Decimal, ROUND_HALF_UP
from rest_framework import serializers
from employee.models import SalaryIncrement







class EmployeePayrollRecordSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(source="employee.name", read_only=True)
    department = serializers.CharField(source="employee.department.name", read_only=True)
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
    designation = serializers.CharField(source="employee.designation", read_only=True)
    email = serializers.EmailField(source="employee.email", read_only=True)
    joining_date = serializers.DateField(source="employee.joining_date", read_only=True)

    class Meta:
        model = EmployeePayrollRecord
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)

        employee = instance.employee
        department = employee.department
        company = department.company if department else None
        request = self.context.get("request")

        year, month = instance.year, instance.month
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # -------------------------------------------------------
        # HOLIDAYS
        # -------------------------------------------------------
        holidays_qs = PublicHoliday.objects.filter(
            date__range=(first_day, last_day),
            company=company,
        )

        holidays = set()
        company_off_days = set()

        for h in holidays_qs:
            if h.holiday_type == "company_off_day":
                company_off_days.add(h.date.weekday())
            else:
                holidays.add(h.date)

        # -------------------------------------------------------
        # WORKING DAYS
        # -------------------------------------------------------
        working_days = sum(
            1
            for i in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=i)).weekday() not in company_off_days
            and (first_day + timedelta(days=i)) not in holidays
        )

        # -------------------------------------------------------
        # ATTENDANCE
        # -------------------------------------------------------
        full_day_hours = Decimal(company.working_hours_per_day or 8)
        half_day_hours = Decimal(company.half_day_hours or 4)

        attendances = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day),
        )

        full_days = Decimal(0)
        half_days = Decimal(0)
        attendance_dates = set()

        for att in attendances:
            hours = Decimal(att.total_hours or 0)
            attendance_dates.add(att.date)

            if hours >= full_day_hours:
                full_days += 1
            elif hours >= half_day_hours:
                half_days += 1

        days_present = full_days + (Decimal("0.5") * half_days)

        # -------------------------------------------------------
        # LEAVES
        # -------------------------------------------------------
        leave_requests = LeaveRequest.objects.filter(
            employee=employee,
            status="approved",
            from_date__lte=last_day,
            to_date__gte=first_day,
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

        approved_leave_count = float(len(approved_leave_dates))

        # -------------------------------------------------------
        # SALARY INCREMENT HISTORY
        # -------------------------------------------------------

        increments_qs = SalaryIncrement.objects.filter(
            employee=employee
        ).order_by("date")

        total_increment_amount = Decimal(0)
        increment_history = []

        for inc in increments_qs:
            total_increment_amount += Decimal(inc.increment_amount or 0)

            increment_history.append({
                "date": str(inc.date),
                "increment_amount": float(inc.increment_amount),
            })

        # -------------------------------------------------------
        # Salary Base = Employee Salary + Increment Sum
        # -------------------------------------------------------

        total_salary = (
            Decimal(instance.basic_salary or 0)
            + total_increment_amount
        )

        # -------------------------------------------------------
        # Allowance Split
        # -------------------------------------------------------

        basic_percent = Decimal(company.basic_salary_percent or 0)
        house_percent = Decimal(company.house_allowance_percent or 0)
        transport_percent = Decimal(company.transport_allowance_percent or 0)
        special_percent = Decimal(company.special_allowance_percent or 0)

        basic_salary = (total_salary * basic_percent / 100).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        housing_allowance = (total_salary * house_percent / 100).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        transportation = (total_salary * transport_percent / 100).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        special_allowance = (total_salary * special_percent / 100).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        # Fix rounding difference
        calculated_total = (
            basic_salary
            + housing_allowance
            + transportation
            + special_allowance
        )

        difference = total_salary - calculated_total
        special_allowance += difference

        # -------------------------------------------------------
        # LOP CALCULATION
        # -------------------------------------------------------

        total_leave_balance = float(employee.total_leave or 0)
        paid_leave = float(employee.paid_leave or 0)

        all_days = [
            first_day + timedelta(days=i)
            for i in range((last_day - first_day).days + 1)
        ]

        unswiped_days = float(
            len([
                d for d in all_days
                if d not in attendance_dates
                and d not in holidays
                and d.weekday() not in company_off_days
            ])
        )

        real_absent_days = unswiped_days - approved_leave_count
        leave_adjustment = min(approved_leave_count, total_leave_balance)
        lop_days = max(real_absent_days - leave_adjustment, 0) + paid_leave

        # Freeze payroll values if stored
        if instance.working_days is not None:
            working_days = float(instance.working_days)

        if instance.lop_days is not None:
            lop_days = float(instance.lop_days)

        # LOP Amount
        daily_basic = basic_salary / Decimal(working_days or 1)
        lop_amount = (daily_basic * Decimal(lop_days)).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        # -------------------------------------------------------
        # Final Salary Calculation
        # -------------------------------------------------------

        adjusted_basic_salary = basic_salary - lop_amount

        adjusted_gross = (
            adjusted_basic_salary
            + housing_allowance
            + transportation
            + special_allowance
        )

        tds = Decimal(instance.tds_deduction_amount or 0)

        net_pay = adjusted_gross - tds

        # -------------------------------------------------------
        # RESPONSE
        # -------------------------------------------------------

        data.update({
            "company": {
                "name": company.name if company else None,
                "address": company.address if company else None,
                "email": company.email if company else None,
                "contact_number": company.contact_number if company else None,
                "logo_url": request.build_absolute_uri(company.logo.url)
                if company and company.logo else None,
            },

            "working_days": working_days,
            "days_present": days_present,
            "unswiped_days": unswiped_days,

            "approved_leave_days": approved_leave_count,
            "paid_leave_used": paid_leave,

            "lop_days": lop_days,
            "lop_amount": float(lop_amount),

            "total_increment_amount": float(total_increment_amount),
            "increment_history": increment_history,

            "gross_earnings": round(float(adjusted_gross), 2),
            "total_deductions": round(float(tds + lop_amount), 2),
            "net_pay": round(float(net_pay), 2),

            "earnings": [
                {"label": "Basic Salary", "amount": round(float(basic_salary), 2)},
                {"label": "Housing Allowance", "amount": round(float(housing_allowance), 2)},
                {"label": "Transportation", "amount": round(float(transportation), 2)},
                {"label": "Special Allowance", "amount": round(float(special_allowance), 2)},
            ],

            "deductions": [
                {"label": "TDS Deduction", "value": round(float(tds), 2)},
                {"label": "Loss of Pay", "value": round(float(lop_amount), 2)}
                if lop_amount > 0 else None,
            ],

            "hr1_verified": instance.hr1_verified_by is not None,
            "hr2_verified": instance.hr2_verified_by is not None,
            "fully_verified": instance.is_fully_verified(),

            "verified_by": {
                "hr1": instance.hr1_verified_by.username
                if instance.hr1_verified_by else None,
                "hr2": instance.hr2_verified_by.username
                if instance.hr2_verified_by else None,
            },
        })

        data["deductions"] = [d for d in data["deductions"] if d is not None]

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

