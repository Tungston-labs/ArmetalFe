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



class EmployeePayrollRecordListCreateView(generics.GenericAPIView):
    serializer_class = EmployeePayrollRecordSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name', 'employee__employee_id']

    def get_queryset(self):
        company = self.request.user.company
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')

        employees = Employee_db.objects.filter(department__company=company)

        if year and month:
            queryset = EmployeePayrollRecord.objects.filter(
                employee__in=employees, year=year, month=month
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

        employees = Employee_db.objects.filter(department__company=request.user.company)
        existing_records = self.get_queryset()
        existing_emp_ids = existing_records.values_list('employee_id', flat=True)

        missing_emps = employees.exclude(id__in=existing_emp_ids)
        for emp in missing_emps:
            bank = getattr(emp, 'bank_details', None)
            if bank:
                EmployeePayrollRecord.objects.create(
                    employee=emp,
                    year=year,
                    month=month,
                    basic_salary=bank.basic_salary,
                    salary_increment=bank.salary_increment,
                    housing_allowance=bank.housing_allowance,
                    transportation=bank.transportation,
                    tds_deduction_amount=bank.tds_deduction_amount,
                    payment_mode=bank.payment_mode,
                    tax_regime=bank.tax_regime,
                    pan_number=bank.pan_number,
                    account_number=bank.account_number,
                    status='OnHold'
                )

        queryset = self.filter_queryset(self.get_queryset())  # 👈 this applies search
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



class PayrollStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def patch(self, request, employee_id):
        month = request.data.get('month')
        year = request.data.get('year')
        new_status = request.data.get('status')

        if not all([month, year, new_status]):
            return Response({"error": "Month, year, and status are required."}, status=400)

        if new_status not in dict(EmployeePayrollRecord.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=400)

        record = get_object_or_404(
            EmployeePayrollRecord,
            employee__id=employee_id,
            month=month,
            year=year
        )

        record.status = new_status
        record.save()

        serializer = EmployeePayrollRecordSerializer(record)
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

        serializer = EmployeePayrollRecordSerializer(queryset, many=True)
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

        # Generate the PDF content using the utility function
        pdf_bytes = generate_payslip_pdf(employee, record)

        # Return as PDF response
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Payslip_{month}_{year}.pdf"'
        response.write(pdf_bytes)
        return response
