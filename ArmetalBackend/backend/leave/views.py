from rest_framework import generics, status, filters,serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from django.utils.dateparse import parse_date
from datetime import timedelta, date
import calendar

from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from employee.models import Employee_db
from user.permissions import IsEmployee, IsHRAdmin
from shared.pagination import CustomPagination
from holidays.models import PublicHoliday
from django.core.mail import EmailMessage
from rest_framework.views import APIView


# ✅ Employee: List + Create Leave Requests
class LeaveRequestCreateListView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__name']
    pagination_class = CustomPagination

    def get_queryset(self):
        return LeaveRequest.objects.filter(
            employee__user=self.request.user
        ).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        pending_count = queryset.filter(status='pending').count()
        lop_count = queryset.filter(leave_type='earned').count()

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

        # ✅ Overlap check
        overlapping = LeaveRequest.objects.filter(
            employee=employee
        ).filter(Q(from_date__lte=to_date) & Q(to_date__gte=from_date))

        if overlapping.exists():
            raise serializers.ValidationError({
                "detail": "You have already added leave for one or more of the selected dates."
            })

        # ✅ Save Leave
        leave = serializer.save(employee=employee)

        # ✅ Include half-day details in email
        subject = f"Leave Request from {employee.name}"
        message = (
            f"Dear Sir/Madam,\n\n"
            f"I am writing to formally request leave as per the following details:\n\n"
            f"Leave Type : {leave.leave_type.title()}\n"
            f"From       : {leave.from_date.strftime('%d-%m-%Y')} ({leave.from_date_type.title()})\n"
            f"To         : {leave.to_date.strftime('%d-%m-%Y')} ({leave.to_date_type.title()})\n"
            f"Total Days : {leave.calculate_leave_days()}\n"
            f"Reason     : {leave.reason}\n\n"
            f"Regards,\n"
            f"{employee.name}\n"
            f"{employee.designation}\n"
            f"{employee.email}"
        )

        try:
            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=employee.email,
                to=[leave.to_email],
                cc=[leave.cc_email] if leave.cc_email else [],
            )
            email.send(fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {e}")


# ✅ Employee: Cancel Pending Leave
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


# ✅ HR: Leave List View



class LeaveRequestAdminListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['employee__name']
    ordering_fields = ['from_date', 'to_date']
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        company = user.company
        if not company:
            return LeaveRequest.objects.none()

        queryset = LeaveRequest.objects.filter(employee__department__company=company)

        # ✅ Department filter
        dept_id = self.request.query_params.get('department_id')
        if dept_id:
            queryset = queryset.filter(employee__department_id=dept_id)

        # ✅ Status filter (fix)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        return queryset.order_by('-created_at')


# ✅ HR: Leave Detail (Approve / Reject)
class LeaveRequestAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        instance = self.get_object()
        emp = instance.employee

        response.data["employee_leave_summary"] = {
            "employee_id": emp.id,
            "employee_name": emp.name,
            "total_leave": emp.total_leave,
            "paid_leave": emp.paid_leave,
        }
        return response


# ✅ HR: Employees on Leave (today) by Department
class EmployeesOnLeaveTodayByDepartmentView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request, department_id):
        today = timezone.now().date()
        leaves = LeaveRequest.objects.filter(
            status='approved',
            from_date__lte=today,
            to_date__gte=today,
            employee__department_id=department_id
        )
        employees = Employee_db.objects.filter(id__in=leaves.values_list('employee_id', flat=True))
        from employee.serializers import EmployeeSerializer
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)


# ✅ Department Employees on a Given Date
class DepartmentEmployeesOnLeaveView(APIView):
    def get(self, request, employee_id):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "Please provide ?date=YYYY-MM-DD"}, status=400)

        leave_date = parse_date(date_str)
        if not leave_date:
            return Response({"error": "Invalid date format"}, status=400)

        try:
            emp = Employee_db.objects.get(id=employee_id)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)

        if not emp.department:
            return Response({"error": "Employee has no department assigned"}, status=400)

        dept = emp.department
        dept_emps = Employee_db.objects.filter(department=dept)

        leaves = LeaveRequest.objects.filter(
            employee__in=dept_emps,
            status='approved',
            from_date__lte=leave_date,
            to_date__gte=leave_date
        ).select_related('employee')

        data = {
            "department": {"id": dept.id, "name": dept.name},
            "on_leave": [
                {
                    "id": l.id,
                    "employee_name": l.employee.name,
                    "email": l.employee.email,
                    "phone": l.employee.phno,
                    "leave_type": l.leave_type,
                    "from_date": l.from_date,
                    "to_date": l.to_date,
                    "paid_leave_count": l.employee.paid_leave,
                    "pending_leave": l.employee.total_leave,
                } for l in leaves
            ]
        }
        return Response(data)


