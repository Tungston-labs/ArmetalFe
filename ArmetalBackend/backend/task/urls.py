# tasks/urls.py
from django.urls import path
from .views import (
    EmployeeDailyTaskCreateListView,
    EmployeeDailyTaskDetailView,
    HRDailyTaskListView,HRDailyTaskByEmployeeView
)

urlpatterns = [
    path('employee/tasks/', EmployeeDailyTaskCreateListView.as_view(), name='employee-task-list-create'),
    path('employee/tasks/<int:pk>/', EmployeeDailyTaskDetailView.as_view(), name='employee-task-detail'),
    path('admin/tasks/', HRDailyTaskListView.as_view(), name='hr-task-list'),
    path('admin/tasks/employee/<int:employee_id>/', HRDailyTaskByEmployeeView.as_view(), name='admin-tasks-by-employee'),
]
