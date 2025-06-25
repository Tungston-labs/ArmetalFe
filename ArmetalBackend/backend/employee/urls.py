from django.urls import path
from .views import EmployeesInMyDepartmentView,EmployeeListCreateView,EmployeeRetrieveUpdateDestroyView,EmpBankPaymentCreateListView,UploadImageView,DashboardSummaryView,UploadImageDetailView,EmpBankPaymentEmployeeScopedDetailView,EmployeeDocumentsView

urlpatterns = [
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateDestroyView.as_view(), name='employee-detail'),

    # bank payment views

       # List + Create
    path('employees/<int:employee_id>/bank-payments/', EmpBankPaymentCreateListView.as_view(), name='employee-bank-payment-list-create'),
    path('employees/<int:employee_id>/bank-payments/<int:payment_id>/', EmpBankPaymentEmployeeScopedDetailView.as_view(), name='employee-bank-payment-detail'),


    # document upload
  # document upload
    path('employees/<int:employee_id>/documents/', EmployeeDocumentsView.as_view(), name='employee-documents'),
    path('upload-image/', UploadImageView.as_view(), name='upload-temp-image'),
    path('upload-image/<int:pk>/', UploadImageDetailView.as_view(), name='upload-image-detail'),

    # path('documents/<int:pk>/', EmpDocumentDetailView.as_view(), name='emp-documents-detail'),
    # list employees of same department
    path('employees/my-department/', EmployeesInMyDepartmentView.as_view(), name='employees-in-my-department'),


    path('admin/dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),


]
