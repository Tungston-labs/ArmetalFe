from rest_framework import generics,filters,status
from .models import Project
from project.serialzers import ProjectReadSerializer,ProjectWriteSerializer,EmployeeSerializer,ProjectSerializer,EmployeeAttendanceDetailSerializer
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
        project = self.get_object()
        data = request.data.copy()

        # Handle employee addition
        employee_ids = data.pop("employees", None)  # pop so serializer won't overwrite
        if employee_ids is not None:
            # Add only new employees
            for emp_id in employee_ids:
                project.employees.add(emp_id)

        # Update other fields normally
        serializer = self.get_serializer(project, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return the updated project with employees
        read_serializer = ProjectReadSerializer(project)
        return Response(read_serializer.data)





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import Project
from employee.models import Employee_db
from employee.serializers import EmployeeSerializer

class EmployeesNotInProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        user = request.user
        company = getattr(user, "company", None)

        if not company:
            return Response(
                {"detail": "User has no company assigned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the project
        project = get_object_or_404(Project, id=project_id)

        # Ensure the project belongs to the same company
        if project.company != company:
            return Response(
                {"detail": "Not authorized for this project"},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Get employees from same company (through department)
        employees_not_in_project = Employee_db.objects.filter(
            department__company=company
        ).exclude(
            id__in=project.employees.all()
        )

        serializer = EmployeeSerializer(employees_not_in_project, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


# attendance/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
from attendance.models import Attendance
from employee.models import Employee_db

class EmployeeAttendanceDetailView(APIView):
    """
    Get employee attendance details for a given employee ID
    Optional query param: date=YYYY-MM-DD (default today)
    """
    permission_classes = [IsAuthenticated]  # You can add custom permissions if needed

    def get(self, request, employee_id):
        # Fetch employee
        try:
            employee = Employee_db.objects.get(id=employee_id)
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get date filter
        date_str = request.query_params.get('date')
        if date_str:
            try:
                selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            selected_date = timezone.localdate()

        # Fetch attendance for the employee on that date
        try:
            attendance = Attendance.objects.get(employee=employee, date=selected_date)
            serializer = EmployeeAttendanceDetailSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Attendance.DoesNotExist:
            # Return employee info even if no attendance exists
            emp_serializer = EmployeeSerializer(employee)
            return Response({
                "employee": emp_serializer.data,
                "detail": f"No attendance recorded on {selected_date}."
            }, status=status.HTTP_200_OK)
