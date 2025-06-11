from django.shortcuts import render

# Create your views here.

from rest_framework import generics, permissions,filters
from .models import Department
from .serializers import DepartmentSerializer
from user.permissions import IsHRAdmin  # Adjust import path as needed

# Create + List View
class DepartmentCreateListView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Department.objects.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

# Retrieve + Update + Delete View
class DepartmentRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsHRAdmin]

    def get_queryset(self):
        return Department.objects.filter(company=self.request.user.company)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from employee.serializers import EmployeeSerializer
from departments.models import Department

class EmployeeByDepartmentView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request, department_id):
        try:
            department = Department.objects.get(pk=department_id, company=request.user.company)
        except Department.DoesNotExist:
            return Response({"detail": "Department not found."}, status=404)

        employees = Employee_db.objects.filter(department=department)
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)



