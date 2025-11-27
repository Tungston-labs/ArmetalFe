from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date, timedelta
from employee.models import Employee_db
from leave.models import LeaveRequest
from attendance.models import Attendance
from user.permissions import IsHRAdmin
from django.db.models import Q
from reimbursement.models import Reimbursement
from departments.models import Department


class DashboardCountsView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        today = date.today()
        upcoming_range = today + timedelta(days=30)
        company = request.user.company 

        employees_qs = Employee_db.objects.filter(department__company=company)

        data = {
            "total_employees": employees_qs.count(),
            "pending_leave_requests": LeaveRequest.objects.filter(
                status="pending",
                employee__department__company=company
            ).count(),
            "upcoming_visa_expiry": employees_qs.filter(
                visa_expiry_date__range=[today, upcoming_range]
            ).count(),
            "upcoming_contract_expiry": employees_qs.filter(
                contract_expiry_date__range=[today, upcoming_range]
            ).count(),
            "todays_attendance_count": Attendance.objects.filter(
                date=today,
                employee__department__company=company
            ).count(),
        }

        return Response(data)
    

class ReimbursementCountsView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        company = request.user.company

        qs = Reimbursement.objects.filter(
            employee__department__company=company
        )

        data = {
            "total_requests": qs.count(),
            "pending_count": qs.filter(status="pending").count(),
            "verified_count": qs.filter(status="verified").count(),
        }

        return Response(data)
    

from django.db.models.functions import TruncMonth
from django.db.models import Count

class ReimbursementMonthWiseCountView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        company = request.user.company

        qs = Reimbursement.objects.filter(
            employee__department__company=company
        ).annotate(
            month=TruncMonth('created_at')  # adjust field if different
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        # Format response as "YYYY-MM": count
        data = {
            item['month'].strftime("%Y-%m"): item['count']
            for item in qs
        }

        return Response(data)
class DepartmentDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        company = request.user.company

        # Total department count
        total_departments = Department.objects.filter(company=company).count()

        # Recently added departments (latest by created_at)
        recent_departments_qs = Department.objects.filter(
            company=company
        ).order_by('-created_at')[:4]  # change to [:3] if you want only 3

        recent_departments = [
            {
                "id": dept.id,
                "name": dept.name,
                "created_at": dept.created_at.date(),  # Only date part
            }
            for dept in recent_departments_qs
        ]

        return Response({
            "total_departments": total_departments,
            "recent_departments": recent_departments
        })
    
class RecentEmployeesView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        company = request.user.company

        # Fetch employees under the company and order by latest created
        recent_employees_qs = Employee_db.objects.filter(
            department__company=company
        ).order_by('-created_at')[:5]

        recent_employees = [
            {
                "id": emp.id,
                "name": emp.name,
                "employee_id": emp.employee_id,
                "department": emp.department.name if emp.department else None,
                "profile_pic": request.build_absolute_uri(emp.profile_pic.url) if emp.profile_pic else None,
                "added_date": emp.created_at.date()  # only YYYY-MM-DD
            }
            for emp in recent_employees_qs
        ]

        return Response({
            "recent_employees": recent_employees
        })
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .serializers import ContractExpirySerializer

class ContractExpiry30DaysView(APIView):
    def get(self, request):
        today = timezone.now().date()
        next_30 = today + timedelta(days=30)

        employees = Employee_db.objects.filter(
            contract_expiry_date__isnull=False,
            contract_expiry_date__gte=today,
            contract_expiry_date__lte=next_30
        ).order_by("contract_expiry_date")

        serializer = ContractExpirySerializer(employees, many=True)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

def time_since(dt):
    """Return human readable time difference."""
    now = timezone.now()
    diff = now - dt

    if diff.days == 0:
        seconds = diff.seconds
        if seconds < 60:
            return "just now"
        elif seconds < 3600:
            return f"{seconds // 60} minutes ago"
        else:
            return f"{seconds // 3600} hours ago"
    elif diff.days == 1:
        return "1 day ago"
    else:
        return f"{diff.days} days ago"


class SimpleNotificationsAPI(APIView):
    def get(self, request):
        company = request.user.company
        notifications = []

        # ✅ 1. Leave Requests (Pending)
        pending_leaves = LeaveRequest.objects.filter(
            employee__department__company=company,
            status="Pending"
        ).order_by('-created_at')[:10]

        for leave in pending_leaves:
            notifications.append({
                "text": f"New leave request from {leave.employee.department.name} department",
                "time": time_since(leave.created_at)
            })

        # ✅ 2. Reimbursement Requests (Pending)
        pending_reimbursements = Reimbursement.objects.filter(
            employee__department__company=company,
            status="Pending"
        ).order_by('-created_at')[:10]

        for r in pending_reimbursements:
            notifications.append({
                "text": f"New reimbursement request from {r.employee.department.name} department",
                "time": time_since(r.created_at)
            })

        # Sort all by time (latest first)
        notifications = sorted(
            notifications, 
            key=lambda x: x["time"], 
            reverse=True
        )

        return Response({"notifications": notifications[:10]})
    

from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import date

class TodayEmployeeStatsAPI(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        today = date.today()
        company = request.user.company

        # Total employees in company
        total_employees = Employee_db.objects.filter(
            department__company=company
        ).count()

        # Present today (based on Attendance table)
        present_today = Attendance.objects.filter(
            date=today,
            employee__department__company=company
        ).values("employee").distinct().count()

        # OnLeave today (Approved only)
        on_leave_today = LeaveRequest.objects.filter(
            status="approved",
            from_date__lte=today,
            to_date__gte=today,
            employee__department__company=company
        ).values("employee").distinct().count()

        # Percent calculations
        present_percentage = (
            (present_today / total_employees) * 100 if total_employees > 0 else 0
        )
        leave_percentage = (
            (on_leave_today / total_employees) * 100 if total_employees > 0 else 0
        )

        return Response({
            "total_employees": total_employees,
            "present_today_count": present_today,
            "on_leave_today_count": on_leave_today,
            "present_percentage": round(present_percentage, 2),
            "leave_percentage": round(leave_percentage, 2)
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
from holidays.models import PublicHoliday

class HolidaySummaryAPI(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        today = date.today()
        company = request.user.company

        # All holidays (company holiday + off days)
        all_holidays_qs = PublicHoliday.objects.filter(
            company=company
        ).order_by("date")

        all_holidays = [
            {
                "id": h.id,
                "date": h.date,
                "day": h.day,
                "description": h.description,
                "holiday_type": h.holiday_type,
            }
            for h in all_holidays_qs
        ]

        # Upcoming holidays excluding company off days
        upcoming_holidays_qs = PublicHoliday.objects.filter(
            company=company,
            date__gte=today
        ).exclude(
            holiday_type__in=["off_day", "weekend"]  # adjust if needed
        ).order_by("date")[:5]

        upcoming_holidays = [
            {
                "date": h.date,
                "description": h.description,
                "holiday_type": h.holiday_type,
                "days_left": (h.date - today).days
            }
            for h in upcoming_holidays_qs
        ]

        return Response({
            "upcoming_holidays": upcoming_holidays,
            "all_holidays": {
                "count": all_holidays_qs.count(),
                "list": all_holidays
            }
        })
