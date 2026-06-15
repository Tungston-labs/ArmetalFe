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

from decimal import Decimal, ROUND_HALF_UP
from datetime import date, datetime, timedelta
import calendar
from rest_framework import serializers

# serializers.py

from decimal import Decimal, ROUND_HALF_UP
from datetime import date, datetime, timedelta
import calendar

from rest_framework import serializers

from .models import EmployeePayrollRecord
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


class EmployeePayrollRecordSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source="employee.name",
        read_only=True
    )

    department = serializers.CharField(
        source="employee.department.name",
        read_only=True
    )

    employee_id = serializers.CharField(
        source="employee.employee_id",
        read_only=True
    )

    designation = serializers.CharField(
        source="employee.designation",
        read_only=True
    )

    email = serializers.EmailField(
        source="employee.email",
        read_only=True
    )

    joining_date = serializers.DateField(
        source="employee.joining_date",
        read_only=True
    )

    class Meta:
        model = EmployeePayrollRecord
        fields = "__all__"

    def to_representation(self, instance):

        data = super().to_representation(instance)

        employee = instance.employee
        department = employee.department
        company = department.company if department else None

        request = self.context.get("request")

        year = instance.year

        month = instance.month

        first_day = date(year, month, 1)

        last_day = date(
            year,
            month,
            calendar.monthrange(year, month)[1]
        )

        # ======================================================
        # WORKING DAYS
        # ======================================================

        holidays_qs = PublicHoliday.objects.filter(
            company=company
        )

        holidays = set()
        company_off_days = set()

        for h in holidays_qs:

            if h.holiday_type == "company_off_day":

                if h.off_day_weekday is not None:
                    company_off_days.add(
                        h.off_day_weekday
                    )

            else:

                if (
                    h.date and
                    first_day <= h.date <= last_day
                ):
                    holidays.add(h.date)

        all_working_dates = [
            first_day + timedelta(days=i)
            for i in range((last_day - first_day).days + 1)
            if (
                (first_day + timedelta(days=i)).weekday()
                not in company_off_days
            )
            and (
                (first_day + timedelta(days=i))
                not in holidays
            )
        ]

        working_days = Decimal(len(all_working_dates))

        # ======================================================
        # ATTENDANCE
        # ======================================================

        full_day_hours = Decimal(
            company.working_hours_per_day or 8
        )

        half_day_hours = Decimal(
            company.half_day_hours or 4
        )

        attendances = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day),
        )

        attendance_map = {
            att.date: Decimal(att.total_hours or 0)
            for att in attendances
        }

        full_days = Decimal(0)
        half_days = Decimal(0)

        for day in all_working_dates:

            hours = attendance_map.get(day, Decimal(0))

            if hours >= full_day_hours:
                full_days += 1

            elif hours >= half_day_hours:
                half_days += Decimal("0.5")

        days_present = full_days + half_days

        # ======================================================
        # APPROVED LEAVES
        # ======================================================

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

            for i in range((end - start).days + 1):

                leave_day = start + timedelta(days=i)

                if leave_day in all_working_dates:
                    approved_leave_dates.add(leave_day)

        approved_leave_days = Decimal(
            len(approved_leave_dates)
        )

        total_accounted_days = (
            days_present + approved_leave_days
        )

        lop_days = max(
            working_days - total_accounted_days,
            Decimal(0)
        )

        # ======================================================
        # SALARY INCREMENTS
        # ======================================================

        increments_qs = SalaryIncrement.objects.filter(
            employee=employee
        ).order_by("date")

        total_increment_amount = Decimal(0)

        increment_history = []

        for inc in increments_qs:

            total_increment_amount += Decimal(
                inc.increment_amount or 0
            )

            increment_history.append({
                "date": str(inc.date),
                "increment_amount": float(
                    inc.increment_amount or 0
                ),
            })

        # ======================================================
        # TOTAL SALARY
        # ======================================================

        total_salary = (
            Decimal(instance.basic_salary or 0)
            + total_increment_amount
        )

        # ======================================================
        # INCENTIVE
        # ======================================================

        incentive_amount = Decimal(
            instance.incentive_amount or 0
        )
        # ======================================================
        # DEDUCTION
        # ======================================================
        deduction_amount = Decimal(
            instance.deduction_amount or 0
        )

        # ======================================================
        # GROSS EARNINGS
        # ======================================================

        gross_earnings = (
            total_salary + incentive_amount
        )

        # ======================================================
        # SALARY SPLIT
        # ======================================================

        basic_percent = Decimal(
            company.basic_salary_percent or 0
        )

        house_percent = Decimal(
            company.house_allowance_percent or 0
        )

        transport_percent = Decimal(
            company.transport_allowance_percent or 0
        )

        special_percent = Decimal(
            company.special_allowance_percent or 0
        )

        basic_salary = (
            total_salary * basic_percent / 100
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )

        housing_allowance = (
            total_salary * house_percent / 100
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )

        transportation = (
            total_salary * transport_percent / 100
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )

        special_allowance = (
            total_salary * special_percent / 100
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )

        calculated_total = (
            basic_salary +
            housing_allowance +
            transportation +
            special_allowance
        )

        difference = total_salary - calculated_total

        special_allowance += difference

        

        # ======================================================
        # LOP
        # ======================================================

        daily_salary = total_salary / (
            working_days or Decimal(1)
        )

        lop_amount = (
            daily_salary * lop_days
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        # ======================================================
        # FINAL NET PAY
        # ======================================================

        tds = Decimal(
            instance.tds_deduction_amount or 0
        )

        

        
        net_pay = (
            gross_earnings
            - lop_amount
            - tds
            - deduction_amount
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        if net_pay < 0:
            net_pay = Decimal(0)

        # ======================================================
        # RESPONSE
        # ======================================================

        data.update({

            "company": {
                "name": company.name if company else None,
                "address": company.address if company else None,
                "email": company.email if company else None,
                "contact_number": (
                    company.contact_number
                    if company else None
                ),
                "logo_url": (
                    request.build_absolute_uri(company.logo.url)
                    if company and company.logo else None
                ),
            },

            "working_days": float(working_days),

            "days_present": float(days_present),

            "approved_leave_days": float(
                approved_leave_days
            ),

            "lop_days": float(lop_days),

            "lop_amount": float(lop_amount),

            "total_increment_amount": float(
                total_increment_amount
            ),

            "increment_history": increment_history,

            "gross_earnings": float(gross_earnings),

            "total_deductions": float(
                    lop_amount + tds + deduction_amount
                ),

            "net_pay": float(net_pay),

            "incentive_amount": float(
                incentive_amount
            ),

            "incentive_type": (
                instance.incentive_type
            ),

            "incentive_reason": (
                instance.incentive_reason
            ),
            "deduction_amount": float(
                deduction_amount
            ),

            "deduction_type": (
                instance.deduction_type
            ),

            "deduction_reason": (
                instance.deduction_reason
            ),

            "earnings": [

                {
                    "label": "Basic Salary",
                    "amount": float(basic_salary)
                },

                {
                    "label": "Housing Allowance",
                    "amount": float(housing_allowance)
                },

                {
                    "label": "Transportation",
                    "amount": float(transportation)
                },

                {
                    "label": "Special Allowance",
                    "amount": float(special_allowance)
                },

                {
                    "label": "Incentive",
                    "amount": float(incentive_amount)
                },
            ],

            "deductions": [

                {
                    "label": "TDS Deduction",
                    "value": float(tds)
                },

                {
                    "label": "Loss of Pay",
                    "value": float(lop_amount)
                },

                {
                    "label": (
                        instance.deduction_type
                        or "Other Deduction"
                    ),
                    "value": float(deduction_amount)
                },
            ],
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

