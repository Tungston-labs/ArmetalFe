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


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Sum
from attendance.models import Attendance
from employee.models import Employee_db
from holidays.models import PublicHoliday
from .serialzers import EmployeeAttendanceDetailSerializer, EmployeeSerializer


class EmployeeAttendanceDetailView(APIView):
    """
    Get employee attendance details for a given employee ID.
    Optional query param: date=YYYY-MM-DD (default today)
    """
    permission_classes = [IsAuthenticated]

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

        # Try fetching attendance for that date
        attendance = Attendance.objects.filter(employee=employee, date=selected_date).first()

        # --- COMMON CALCULATIONS (for both with/without attendance) ---

        # Weekly total
        week_start = selected_date - timedelta(days=selected_date.weekday())
        week_end = week_start + timedelta(days=6)
        total_week = Attendance.objects.filter(employee=employee, date__range=[week_start, week_end]).aggregate(total=Sum('total_hours'))['total'] or 0

        # Monthly total
        month_start = selected_date.replace(day=1)
        if month_start.month == 12:
            next_month_start = month_start.replace(year=month_start.year + 1, month=1, day=1)
        else:
            next_month_start = month_start.replace(month=month_start.month + 1, day=1)
        month_end = next_month_start - timedelta(days=1)
        total_month = Attendance.objects.filter(employee=employee, date__range=[month_start, month_end]).aggregate(total=Sum('total_hours'))['total'] or 0

        # Total expected working hours (excluding Sundays & public holidays)
        holidays = set(
            PublicHoliday.objects.filter(date__range=(month_start, month_end)).values_list('date', flat=True)
        )
        working_days = sum(
            1 for d in range((month_end - month_start).days + 1)
            if (month_start + timedelta(days=d)).weekday() != 6 and (month_start + timedelta(days=d)) not in holidays
        )
        total_working_hours = working_days * 8  # assuming 8 hrs/day

        # Format helper
        def format_hours(hours):
            if not hours:
                return "00:00"
            h = int(hours)
            m = int(round((hours - h) * 60))
            return f"{h:02d}:{m:02d}"

        # If attendance exists, use serializer
        if attendance:
            serializer = EmployeeAttendanceDetailSerializer(attendance)
            data = serializer.data
        else:
            emp_serializer = EmployeeSerializer(employee)
            data = {
                "employee": emp_serializer.data,
                "detail": f"No attendance recorded on {selected_date}.",
                "total_hours_formatted": "00:00",
                "weekly_hours_formatted": format_hours(total_week),
                "monthly_hours_formatted": format_hours(total_month),
                "total_working_hours": total_working_hours,
                "locations": []
            }

        # Add calculations (to ensure consistency even if serializer is used)
        data["weekly_hours_formatted"] = format_hours(total_week)
        data["monthly_hours_formatted"] = format_hours(total_month)
        data["total_working_hours"] = total_working_hours

        return Response(data, status=status.HTTP_200_OK)
