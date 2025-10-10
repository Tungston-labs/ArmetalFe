from rest_framework import generics,filters,status
from .models import Project
from project.serialzers import ProjectReadSerializer,ProjectWriteSerializer,EmployeeSerializer,ProjectSerializer
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


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProjectWriteSerializer
        return ProjectReadSerializer

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from .models import Project
from django.shortcuts import get_object_or_404

class EmployeesNotInProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        # Employees NOT in this project
        employees = Employee_db.objects.exclude(id__in=project.employees.all())
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)


class RemoveEmployeeFromProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, project_id, employee_id):
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            employee = Employee_db.objects.get(pk=employee_id)
        except Employee_db.DoesNotExist:
            return Response({'detail': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        # Remove employee from project's ManyToMany field
        project.employees.remove(employee)
        return Response({'detail': f'Employee {employee.name} removed from project {project.name}.'}, status=status.HTTP_200_OK)
