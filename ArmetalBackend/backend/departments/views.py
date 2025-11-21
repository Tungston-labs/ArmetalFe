from django.shortcuts import render
from rest_framework import generics, permissions,filters
from .models import Department
from .serializers import DepartmentSerializer,DepartmentMiniSerializer,DepartmentAttendanceSerializer
from user.permissions import IsHRAdmin  
from django.utils.timezone import now
from django.utils import timezone
from reimbursement.models import Reimbursement
from attendance.models import Attendance
from leave.models import LeaveRequest
from django.db.models import Count, OuterRef, Subquery, IntegerField, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from employee.serializers import EmployeeSerializer

# --------------------create ,list department by admin


class DepartmentMiniListView(generics.ListAPIView):
    serializer_class = DepartmentMiniSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]




class DepartmentCreateListView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        today = timezone.localdate()

        # ✅ Employees who have attendance today
        attendance_subquery = (
            Attendance.objects
            .filter(employee__department=OuterRef("pk"), date=today)
            .values("employee__department")
            .annotate(c=Count("employee", distinct=True))
            .values("c")[:1]
        )

        # ✅ Employees with pending leave requests
        leave_subquery = (
            LeaveRequest.objects
            .filter(employee__department=OuterRef("pk"), status="pending")
            .values("employee__department")
            .annotate(c=Count("id"))
            .values("c")[:1]
        )

        # ✅ Employees who are actually on approved leave today
        todays_leave_subquery = (
            LeaveRequest.objects
            .filter(
                employee__department=OuterRef("pk"),
                status="approved",
                from_date__lte=today,
                to_date__gte=today
            )
            .values("employee__department")
            .annotate(c=Count("employee", distinct=True))
            .values("c")[:1]
        )

        # ✅ Reimbursements on hold
        reimbursement_subquery = (
            Reimbursement.objects
            .filter(employee__department=OuterRef("pk"), status="On Hold")
            .values("employee__department")
            .annotate(c=Count("id"))
            .values("c")[:1]
        )

        return (
            Department.objects
            .filter(company=self.request.user.company)
            .annotate(
                employee_count=Count("employees", distinct=True),
                attendance_employee_count=Subquery(attendance_subquery, output_field=IntegerField()),
                leave_request_count=Subquery(leave_subquery, output_field=IntegerField()),
                reimbursement_request_count=Subquery(reimbursement_subquery, output_field=IntegerField()),
                todays_leave_employee_count=Subquery(todays_leave_subquery, output_field=IntegerField()),  # ✅ added
            )
        )

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

class DepartmentAttendanceListView(generics.ListAPIView):
    serializer_class = DepartmentAttendanceSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        today = timezone.localdate()

        attendance_subquery =  (
            Attendance.objects
            .filter(employee__department=OuterRef("pk"), date=today)
            .values("employee__department")
            .annotate(c=Count("employee", distinct=True))
            .values("c")[:1]

        )
        return Department.objects.annotate(
            attendance_employee_count=Subquery(attendance_subquery, output_field=IntegerField()))





# -------------------- Retrieve + Update + Delete View by admin
class DepartmentRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsHRAdmin]

    def get_queryset(self):
        return Department.objects.filter(company=self.request.user.company)
    

# --------------------employee view by departments(admin)
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

# --------------------get department head for employee
class MyDepartmentHeadEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        employee = getattr(user, 'employee_db', None)

        if not employee:
            return Response({"error": "Employee record not found"}, status=404)

        department = getattr(employee, 'department', None)  # Assuming Employee_db has FK to Department
        if not department or not department.department_head:
            return Response({"error": "Department head not assigned"}, status=404)

        head = department.department_head

        return Response({
            "department": department.name,
            "head_name": head.name,
            "email": head.email
        })

