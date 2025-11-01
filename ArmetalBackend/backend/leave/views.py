from rest_framework import generics,status,filters
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from shared.pagination import CustomPagination

from django.core.mail import EmailMessage
from rest_framework import generics, filters
from leave.models import LeaveRequest
from shared.pagination import CustomPagination
from employee.models import Employee_db
from user.permissions import IsEmployee
from datetime import timedelta
from django.db.models import Q
from rest_framework import serializers


class LeaveRequestCreateListView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']
    pagination_class = CustomPagination

    def get_queryset(self):
        return LeaveRequest.objects.filter(
            employee__user=self.request.user
        ).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Filter counts
        pending_count = queryset.filter(status='pending').count()
        lop_count = queryset.filter(leave_type='earned').count()

        # Paginated list
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response({
            'leaves': serializer.data,
            'pending_leave_count': pending_count,
            'loss_of_pay_count': lop_count,
        })

    def perform_create(self, serializer):
        employee = Employee_db.objects.get(user=self.request.user)
        from_date = serializer.validated_data.get('from_date')
        to_date = serializer.validated_data.get('to_date')

        # ✅ Check for overlapping leave requests
        overlapping_leaves = LeaveRequest.objects.filter(
            employee=employee
        ).filter(
            Q(from_date__lte=to_date) & Q(to_date__gte=from_date)
        )

        if overlapping_leaves.exists():
            raise serializers.ValidationError({
                "detail": "You have already added leave for one or more of the selected dates."
            })

        # ✅ If no overlap, save leave
        leave = serializer.save(employee=employee)

        # Send leave request email
        subject = f"Leave Request from {employee.name}"
        message = (
            f"Dear Sir/Madam,\n\n"
            f"I am writing to formally request leave as per the following details:\n\n"
            f"Leave Type : {leave.leave_type.title()}\n"
            f"From       : {leave.from_date.strftime('%d-%m-%Y')}\n"
            f"To         : {leave.to_date.strftime('%d-%m-%Y')}\n"
            f"Reason     : {leave.reason}\n\n"
            f"Regards,\n"
            f"{employee.name}\n"
            f"{employee.designation}\n"
            f"{employee.email}"
        )

        to_email = [leave.to_email]
        cc_emails = [leave.cc_email] if leave.cc_email else []

        try:
            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=employee.email,
                to=to_email,
                cc=cc_emails,
            )
            email.send(fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {e}")



from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class LeaveRequestCancelView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user, status='pending')

    def delete(self, request, *args, **kwargs):
        try:
            leave = self.get_queryset().get(pk=kwargs['pk'])
            leave.delete()
  
            return Response(status=status.HTTP_204_NO_CONTENT)
        except LeaveRequest.DoesNotExist:
            return Response({"detail": "Pending leave not found."}, status=status.HTTP_404_NOT_FOUND)




from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from leave.models import LeaveRequest
from leave.serializers import LeaveRequestSerializer
from shared.pagination import CustomPagination
from user.permissions import IsHRAdmin

class LeaveRequestAdminListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['employee__name']
    ordering_fields = ['from_date', 'to_date']
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        company = user.company

        if not company:
            return LeaveRequest.objects.none()

        queryset = LeaveRequest.objects.filter(
            employee__department__company=company
        )

        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(employee__department_id=department_id)

        return queryset.order_by('-created_at')


from rest_framework.views import APIView
from django.utils import timezone
from employee.models import  Employee_db
from employee.serializers import EmployeeSerializer  # Use the appropriate serializer

class EmployeesOnLeaveTodayByDepartmentView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request, department_id):
        today = timezone.now().date()

        leaves_qs = LeaveRequest.objects.filter(
            status='approved',
            from_date__lte=today,
            to_date__gte=today,
            employee__department_id=department_id
        )

        employees = Employee_db.objects.filter(id__in=leaves_qs.values_list('employee_id', flat=True))
        serializer = EmployeeSerializer(employees, many=True)

        return Response(serializer.data)

  


class LeaveRequestAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_date
from .models import LeaveRequest
from employee.models import Employee_db

