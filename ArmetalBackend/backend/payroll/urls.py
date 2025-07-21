from django.urls import path
from .views import EmployeeBankDetailListView,EmployeePayrollRecordListCreateView,PayrollStatusUpdateView,PayrollRecordDetailView,EmployeePayslipView,PayslipDownloadView,MyPayrollRecordView
urlpatterns = [
    
    # bank + basic details of all employee
    path('employees/bank-details/', EmployeeBankDetailListView.as_view(), name='employee-bank-details'),

    # for updating status for all employees
    path('payroll/', EmployeePayrollRecordListCreateView.as_view(), name='payroll-record-list-create'),

    # status update for single employee
    path('payroll/<int:employee_id>/status/update/', PayrollStatusUpdateView.as_view(), name='update-payroll-status'),

    path('payroll/record/<int:id>/', PayrollRecordDetailView.as_view(), name='payroll-record-detail'),

# urls.py

    path('employee/payslips/', EmployeePayslipView.as_view(), name='employee-payslips'),
    path('employee/payslip/download/', PayslipDownloadView.as_view(), name='employee-payslip-download'),
    path("my_payroll/", MyPayrollRecordView.as_view(), name="my-payroll-record"),


]
