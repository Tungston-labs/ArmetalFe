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
from rest_framework.permissions import IsAuthenticated
from leave.models import LeaveRequest
from leave.serializers import LeaveRequestSerializer
from shared.pagination import CustomPagination
from employee.models import Employee_db
from user.permissions import IsEmployee

from rest_framework.response import Response

class LeaveRequestCreateListView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']
    pagination_class = CustomPagination

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Filter counts
        pending_count = queryset.filter(status='pending').count()
        lop_count = queryset.filter(leave_type='earned').count()  # or whatever leave type you count as LOP

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
        leave = serializer.save(employee=employee)

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

        return LeaveRequest.objects.filter(
            employee__department__company=company
        ).order_by('-created_at') 


  


class LeaveRequestAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

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

        leaves = LeaveRequest.objects.filter(employee=employee, status=status)
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
            if (first_day + timedelta(days=d)).weekday() != 6 and (first_day + timedelta(days=d)) not in holidays
        )

        # Get approved leaves in this month
        leave_requests = LeaveRequest.objects.filter(
            employee=employee,
            status='approved',
            from_date__lte=last_day,
            to_date__gte=first_day
        )

        total_leave_days = 0
        for leave in leave_requests:
            leave_start = max(leave.from_date, first_day)
            leave_end = min(leave.to_date, last_day)
            total_leave_days += (leave_end - leave_start).days + 1

        # LOP Calculation
        allowed_leaves = employee.total_leave or 0
        lop_days = max(0, total_leave_days - allowed_leaves)

        # Salary calculation (you can fetch actual salary if needed)
        monthly_salary = employee.salary if hasattr(employee, 'salary') and employee.salary else 30000  # fallback
        per_day_salary = monthly_salary / working_days if working_days else 0
        lop_amount = round(per_day_salary * lop_days, 2)

        # All-time approved count
        all_time_approved = LeaveRequest.objects.filter(
            employee=employee,
            status='approved'
        ).count()

        # Remaining leave (not month-based)
        remaining_leave = max(allowed_leaves - all_time_approved, 0)

        return Response({
            "employee_name": employee.name,
            "profile_pic": employee.profile_pic.url if employee.profile_pic else None,
            "total_leave": allowed_leaves,
            "approved_count": all_time_approved,
            "pending_count": remaining_leave,
            "monthly_leave_days": total_leave_days,
            "lop_days": lop_days,
            "lop_amount": lop_amount,
            "working_days": working_days,
            "monthly_salary": monthly_salary,
        })

class LeaveRequestEmpDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    lookup_field = 'pk'