# ✅ Employee: Leave by Status (pending / approved / rejected)
class LeaveByStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_param = request.query_params.get('status')
        if not status_param:
            return Response({"error": "Leave status is required (?status=pending)"}, status=400)

        try:
            emp = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        leaves = LeaveRequest.objects.filter(employee=emp, status=status_param).order_by('created_at')
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)

from employee.models import Employee_db
from employee.serializers import EmpBankPaymentSerializer
from rest_framework import serializers
from datetime import date, timedelta,datetime
from payroll.models import EmployeePayrollRecord
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday
import calendar
class LeaveSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            emp = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        today = date.today()
        year, month = today.year, today.month
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # --- Identify Holidays & Company Off Days ---
        holidays_qs = PublicHoliday.objects.filter(
            date__range=(first_day, last_day),
            company=emp.department.company
        )
        holidays = set()
        company_off_days = set()
        for h in holidays_qs:
            if h.holiday_type == 'company_off_day':
                company_off_days.add(h.date.weekday())
            else:
                holidays.add(h.date)

        # --- Working Days ---
        working_days = sum(
            1 for d in range((last_day - first_day).days + 1)
            if (first_day + timedelta(days=d)).weekday() not in company_off_days
            and (first_day + timedelta(days=d)) not in holidays
        )

        # --- Attendance ---
        attendances = Attendance.objects.filter(employee=emp, date__range=(first_day, last_day))
        full_days = half_days = 0
        attendance_dates = set()
        for att in attendances:
            hours = float(att.total_hours or 0)
            attendance_dates.add(att.date)
            if hours >= 8:
                full_days += 1
            elif 4 <= hours < 8:
                half_days += 1

        days_present = full_days + 0.5 * half_days

        # --- Approved Leave Days ---
        leave_requests = LeaveRequest.objects.filter(
            employee=emp, status='approved',
            from_date__lte=last_day, to_date__gte=first_day
        )
        approved_leave_dates = set()
        for leave in leave_requests:
            start = max(leave.from_date, first_day)
            end = min(leave.to_date, last_day)
            if isinstance(start, datetime):
                start = start.date()
            if isinstance(end, datetime):
                end = end.date()
            if start <= end:
                for n in range((end - start).days + 1):
                    approved_leave_dates.add(start + timedelta(days=n))

        # --- Unswiped Days ---
        all_days = [(first_day + timedelta(days=i)) for i in range((last_day - first_day).days + 1)]
        unswiped_valid_days = [
            d for d in all_days
            if d not in attendance_dates
            and d not in holidays
            and d.weekday() not in company_off_days
            and d not in approved_leave_dates
        ]
        unswiped_days = float(len(unswiped_valid_days))

        # --- Paid Leave ---
        paid_leave_balance = float(emp.paid_leave or 0.0)

        # --- LOP Calculation (same as payroll serializer) ---
        lop_days = max(unswiped_days - paid_leave_balance, 0)

        # --- Salary-based LOP Amount ---
        monthly_salary = float(getattr(emp, "salary", 30000) or 30000)
        per_day_salary = monthly_salary / working_days if working_days > 0 else 0
        lop_amount = round(per_day_salary * lop_days, 2)

        # --- Prepare Response ---
        return Response({
            "employee_name": emp.name,
            "profile_pic": emp.profile_pic.url if emp.profile_pic else None,
            "working_days": working_days,
            "days_present": days_present,
            "unswiped_days": unswiped_days,
            "paid_leave_used": paid_leave_balance,
            "lop_days": lop_days,
            "lop_amount": lop_amount,
            "monthly_salary": monthly_salary,
        })


# ✅ Employee: Retrieve/Update/Delete own leave
class LeaveRequestEmpDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    lookup_field = 'pk'
