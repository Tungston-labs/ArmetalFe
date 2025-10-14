from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Sum

from .models import Project
from employee.models import Employee_db
from attendance.models import Attendance
from holidays.models import PublicHoliday
from project.serialzers import (
    ProjectReadSerializer,
    ProjectWriteSerializer,
    EmployeeSerializer,
    ProjectSerializer,
    EmployeeAttendanceDetailSerializer
)
from datetime import timedelta


# ============================================================
#  Project List/Create
# ============================================================
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Project.objects.filter(company=self.request.user.company).prefetch_related('employees')

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)


# ============================================================
#  Project Retrieve/Update/Delete
# ============================================================
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

        # Add new employees
        employee_ids = data.pop("employees", None)
        if employee_ids is not None:
            for emp_id in employee_ids:
                project.employees.add(emp_id)

        # Update other fields
        serializer = self.get_serializer(project, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return full project details with employee info
        read_serializer = ProjectReadSerializer(project, context={'request': request})
        return Response(read_serializer.data)


# ============================================================
#  Employees Not In Project
# ============================================================
class EmployeesNotInProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        company = getattr(request.user, "company", None)
        if not company:
            return Response({"detail": "User has no company assigned"}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        if project.company != company:
            return Response({"detail": "Not authorized for this project"}, status=status.HTTP_403_FORBIDDEN)

        employees_not_in_project = Employee_db.objects.filter(
            department__company=company
        ).exclude(id__in=project.employees.all())

        serializer = EmployeeSerializer(employees_not_in_project, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ============================================================
#  Remove Employee From Project
# ============================================================
class RemoveEmployeeFromProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, project_id, employee_id):
        project = get_object_or_404(Project, pk=project_id)
        employee = get_object_or_404(Employee_db, pk=employee_id)

        project.employees.remove(employee)
        return Response(
            {'detail': f'Employee {employee.name} removed from project {project.name}.'},
            status=status.HTTP_200_OK
        )


# ============================================================
#  Employee Attendance Detail
# ============================================================
class EmployeeAttendanceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        employee = get_object_or_404(Employee_db, id=employee_id)

        # Date filter
        date_str = request.query_params.get('date')
        if date_str:
            try:
                selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            selected_date = timezone.localdate()

        attendance = Attendance.objects.filter(employee=employee, date=selected_date).first()

        # Weekly/Monthly totals
        week_start = selected_date - timedelta(days=selected_date.weekday())
        week_end = week_start + timedelta(days=6)
        total_week = Attendance.objects.filter(employee=employee, date__range=[week_start, week_end]).aggregate(total=Sum('total_hours'))['total'] or 0

        month_start = selected_date.replace(day=1)
        if month_start.month == 12:
            next_month_start = month_start.replace(year=month_start.year+1, month=1, day=1)
        else:
            next_month_start = month_start.replace(month=month_start.month+1, day=1)
        month_end = next_month_start - timedelta(days=1)
        total_month = Attendance.objects.filter(employee=employee, date__range=[month_start, month_end]).aggregate(total=Sum('total_hours'))['total'] or 0


        # 1. All dates in month
        all_days = [month_start + timedelta(days=i) for i in range((month_end - month_start).days + 1)]

        # 2. Exclude Sundays and holidays
        holidays = set(PublicHoliday.objects.filter(date__range=(month_start, month_end)).values_list('date', flat=True))
        working_days_list = [d for d in all_days if d.weekday() != 6 and d not in holidays]

        # 3. Count and calculate total hours
        working_days_count = len(working_days_list)
        total_working_hours = working_days_count * 8


        def format_hours(hours):
            if not hours:
                return "00:00"
            h = int(hours)
            m = int(round((hours - h) * 60))
            return f"{h:02d}:{m:02d}"

        if attendance:
            serializer = EmployeeAttendanceDetailSerializer(attendance, context={'request': request})
            data = serializer.data
        else:
            emp_serializer = EmployeeSerializer(employee, context={'request': request})
            data = {
                "employee": emp_serializer.data,
                "detail": f"No attendance recorded on {selected_date}.",
                "total_hours_formatted": "00:00",
                "weekly_hours_formatted": format_hours(total_week),
                "monthly_hours_formatted": format_hours(total_month),
                "total_working_hours": total_working_hours,
                "locations": []
            }

        # Ensure calculations are consistent
        data["weekly_hours_formatted"] = format_hours(total_week)
        data["monthly_hours_formatted"] = format_hours(total_month)
        data["total_working_hours"] = total_working_hours

        return Response(data, status=status.HTTP_200_OK)
