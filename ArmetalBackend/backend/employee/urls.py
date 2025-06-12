from django.urls import path
from .views import EmployeesInMyDepartmentView,EmployeeListCreateView,EmployeeRetrieveUpdateDestroyView,EmpBankPaymentCreateListView,EmpBankPaymentRetrieveUpdateDeleteView,UploadImageView,EmpDocumentCreateFromURLView

urlpatterns = [
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateDestroyView.as_view(), name='employee-detail'),

    # bank payment views

    path('employees/<int:employee_id>/bank-payments/', EmpBankPaymentCreateListView.as_view(), name='create-bank-payment'),
    path('bank-payments/<int:id>/', EmpBankPaymentRetrieveUpdateDeleteView.as_view(), name='detail-bank-payment'),

    # document upload
    path('upload-image/', UploadImageView.as_view(), name='upload-image'),
    path('employees/<int:employee_id>/documents/', EmpDocumentCreateFromURLView.as_view(), name='upload-emp-documents'),
    # list employees of same department
    path('employees/my-department/', EmployeesInMyDepartmentView.as_view(), name='employees-in-my-department'),

]
