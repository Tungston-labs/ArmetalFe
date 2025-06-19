from django.shortcuts import render

# Create your views here.
# tasks/views.py
from rest_framework import generics, permissions
from .models import DailyTask
from .serializers import DailyTaskSerializer
from user.permissions import IsEmployee, IsHRAdmin  # Your custom permissions

#  Employee: Create + List Own Tasks
class EmployeeDailyTaskCreateListView(generics.ListCreateAPIView):
    serializer_class = DailyTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return DailyTask.objects.filter(employee=self.request.user.employee_db)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee_db)

#  Employee: Retrieve/Update/Delete Own Task
class EmployeeDailyTaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DailyTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return DailyTask.objects.filter(employee=self.request.user.employee_db)

#  HR Admin: List All Tasks
class HRDailyTaskListView(generics.ListAPIView):
    queryset = DailyTask.objects.all()
    serializer_class = DailyTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]

# HR:list daily task of particular employee with id
from datetime import datetime


class HRDailyTaskByEmployeeView(generics.ListAPIView):
    serializer_class = DailyTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        queryset = DailyTask.objects.filter(employee__id=employee_id)

        # Optional date filter: ?date=2025-06-16
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
                queryset = queryset.filter(created_at__date=date_obj)
            except ValueError:
                pass  # Optionally raise a validation error

        return queryset.order_by('-created_at')


