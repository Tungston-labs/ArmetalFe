from django.urls import path
from .views import EmployeeBankDetailListView,EmployeePayrollRecordListCreateView,PayrollStatusUpdateView,PayrollRecordDetailView

urlpatterns = [
    
    # bank + basic details of all employee
    path('employees/bank-details/', EmployeeBankDetailListView.as_view(), name='employee-bank-details'),

    # for updating status for all employees
    path('payroll/', EmployeePayrollRecordListCreateView.as_view(), name='payroll-record-list-create'),

    # status update for single employee
    path('payroll/<int:employee_id>/status/update/', PayrollStatusUpdateView.as_view(), name='update-payroll-status'),

    path('payroll/record/<int:id>/', PayrollRecordDetailView.as_view(), name='payroll-record-detail'),


]