class DepartmentEmployeesOnLeaveView(APIView):
    def get(self, request, employee_id):
        date_str = request.query_params.get('date')  # Expecting ?date=YYYY-MM-DD
        if not date_str:
            return Response(
                {"error": "Please provide a date in YYYY-MM-DD format as a query parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        leave_date = parse_date(date_str)
        if not leave_date:
            return Response(
                {"error": "Invalid date format. Please use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get the clicked employee
            employee = Employee_db.objects.get(id=employee_id)

            if not employee.department:
                return Response(
                    {"error": "This employee has no department assigned."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get department details
            department = employee.department

            # Get all employees in the same department
            department_employees = Employee_db.objects.filter(department=department)

            # Get approved leave requests for employees in this department for the given date
            on_leave_employees = LeaveRequest.objects.filter(
                employee__in=department_employees,
                status='approved',
                from_date__lte=leave_date,
                to_date__gte=leave_date
            ).select_related('employee')

            # Prepare response data
            data = {
                "department": {
                    "id": department.id,
                    "name": department.name,
                    "description": getattr(department, 'description', ''),
                },
                "on_leave": [
                    {
                        "id": leave.id,  # ✅ add leave request ID
                        "employee_name": leave.employee.name,
                        "email": leave.employee.email,
                        "phone": leave.employee.phno,
                        "leave_type": leave.leave_type,
                        "from_date": leave.from_date,
                        "to_date": leave.to_date,
                    }
                    for leave in on_leave_employees
                ]
            }

            return Response(data, status=status.HTTP_200_OK)

        except Employee_db.DoesNotExist:
            return Response(
                {"error": "Employee not found."},
                status=status.HTTP_404_NOT_FOUND
            )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

class LeaveByStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status = request.query_params.get('status')  # ?status=pending

        if not status:
            return Response({"error": "Leave status is required as a query parameter."}, status=400)

        try:
            employee = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        leaves = LeaveRequest.objects.filter(employee=employee, status=status).order_by('created_at')
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from leave.models import LeaveRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date, timedelta
import calendar
from datetime import date
from leave.models import LeaveRequest
from employee.models import Employee_db
from holidays.models import PublicHoliday


class LeaveSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        today = date.today()
        year = today.year
        month = today.month
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # Get holidays in the current month
        holidays = set(
            PublicHoliday.objects.filter(date__range=(first_day, last_day))
            .values_list('date', flat=True)
        )

        # Calculate working days (Mon-Sat, excluding Sundays and holidays)
        working_days = sum(
            1 for d in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=d)).weekday() != 6
            and (first_day + timedelta(days=d)) not in holidays
        )

        # ---- YEARLY APPROVED LEAVES ----
        year_start = date(year, 1, 1)
        year_end = date(year, 12, 31)

        leave_requests = LeaveRequest.objects.filter(
            employee=employee,
            status='approved',
            from_date__gte=year_start,
            to_date__lte=year_end
        )

        total_approved_days = 0
        for leave in leave_requests:
            days = (leave.to_date - leave.from_date).days + 1
            total_approved_days += days

        # LOP Calculation (year basis)
        allowed_leaves = employee.total_leave or 0
        remaining_leave = max(allowed_leaves - total_approved_days, 0)
        lop_days = max(0, total_approved_days - allowed_leaves)

        # Salary calculation (monthly still based on working days)
        monthly_salary = getattr(employee, "salary", 30000) or 30000
        per_day_salary = monthly_salary / working_days if working_days else 0
        lop_amount = round(per_day_salary * lop_days, 2)

        return Response({
            "employee_name": employee.name,
            "profile_pic": employee.profile_pic.url if employee.profile_pic else None,
            "total_leave": allowed_leaves,
            "approved_count": total_approved_days,   # yearly approved leave days
            "remaining_leave": remaining_leave,      # yearly balance
            "lop_days": lop_days,                    # yearly lop days
            "lop_amount": lop_amount,                # lop in money
            "working_days": working_days,            # monthly working days
            "monthly_salary": monthly_salary,
        })


         

class LeaveRequestEmpDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    lookup_field = 'pk'