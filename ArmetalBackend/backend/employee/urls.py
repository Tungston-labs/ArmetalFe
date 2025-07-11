from django.urls import path
from employee import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('employees/', views.EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', views.EmployeeRetrieveUpdateDestroyView.as_view(), name='employee-detail'),

    # bank payment views

       # List + Create
    path('employees/<int:employee_id>/bank-payments/', views.EmpBankPaymentCreateListView.as_view(), name='employee-bank-payment-list-create'),
    path('employees/<int:employee_id>/bank-payments/<int:pk>/', views.EmpBankPaymentEmployeeScopedDetailView.as_view(), name='employee-bank-payment-detail'),


  # document upload
    path('employees/<int:employee_id>/documents/', views.EmployeeDocumentsView.as_view(), name='employee-documents'),
    path('upload-image/', views.UploadImageView.as_view(), name='upload-temp-image'),
    path('upload-image/<int:pk>/', views.UploadImageDetailView.as_view(), name='upload-image-detail'),

    # path('documents/<int:pk>/', EmpDocumentDetailView.as_view(), name='emp-documents-detail'),
    # list employees of same department
    path('employees/my-department/', views.EmployeesInMyDepartmentView.as_view(), name='employees-in-my-department'),


    path('admin/dashboard-summary/', views.DashboardSummaryView.as_view(), name='dashboard-summary'),


    # mobile application

    path('profile/', views.EmployeeProfileView.as_view(), name='employee-profile'),

    path('employee/document-summary/', views.EmployeeDocumentSummaryView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



