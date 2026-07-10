from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from django.utils import timezone
from django.db.models import Q, Sum, Count
from django.db.models.functions import TruncMonth

from employee.models import Employee_db
from leave.models import LeaveRequest
from attendance.models import Attendance
from reimbursement.models import Reimbursement
from departments.models import Department
from holidays.models import PublicHoliday
from project.models import Project
from user.permissions import IsHRAdmin

from .serializers import ContractExpirySerializer


# --------------------------------------------------------------------
# GENERIC ERROR HANDLER
# --------------------------------------------------------------------
def error(message, code=status.HTTP_400_BAD_REQUEST):
    return Response({"error": message}, status=code)


# --------------------------------------------------------------------
# 1. DASHBOARD COUNTS
# --------------------------------------------------------------------
class DashboardCountsView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            today = date.today()
            upcoming_range = today + timedelta(days=30)
            company = request.user.company

            if not company:
                return error("Company not assigned to user", status.HTTP_404_NOT_FOUND)

            employees_qs = Employee_db.objects.filter(department__company=company,is_deleted=False)

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

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 2. REIMBURSEMENT COUNTS
# --------------------------------------------------------------------
class ReimbursementCountsView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company
            if not company:
                return error("Company not assigned", status.HTTP_404_NOT_FOUND)

            qs = Reimbursement.objects.filter(
                employee__department__company=company
            )

            data = {
                "total_requests": qs.count(),
                "pending_count": qs.filter(status="On Hold").count(),
                "verified_count": qs.filter(status="Approve").count(),
                "rejected_count": qs.filter(status="Reject").count(),
            }

            return Response(data)

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 3. REIMBURSEMENT MONTH-WISE AMOUNT
# --------------------------------------------------------------------
class ReimbursementMonthWiseAmountView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company
            if not company:
                return error("Company not assigned", status.HTTP_404_NOT_FOUND)

            qs = (
                Reimbursement.objects.filter(
                    employee__department__company=company,
                    status="Approve"
                )
                .annotate(month=TruncMonth("created_at"))
                .values("month")
                .annotate(total_amount=Sum("amount"))
                .order_by("month")
            )

            data = {
                item["month"].strftime("%Y-%m"): float(item["total_amount"] or 0)
                for item in qs
            }

            return Response(data)

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 4. DEPARTMENT SUMMARY
# --------------------------------------------------------------------
class DepartmentDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company
            if not company:
                return error("Company not assigned", status.HTTP_404_NOT_FOUND)

            total_departments = Department.objects.filter(company=company).count()

            recent_qs = Department.objects.filter(company=company).order_by("-created_at")[:4]

            recent_departments = [
                {
                    "id": d.id,
                    "name": d.name,
                    "created_at": d.created_at.date()
                }
                for d in recent_qs
            ]

            return Response({
                "total_departments": total_departments,
                "recent_departments": recent_departments
            })

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 5. RECENT EMPLOYEES
# --------------------------------------------------------------------
class RecentEmployeesView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company
            if not company:
                return error("Company not assigned", status.HTTP_404_NOT_FOUND)

            qs = Employee_db.objects.filter(
                department__company=company,is_deleted=False
            ).order_by("-created_at")[:5]

            employees = [
                {
                    "id": e.id,
                    "name": e.name,
                    "employee_id": e.employee_id,
                    "department": e.department.name if e.department else None,
                    "profile_pic": request.build_absolute_uri(e.profile_pic.url)
                    if e.profile_pic else None,
                    "added_date": e.created_at.date(),
                }
                for e in qs
            ]

            return Response({"recent_employees": employees})

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 6. CONTRACT EXPIRY WITHIN 30 DAYS
# --------------------------------------------------------------------


