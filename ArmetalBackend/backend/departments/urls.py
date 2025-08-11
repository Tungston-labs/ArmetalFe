from django.urls import path
from .views import (
    DepartmentCreateListView,
    DepartmentRetrieveUpdateDeleteView,EmployeeByDepartmentView
)

urlpatterns = [
    path('departments/', DepartmentCreateListView.as_view(), name='department-create-list'),
    path('departments/<int:pk>/', DepartmentRetrieveUpdateDeleteView.as_view(), name='department-detail-edit-delete'),
    path('employees/department/<int:department_id>/', EmployeeByDepartmentView.as_view(), name='employees-by-department'),

]
