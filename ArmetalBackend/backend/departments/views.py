from django.shortcuts import render
from django.db.models import Count

# Create your views here.

from rest_framework import generics, permissions,filters
from .models import Department
from .serializers import DepartmentSerializer
from user.permissions import IsHRAdmin  # Adjust import path as needed
from django.db.models import Count, Q

# Create + List View

from django.db.models import Count

from django.utils.timezone import now


from django.db.models import Count, Q
from django.utils.timezone import now


from django.db.models import Count, Q
from django.utils import timezone

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, filters
from .models import Department
from .serializers import DepartmentSerializer



from django.db.models import Count, Q
from django.utils import timezone

from reimbursement.models import Reimbursement
from attendance.models import Attendance
from leave.models import LeaveRequest

from django.db.models import Count, OuterRef, Subquery, IntegerField
from django.utils import timezone

class DepartmentCreateListView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        today = timezone.localdate()

        attendance_subquery = (
            Attendance.objects
            .filter(employee__department=OuterRef("pk"), date=today)
            .values("employee__department")
            .annotate(c=Count("employee", distinct=True))
            .values("c")[:1]
        )

        leave_subquery = (
            LeaveRequest.objects
            .filter(employee__department=OuterRef("pk"), status="pending")
            .values("employee__department")
            .annotate(c=Count("id"))
            .values("c")[:1]
        )

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
            )
        )

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



