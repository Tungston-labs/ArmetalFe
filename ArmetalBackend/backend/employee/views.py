# employees/views.py

from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin,IsEmployee
from .models import Employee_db,TempUpload
from .serializers import EmployeeSerializer,EmpDocumentSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from shared.pagination import CustomPagination
from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
# BASIC DETAILS




class EmployeeListCreateView(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name_search', 'employee_id']
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        company = user.company

        if not company:
            print(f"❌ No valid company found for user: {user.username}")
            return Employee_db.objects.none()

        department_id = self.request.query_params.get('department_id')  # <-- new
        queryset = Employee_db.objects.filter(department__company=company)

        if department_id:
            queryset = queryset.filter(department_id=department_id)

        print(f"✅ Returning employees for company: {company.name}, department_id: {department_id}")
        return queryset.order_by('name')




    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        company = employee.department.company
        company.number_of_employees = (company.number_of_employees or 0) + 1
        company.save()

        # ⚠️ Assuming employee.email and employee.password are available
        try:
            send_mail(
                subject=f"Welcome to {company.name}",
                message=f"""
    Hello {employee.name},

    You have been successfully registered as an employee at {company.name}.

    Your login credentials are:
    Username: {employee.employee_id}
    Password: {employee.password}

    Please log in and change your password as soon as possible.

    Regards,
    {company.name} HR
    """,
                from_email=company.email,
                recipient_list=[employee.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"❌ Failed to send email to {employee.email}: {str(e)}")

        return Response({
            "message": "Employee created successfully.",
            "employee": EmployeeSerializer(employee).data,
            "login_credentials": {
                "username": employee.employee_id,
                "password": employee.password
            }
        }, status=status.HTTP_201_CREATED)


# list employees without pagination


class EmployeeListView(generics.ListAPIView):
    """
    List all employees of the user's company, optionally filtered by department.
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']
    pagination_class = None  # Return full list without pagination

    def get_queryset(self):
        user = self.request.user
        company = getattr(user, 'company', None)

        if not company:
            print(f"❌ No valid company found for user: {user.username}")
            return Employee_db.objects.none()

        department_id = self.request.query_params.get('department_id')
        queryset = Employee_db.objects.filter(department__company=company)

        if department_id:
            queryset = queryset.filter(department_id=department_id)

        print(f"✅ Returning employees for company: {company.name}, department_id: {department_id}")
        return queryset.order_by('name')


class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee_db.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        department = instance.department
        company = department.company if department else None

        # Delete related user first (if exists)
        if instance.user:
            instance.user.delete()

        # Delete the employee (this will trigger signal)
        instance.delete()

        # ✅ Update company employee count
        if company:
            company.number_of_employees = max((company.number_of_employees or 1) - 1, 0)
            company.save(update_fields=["number_of_employees"])


# BANK DETAILS

from rest_framework import generics, permissions
from .models import EmpBankPaymentModel, Employee_db
from .serializers import EmpBankPaymentSerializer
from user.permissions import IsHRAdmin
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from rest_framework import serializers

class EmpBankPaymentCreateListView(generics.ListCreateAPIView):
    serializer_class = EmpBankPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        employee_id = self.kwargs.get('employee_id')
        return EmpBankPaymentModel.objects.filter(employee__id=employee_id)

    def perform_create(self, serializer):  # ✅ Move this method **inside** the class
        employee_id = self.kwargs.get('employee_id')
        employee = get_object_or_404(Employee_db, id=employee_id)

        if EmpBankPaymentModel.objects.filter(employee=employee).exists():
            raise serializers.ValidationError("Bank payment record already exists for this employee.")

        serializer.save(employee=employee)


class EmpBankPaymentEmployeeScopedDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmpBankPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]
    parser_classes = [MultiPartParser, FormParser]
    def get_queryset(self):
        employee_id = self.kwargs.get('employee_id')
        return EmpBankPaymentModel.objects.filter(employee_id=employee_id)


from datetime import timedelta
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Employee_db
from .serializers import EmployeeSerializer

from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 7
    page_size_query_param = 'page_size'
    max_page_size = 100


class UpcomingExpiryEmployeeListView(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination 

    def get_queryset(self):
        user = self.request.user
        company = getattr(user, "company", None)
        if not company:
            return Employee_db.objects.none()  # no company assigned

        expiry_type = self.request.query_params.get("type")  # 'visa' or 'contract'
        today = timezone.now().date()
        one_month_later = today + timedelta(days=30)

        queryset = Employee_db.objects.filter(department__company=company)  # filter by company

        if expiry_type == "visa":
            queryset = queryset.filter(
                visa_expiry_date__gte=today,
                visa_expiry_date__lte=one_month_later
            )
        elif expiry_type == "contract":
            queryset = queryset.filter(
                contract_expiry_date__gte=today,
                contract_expiry_date__lte=one_month_later
            )
        else:
            queryset = Employee_db.objects.none()

        return queryset.order_by(
            "visa_expiry_date" if expiry_type == "visa" else "contract_expiry_date"
        )



# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage

from .models import EmpDocument, Employee_db
from .serializers import EmpDocumentSerializer,TempUploadSerializer



class UploadImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = TempUploadSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            file_url = request.build_absolute_uri(instance.file.url)
            return Response({'url': file_url}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UploadImageDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]

    def get_object(self, pk):
        return get_object_or_404(TempUpload, pk=pk)

    def get(self, request, pk):
        instance = self.get_object(pk)
        serializer = TempUploadSerializer(instance)
        return Response(serializer.data)

    def put(self, request, pk):
        instance = self.get_object(pk)
        serializer = TempUploadSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = self.get_object(pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from .models import Employee_db, EmpDocument
from .serializers import EmpDocumentSerializer

class EmployeeDocumentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser,JSONParser)

    def get(self, request, employee_id):
        employee = get_object_or_404(Employee_db, id=employee_id)
        emp_doc, created = EmpDocument.objects.get_or_create(employee=employee)
        serializer = EmpDocumentSerializer(emp_doc)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, employee_id):
        employee = get_object_or_404(Employee_db, id=employee_id)

        try:
            emp_doc = EmpDocument.objects.get(employee=employee)
            serializer = EmpDocumentSerializer(emp_doc, data=request.data, partial=True)
        except EmpDocument.DoesNotExist:
            serializer = EmpDocumentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(employee=employee)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, employee_id):  # ✅ Inside class now
        employee = get_object_or_404(Employee_db, id=employee_id)

        try:
            emp_doc = EmpDocument.objects.get(employee=employee)
        except EmpDocument.DoesNotExist:
            return Response({"detail": "Document not found for PATCH."}, status=status.HTTP_404_NOT_FOUND)


        # ✅ DEBUG: Print incoming files and data
        print("FILES:", request.FILES)
        print("DATA:", request.data)
        data = request.data.copy()
        for key in request.FILES:
            data.setlist(key, request.FILES.getlist(key))

        for field in request.FILES:
            old_file = getattr(emp_doc, field, None)
            if old_file and default_storage.exists(str(old_file)):
                default_storage.delete(str(old_file))

        serializer = EmpDocumentSerializer(emp_doc, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics, permissions
from .models import EmpDocument
from .serializers import EmpDocumentSerializer

class EmpDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmpDocument.objects.all()
    serializer_class = EmpDocumentSerializer
    permission_classes = [permissions.IsAuthenticated,IsHRAdmin]
    lookup_field = 'employee_id' 




# employee dashboard in web application

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Employee_db
from .serializers import EmployeeDashboardSerializer

class EmployeeDashboardAPIView(APIView):
    permission_classes = [IsHRAdmin]

    def get(self, request, id):
        try:
            employee = Employee_db.objects.get(id=id)
        except Employee_db.DoesNotExist:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmployeeDashboardSerializer(employee)
        return Response(serializer.data)




#--------------------------------- VIEW FOR EMPLOYEE--------------------------------



# list employees of same department



 

class EmployeesInMyDepartmentView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get(self, request):
        try:
            employee = Employee_db.objects.get(user=request.user)
            department = employee.department
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee profile not found."}, status=404)
        except AttributeError:
            return Response({"detail": "No department assigned."}, status=400)

        employees = Employee_db.objects.filter(department=department)
        count = employees.count()
        serializer = EmployeeSerializer(employees, many=True)

        # Get department head info
        head = department.department_head  # Assuming ForeignKey to Employee_db
        head_info = {
            "name": head.name if head else None,
            "profile_pic": head.profile_pic.url if head and head.profile_pic else None,
        }

        return Response({
            "department": department.name,
            "head": head_info,
            "count":count,
            "members": serializer.data

        })


class EmployeeSelfView(APIView):
    permission_classes = [IsAuthenticated,IsEmployee]

    def get(self, request):
        if not hasattr(request.user, 'employee_db'):
            return Response({'error': 'Employee profile not found.'}, status=404)
        employee = request.user.employee_db
        return Response(EmployeeSerializer(employee).data)

# for dashboard details 

from datetime import date, timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from attendance.models import Attendance
from holidays.models import PublicHoliday
from employee.models import Employee_db
from departments.models import Department
from leave.models import LeaveRequest


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        today = date.today()
        upcoming_range = today + timedelta(days=30)
        company = request.user.company  # HR admin's company

        # 1. Total employees list with department name
        employees = Employee_db.objects.filter(department__company=company)
        employee_list = [
            {
                "id": emp.id,
                "name": emp.name,
                "department": emp.department.name if emp.department else None,
                "designation": emp.designation,
                "employee_id":emp.employee_id,
                "profile_pic": request.build_absolute_uri(emp.profile_pic.url) if emp.profile_pic else None,
            }
            for emp in employees
        ]
        total_employees_count = employees.count()

        # 2. Upcoming visa expiries
        upcoming_visa_expiry_qs = employees.filter(
            visa_expiry_date__range=[today, upcoming_range]
        )
        upcoming_visa_expiry = [
            {
                "id": emp.id,
                "name": emp.name,
                "department": emp.department.name if emp.department else None,
                "visa_expiry_date": emp.visa_expiry_date,
                "profile_pic": request.build_absolute_uri(emp.profile_pic.url) if emp.profile_pic else None,
            }
            for emp in upcoming_visa_expiry_qs
        ]

        # 3. Pending leave requests
        pending_leaves_qs = LeaveRequest.objects.filter(
            status="pending",
            employee__department__company=company
        )
        pending_leaves = [
            {
                "id": leave.id,
                "employee": leave.employee.name,
                "department": leave.employee.department.name if leave.employee.department else None,
                "profile_pic": request.build_absolute_uri(leave.employee.profile_pic.url) if leave.employee.profile_pic else None,          "leave_type": leave.leave_type,
                "from_date": leave.from_date,
                "to_date": leave.to_date,
                "reason": leave.reason,
            }
            for leave in pending_leaves_qs
        ]

        # 4. Department list with employee count
        department_list = [
    {
        "id": dept.id,
        "name": dept.name,
        "employee_count": dept.employees.count(),
        "head": {
            "id": dept.department_head.id,
            "name": dept.department_head.name
        } if dept.department_head else None
    }
    for dept in Department.objects.filter(company=company)
]


        # 5. Upcoming holidays
        upcoming_holidays_qs = PublicHoliday.objects.filter(
            company=company,
            date__gte=today
        ).order_by("date")[:10]  # next 10 holidays
        upcoming_holidays = [
            {
                "date": holiday.date,
                "description": holiday.description,
                "holiday_type": holiday.holiday_type,
            }
            for holiday in upcoming_holidays_qs
        ]

        # 6. Upcoming contract expiries
        upcoming_contract_expiry_qs = employees.filter(
            contract_expiry_date__range=[today, upcoming_range]
        )
        upcoming_contract_expiry = [
            {
                "id": emp.id,
                "name": emp.name,
                "department": emp.department.name if emp.department else None,
                "contract_expiry_date": emp.contract_expiry_date,
                "employee_id":emp.employee_id,
                "profile_pic": request.build_absolute_uri(emp.profile_pic.url) if emp.profile_pic else None,
            }
            for emp in upcoming_contract_expiry_qs
        ]

        # 7. Active employees today
        active_today_count = Attendance.objects.filter(
            date=today,
            employee__department__company=company
        ).count()

        # 8. On leave today
        on_leave_today_count = LeaveRequest.objects.filter(
                from_date__lte=today,
                to_date__gte=today,
                employee__department__company=company,
                status='approved'
            ).values('employee').distinct().count()


        return Response({
            "total_employees": {
                "count": total_employees_count,
                "list": employee_list
            },
            "upcoming_visa_expiry": {
                "count": upcoming_visa_expiry_qs.count(),
                "list": upcoming_visa_expiry
            },
            "pending_leaves": {
                "count": pending_leaves_qs.count(),
                "list": pending_leaves
            },
            "departments": department_list,
            "upcoming_holidays": upcoming_holidays,
            "upcoming_contract_expiry": {
                "count": upcoming_contract_expiry_qs.count(),
                "list": upcoming_contract_expiry
            },
            "active_today_count": active_today_count,
            "on_leave_today_count": on_leave_today_count
        })




# for mobile app



# employee/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Employee_db
from .serializers import EmployeeProfileSerializer
from user.permissions import IsEmployee

class EmployeeProfileView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get(self, request):
        try:
            employee = Employee_db.objects.get(user=request.user)
            serializer = EmployeeProfileSerializer(employee, context={"request": request})
            return Response(serializer.data)
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee profile not found."}, status=404)

        

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from .serializers import EmployeeDocumentSummarySerializer
from rest_framework import status

class EmployeeDocumentSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            employee = Employee_db.objects.get(user=request.user)
            serializer = EmployeeDocumentSummarySerializer(employee, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employee_db.DoesNotExist:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# mobile app home page with attendance details-------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.utils import timezone
from django.db.models import Sum
from calendar import monthrange
from datetime import timedelta, date, datetime

from attendance.models import Attendance
from holidays.models import PublicHoliday
from employee.models import Employee_db


class AttendanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            employee = Employee_db.objects.get(user=user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get ?month=YYYY-MM from query params
        month_param = request.query_params.get("month")
        try:
            if month_param:
                year, month = map(int, month_param.split("-"))
                from_date = date(year, month, 1)
            else:
                from_date = timezone.now().date().replace(day=1)
            last_day = monthrange(from_date.year, from_date.month)[1]
            to_date = from_date.replace(day=last_day)
        except ValueError:
            return Response({"error": "Invalid month format. Use YYYY-MM."}, status=status.HTTP_400_BAD_REQUEST)

        # List of all dates in month
        total_dates = [from_date + timedelta(days=i) for i in range((to_date - from_date).days + 1)]

        # Mon–Fri only
        working_days = [d for d in total_dates if d.weekday() < 5]

        # Holidays
        holidays = PublicHoliday.objects.filter(
            company=employee.department.company,
            date__range=(from_date, to_date)
        ).values_list("date", flat=True)

        actual_working_days = [d for d in working_days if d not in holidays]

        # Attendance
        attendances = Attendance.objects.filter(employee=employee, date__range=(from_date, to_date))

        present_days = 0
        half_days = 0
        total_hours = 0.0
        attended_dates = set()

        for att in attendances:
            if att.date:
                attended_dates.add(att.date)

            if att.total_hours is None:
                continue

            total_hours += float(att.total_hours)

            if att.total_hours >= 8:
                present_days += 1
            elif att.total_hours < 5:
                half_days += 1

        absent_days = [d for d in actual_working_days if d not in attended_dates]
        today = timezone.now().date()
        remaining_days = [d for d in actual_working_days if d > today]

        return Response({
            "month": from_date.strftime("%B %Y"),
            "present_days": present_days,
            "half_days": half_days,
            "absent_days": len(absent_days),
            "holiday_days": len(holidays),
            "working_days": len(actual_working_days),
            "remaining_working_days": len(remaining_days),
            "total_hours": round(total_hours, 2)
        })
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import ScheduleReminder
from .serializers import ScheduleReminderSerializer
from .tasks import send_reminder
from django.utils.timezone import now as timezone_now
from employee.utils import send_push_notification

class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        employee = user.employee_db
        date_str = self.request.query_params.get("date")
        qs = ScheduleReminder.objects.filter(employee=employee, is_expired=False)
        if date_str:
            qs = qs.filter(scheduled_datetime__date=date_str)
        return qs

    
    def perform_create(self, serializer):
        employee = self.request.user.employee_db
        # Just save reminder with employee automatically
        reminder = serializer.save(employee=employee)
        return reminder






class ReminderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScheduleReminder.objects.all()
    serializer_class = ScheduleReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # restrict to logged-in user's reminders
        user = self.request.user
        employee = user.employee_db
        return ScheduleReminder.objects.filter(employee=employee)





from datetime import date, timedelta
import calendar
from django.db.models import Sum
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from attendance.models import Attendance
from holidays.models import PublicHoliday 
from employee.models import Employee_db


class EmployeeMonthlySummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get employee from the logged-in user
            employee = request.user.employee_db  
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)

        today = timezone.now().date()
        year = today.year
        month = today.month

        # First and last day of the month
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # All days in month
        all_days = [first_day + timedelta(days=i) for i in range((last_day - first_day).days + 1)]

        # Sundays
        sundays = [d for d in all_days if d.weekday() == 6]

        # Company holidays for this month
        holidays = PublicHoliday.objects.filter(
            company=employee.department.company,
            date__range=(first_day, last_day)
        ).values_list("date", flat=True)

        # Working days = all days - Sundays - Holidays
        working_days = [d for d in all_days if d not in sundays and d not in holidays]

        # Attendance records for this month
        attendances = Attendance.objects.filter(
            employee=employee,
            date__range=(first_day, last_day)
        )

        # Total working hours
        total_hours = attendances.aggregate(total=Sum("total_hours"))["total"] or 0

        # Half days (4 <= hours < 7)
        half_days = attendances.filter(total_hours__gte=2, total_hours__lt=6).values_list("date", flat=True)

        # Present days (hours >= 7)
        present_days = attendances.filter(total_hours__gte=6).values_list("date", flat=True)

        # Absent days only until today (exclude present and half days)
        absent_days = [d for d in working_days if d <= today and d not in present_days and d not in half_days]


        # Remaining working days
        remaining_working_days = [d for d in working_days if d > today]


        data = {
            "month": today.strftime("%B"),
            "total_working_days": len(working_days),
            "total_working_days_dates": working_days,
            "total_working_hours": float(total_hours),
            "half_days_count": len(half_days),
            "half_days_dates": list(half_days),
            "present_days_count": len(present_days),
            "present_days_dates": list(present_days),
            "absent_days_count": len(absent_days),
            "absent_days_dates": absent_days,
            "remaining_working_days_count": len(remaining_working_days),
            "remaining_working_days_dates": remaining_working_days,
            "holidays_count": len(holidays),
            "holidays_dates": list(holidays)
        }

        return Response(data)
