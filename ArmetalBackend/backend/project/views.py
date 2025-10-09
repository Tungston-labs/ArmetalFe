from rest_framework import generics,filters
from .models import Project
from project.serialzers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        # Return projects for the logged-in user's company
        return Project.objects.filter(company=self.request.user.company).prefetch_related('employees')

    def perform_create(self, serializer):
        # Automatically assign the logged-in user's company
        serializer.save(company=self.request.user.company)



# Retrieve, Update, Delete
class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from .models import Project
from employee.serializers import EmployeeSerializer
from django.shortcuts import get_object_or_404

class EmployeesNotInProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        # Employees NOT in this project
        employees = Employee_db.objects.exclude(id__in=project.employees.all())
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