class ContractExpiry30DaysView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        company = getattr(request.user, "company", None)

        if not company:
            return Response(
                {"error": "Company not associated with user"},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = timezone.now().date()
        next_30 = today + timedelta(days=30)

        qs = Employee_db.objects.filter(is_deleted=False,
            contract_expiry_date__isnull=False,
            contract_expiry_date__range=(today, next_30),
            department__company=company   
        ).order_by("contract_expiry_date")

        serializer = ContractExpirySerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --------------------------------------------------------------------
# 7. NOTIFICATIONS
# --------------------------------------------------------------------
def time_since(dt):
    now = timezone.now()
    diff = now - dt

    if diff.days == 0:
        sec = diff.seconds
        if sec < 60:
            return "just now"
        if sec < 3600:
            return f"{sec // 60} minutes ago"
        return f"{sec // 3600} hours ago"

    if diff.days == 1:
        return "1 day ago"

    return f"{diff.days} days ago"


class SimpleNotificationsAPI(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company
            if not company:
                return error("Company not assigned", status.HTTP_404_NOT_FOUND)

            notifications = []

            # Leave Requests
            leaves = LeaveRequest.objects.filter(
                employee__department__company=company,
                status="pending"
            ).order_by("-created_at")[:10]

            for l in leaves:
                notifications.append({
                    "text": f"New leave request from {l.employee.department.name}",
                    "time": time_since(l.created_at)
                })

            # Reimbursements
            reimb = Reimbursement.objects.filter(
                employee__department__company=company,
                status="On Hold"
            ).order_by("-created_at")[:10]

            for r in reimb:
                notifications.append({
                    "text": f"New reimbursement request from {r.employee.department.name}",
                    "time": time_since(r.created_at)
                })

            return Response({"notifications": notifications[:10]})

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 8. TODAY EMPLOYEE STATS
# --------------------------------------------------------------------
class TodayEmployeeStatsAPI(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            today = date.today()
            company = request.user.company

            employees = Employee_db.objects.filter(department__company=company,is_deleted=False)
            total = employees.count()

            present = Attendance.objects.filter(
                date=today,
                employee__department__company=company
            ).values("employee").distinct().count()

            on_leave = LeaveRequest.objects.filter(
                status="approved",
                from_date__lte=today,
                to_date__gte=today,
                employee__department__company=company
            ).values("employee").distinct().count()

            return Response({
                "total_employees": total,
                "present_today_count": present,
                "on_leave_today_count": on_leave,
                "present_percentage": round((present / total) * 100, 2) if total else 0,
                "leave_percentage": round((on_leave / total) * 100, 2) if total else 0,
            })

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 9. HOLIDAY SUMMARY
# --------------------------------------------------------------------
class HolidaySummaryAPI(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            today = date.today()
            company = request.user.company

            holidays = PublicHoliday.objects.filter(company=company).order_by("date")

            holiday_data = [
                {
                    "id": h.id,
                    "date": h.date,
                    "day": h.day,
                    "description": h.description,
                    "holiday_type": h.holiday_type,
                }
                for h in holidays
            ]

            upcoming = PublicHoliday.objects.filter(
                company=company,
                date__gte=today
            ).exclude(
                holiday_type__in=["off_day", "weekend"]
            ).order_by("date")[:5]

            upcoming_data = [
                {
                    "date": h.date,
                    "description": h.description,
                    "holiday_type": h.holiday_type,
                    "days_left": (h.date - today).days
                }
                for h in upcoming
            ]

            return Response({
                "upcoming_holidays": upcoming_data,
                "all_holidays": {
                    "count": holidays.count(),
                    "list": holiday_data
                }
            })

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------------------------------------------------
# 10. PROJECT EMPLOYEE COUNT (ON-SITE / VARIANT / BENCH)
# --------------------------------------------------------------------
class ProjectEmployeeCountView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        try:
            company = request.user.company

            projects = Project.objects.filter(company=company)

            counts = {
                "on_site": projects.filter(punch_type="on_site")
                    .aggregate(count=Count("employees", distinct=True))["count"] or 0,

                "variant": projects.filter(punch_type="variant")
                    .aggregate(count=Count("employees", distinct=True))["count"] or 0,

                "bench": projects.filter(punch_type="bench")
                    .aggregate(count=Count("employees", distinct=True))["count"] or 0
            }

            counts["total"] = counts["on_site"] + counts["variant"] + counts["bench"]

            return Response(counts)

        except Exception as e:
            return error(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
