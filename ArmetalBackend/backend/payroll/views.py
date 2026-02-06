from django.shortcuts import render
from rest_framework import generics, permissions,status,filters
from employee.models import EmpBankPaymentModel, Employee_db
from employee.serializers import EmpBankPaymentSerializer
from user.permissions import IsHRAdmin
from rest_framework.exceptions import NotFound
from .serializers import EmployeeWithBankDetailsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import EmployeePayrollRecord
from .serializers import EmployeePayrollRecordSerializer
from django.db import transaction
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.timezone import now



# Create your views here.
# employee list with bank details
class EmployeeBankDetailListView(generics.ListAPIView):
    serializer_class = EmployeeWithBankDetailsSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get_queryset(self):
        company = self.request.user.company
        if not company:
            return Employee_db.objects.none()
        return Employee_db.objects.filter(department__company=company)
    
#for updating status according to month and year(for all employees)
from datetime import date
import calendar



class EmployeePayrollRecordListCreateView(generics.GenericAPIView):
    serializer_class = EmployeePayrollRecordSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id']

    def get_queryset(self):
        company = self.request.user.company
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        department_id = self.request.query_params.get('department')

        employees = Employee_db.objects.filter(department__company=company)

        if department_id:
            employees = employees.filter(department__id=department_id)

        # ✅ FILTER BY JOINING DATE
        if year and month:
            year = int(year)
            month = int(month)

            last_day = calendar.monthrange(year, month)[1]
            last_date_of_month = date(year, month, last_day)

            employees = employees.filter(joining_date__lte=last_date_of_month)

            queryset = EmployeePayrollRecord.objects.filter(
                employee__in=employees,
                year=year,
                month=month
            )
        else:
            queryset = EmployeePayrollRecord.objects.filter(
                employee__in=employees
            )

        return queryset



    def get(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        if not year or not month:
            return Response({"detail": "Year and month are required."}, status=status.HTTP_400_BAD_REQUEST)

        year = int(year)
        month = int(month)

        last_day = calendar.monthrange(year, month)[1]
        last_date_of_month = date(year, month, last_day)

        employees = Employee_db.objects.filter(
            department__company=request.user.company,
            joining_date__lte=last_date_of_month
        )

        existing_records = self.get_queryset()
        existing_emp_ids = existing_records.values_list('employee_id', flat=True)

        # Create missing payroll records
        missing_emps = employees.exclude(id__in=existing_emp_ids)
        for emp in missing_emps:
            bank = getattr(emp, 'bank_details', None)
            if bank:
                EmployeePayrollRecord.objects.get_or_create(
                    employee=emp,
                    year=year,
                    month=month,
                    defaults={
                        "basic_salary": bank.basic_salary,
                        "salary_increment": bank.salary_increment,
                        "housing_allowance": bank.housing_allowance,
                        "transportation": bank.transportation,
                        "tds_deduction_amount": bank.tds_deduction_amount,
                        "payment_mode": bank.payment_mode,
                        "tax_regime": bank.tax_regime,
                        "pan_number": bank.pan_number,
                        "account_number": bank.account_number,
                        "status": "OnHold"
                    }
                )

        # ⭐ AUTO-SYNC SALARY IF EMPLOYEE BANK DETAILS CHANGED
        for record in existing_records:
            # 🔒 Do not touch verified payrolls
            if record.is_fully_verified():
                continue

            bank = getattr(record.employee, 'bank_details', None)
            if not bank:
                continue


            if (
                record.basic_salary != bank.basic_salary or
                record.salary_increment != bank.salary_increment or
                record.housing_allowance != bank.housing_allowance or
                record.transportation != bank.transportation or
                record.tds_deduction_amount != bank.tds_deduction_amount
            ):
                record.basic_salary = bank.basic_salary
                record.salary_increment = bank.salary_increment
                record.housing_allowance = bank.housing_allowance
                record.transportation = bank.transportation
                record.tds_deduction_amount = bank.tds_deduction_amount
                record.save()

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    @transaction.atomic
    def post(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        selected_employee_ids = request.data.get('employee_ids', [])
        new_status = request.data.get('status', 'Pending')

        if not year or not month:
            return Response({'error': 'Year and month are required.'}, status=status.HTTP_400_BAD_REQUEST)

        employees = Employee_db.objects.filter(id__in=selected_employee_ids, department__company=request.user.company)
        updated_records = []
        for emp in employees:
            bank = getattr(emp, 'bank_details', None)
            if not bank:
                continue

            record, _ = EmployeePayrollRecord.objects.update_or_create(
                employee=emp,
                year=year,
                month=month,
                defaults={
                    "basic_salary": bank.basic_salary,
                    "salary_increment": bank.salary_increment,
                    "housing_allowance": bank.housing_allowance,
                    "transportation": bank.transportation,
                    "tds_deduction_amount": bank.tds_deduction_amount,
                    "payment_mode": bank.payment_mode,
                    "tax_regime": bank.tax_regime,
                    "pan_number": bank.pan_number,
                    "account_number": bank.account_number,
                    "status": new_status,
                }
            )
            updated_records.append(record)

        serializer = self.get_serializer(updated_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PayrollVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, employee_id):
        month = request.data.get("month")
        year = request.data.get("year")

        record = get_object_or_404(
            EmployeePayrollRecord,
            employee__id=employee_id,
            month=month,
            year=year
        )

        user = request.user

        # ✅ Only HR (admin or normal HR) from the same company can verify
        if not (user.is_hr_admin or user.is_hr):
            return Response({"error": "You are not allowed to verify payroll."}, status=403)

        if user.company != record.employee.department.company:
            return Response({"error": "You are not part of this company."}, status=403)

        # ✅ Assign verification slots
        if record.hr1_verified_by is None:
            record.hr1_verified_by = user
            record.hr1_verified_at = now()
        elif record.hr2_verified_by is None and record.hr1_verified_by != user:
            # 🔒 Freeze payroll snapshot on final verification
            serializer = EmployeePayrollRecordSerializer(
                record, context={"request": request}
            )
            data = serializer.data

            record.working_days = data.get("working_days")
            record.days_present = data.get("days_present")
            record.lop_days = data.get("lop_days")
            record.lop_amount = data.get("lop_amount")

            record.hr2_verified_by = user
            record.hr2_verified_at = now()

        else:
            return Response({"error": "Already verified or duplicate HR"}, status=400)

        record.save()

        # ✅ FIXED: pass request in serializer context
        serializer = EmployeePayrollRecordSerializer(record, context={"request": request})
        return Response(serializer.data)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from payroll.models import EmployeePayrollRecord
from finance.models import FinanceRecord
from payroll.serializers import EmployeePayrollRecordSerializer


class PayrollStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, employee_id):
        month = request.data.get("month")
        year = request.data.get("year")
        new_status = request.data.get("status")

        record = get_object_or_404(
            EmployeePayrollRecord,
            employee__id=employee_id,
            month=month,
            year=year
        )

        # ✅ Block update unless fully verified
        if not record.is_fully_verified():
            return Response(
                {"error": "Both HRs must verify before updating status."},
                status=400
            )

        if new_status not in dict(EmployeePayrollRecord.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=400)

        previous_status = record.status
        record.status = new_status
        record.save()

        # ✅ Create Finance record ONLY when status becomes PAID
        if previous_status != "Paid" and new_status == "Paid":

            basic = record.basic_salary or 0
            increment = record.salary_increment or 0
            housing = record.housing_allowance or 0
            transport = record.transportation or 0

            lop = record.lop_amount or 0
            tds = record.tds_deduction_amount or 0

            gross_salary = basic + increment + housing + transport
            net_salary = gross_salary - (lop + tds)

            # 🔒 Prevent duplicate salary entries
            already_exists = FinanceRecord.objects.filter(
                category="SALARY",
                payment_type="OUT",
                note__icontains=f"{record.employee.employee_id}",
                date__month=month,
                date__year=year
            ).exists()

            if not already_exists:
                FinanceRecord.objects.create(
                    date=timezone.now().date(),
                    amount=net_salary,
                    payment_type="OUT",
                    category="SALARY",
                    note=(
                        f"Salary paid to {record.employee.name} "
                        f"(Employee ID: {record.employee.employee_id}) "
                        f"for {month}/{year}"
                    )
                )


        serializer = EmployeePayrollRecordSerializer(
            record,
            context={"request": request}
        )
        return Response(serializer.data)


    # payroll (payslip) view

# views.py
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import EmployeePayrollRecord
from .serializers import EmployeePayrollRecordSerializer

class PayrollRecordDetailView(RetrieveAPIView):
    queryset = EmployeePayrollRecord.objects.all()
    serializer_class = EmployeePayrollRecordSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import EmployeePayrollRecord
from .serializers import EmployeePayrollRecordSerializer
from employee.models import Employee_db
from .utils import generate_payslip_pdf
class EmployeePayslipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = Employee_db.objects.get(user=request.user)
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        queryset = EmployeePayrollRecord.objects.filter(employee=employee)
        if year:
            queryset = queryset.filter(year=year)
        if month:
            queryset = queryset.filter(month__iexact=month)

        serializer = EmployeePayrollRecordSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)




from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, Http404
from payroll.models import EmployeePayrollRecord
from employee.models import Employee_db
from .utils import generate_payslip_pdf  # Make sure this points to your updated utils.py

class PayslipDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not (month and year):
            return HttpResponse("Month and year required", status=400)

        try:
            employee = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return HttpResponse("Employee not found", status=404)

        try:
            record = EmployeePayrollRecord.objects.get(
                employee=employee, month=int(month), year=int(year)
            )
        except EmployeePayrollRecord.DoesNotExist:
            raise Http404("Payroll record not found")

        # ✅ Use serializer to get all computed values
        from .serializers import EmployeePayrollRecordSerializer
        serialized = EmployeePayrollRecordSerializer(record).data
        print("\n==================== PAYSLIP DATA ====================")
        import pprint
        pprint.pprint(serialized)
        print("=====================================================\n")


        # ✅ Pass serializer data (dict), not model instance
        pdf_bytes = generate_payslip_pdf(serialized)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Payslip_{month}_{year}.pdf"'
        response.write(pdf_bytes)
        return response


