# employees/views.py

from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin,IsEmployee
from .models import Employee_db
from .serializers import EmployeeSerializer,EmpDocumentSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from shared.pagination import PageNumberPagination

# 1. List and Create




class EmployeeListCreateView(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        company = user.company
        if not company:
            print(f"❌ No valid company found for user: {user.username}")
            return Employee_db.objects.none()
        
        print(f"✅ Returning employees for company: {company.name}")
        return Employee_db.objects.filter(department__company=company).order_by('name')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        company = employee.department.company
        company.number_of_employees = (company.number_of_employees or 0) + 1
        company.save()

        return Response({
            "message": "Employee created successfully.",
            "employee": EmployeeSerializer(employee).data,
            "login_credentials": {
                "username": employee.employee_id,
                "password": employee.password  # ⚠️ Only show once
            }
        }, status=status.HTTP_201_CREATED)


# 2. Retrieve, Update, Delete
class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee_db.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        # delete the associated user too
        if instance.user:
            instance.user.delete()
        instance.delete()



# views.py
from rest_framework import generics, permissions
from .models import EmpBankPaymentModel, Employee_db
from .serializers import EmpBankPaymentSerializer
from user.permissions import IsHRAdmin
from rest_framework.exceptions import NotFound

class EmpBankPaymentCreateListView(generics.ListCreateAPIView):
    serializer_class = EmpBankPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]

    def get_queryset(self):
        return EmpBankPaymentModel.objects.all()

    def perform_create(self, serializer):
        employee_id = self.kwargs.get('employee_id')
        try:
            employee = Employee_db.objects.get(id=employee_id)
        except Employee_db.DoesNotExist:
            raise NotFound('Employee not found.')

        serializer.save(employee=employee)

class EmpBankPaymentRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmpBankPaymentModel.objects.all()
    serializer_class = EmpBankPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHRAdmin]
    lookup_field = 'employee_id' 


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import TempUpload
from .serializers import TempUploadSerializer

class UploadImageView(APIView):
    permission_classes = [permissions.IsAuthenticated,IsHRAdmin]  # or AllowAny for testing

    def post(self, request, *args, **kwargs):
        serializer = TempUploadSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            file_url = request.build_absolute_uri(instance.file.url)
            return Response({'url': file_url}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UploadImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TempUpload.objects.all()
    serializer_class = TempUploadSerializer
    permission_classes = [permissions.IsAuthenticated,IsHRAdmin]
    lookup_field = 'employee_id' 


class EmpDocumentCreateFromURLView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, employee_id):
        employee = get_object_or_404(Employee_db, id=employee_id)

        serializer = EmpDocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=employee)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from rest_framework import generics, permissions
from .models import EmpDocument
from .serializers import EmpDocumentSerializer

class EmpDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmpDocument.objects.all()
    serializer_class = EmpDocumentSerializer
    permission_classes = [permissions.IsAuthenticated,IsHRAdmin]
    lookup_field = 'employee_id' 










#--------------------------------- VIEW FOR EMPLOYEE--------------------------------



# list employees of same department



 

class EmployeesInMyDepartmentView(APIView):
    permission_classes = [IsAuthenticated,IsEmployee]

    def get(self, request):
        try:
            employee = Employee_db.objects.get(user=request.user)
            department = employee.department
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee profile not found."}, status=404)
        except AttributeError:
            return Response({"detail": "No department assigned."}, status=400)

        employees = Employee_db.objects.filter(department=department)
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    

class EmployeeSelfView(APIView):
    permission_classes = [IsAuthenticated,IsEmployee]

    def get(self, request):
        if not hasattr(request.user, 'employee_db'):
            return Response({'error': 'Employee profile not found.'}, status=404)
        employee = request.user.employee_db
        return Response(EmployeeSerializer(employee).data)

# for dashboard details 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from attendance.models import Attendance
from leave.models import LeaveRequest
from datetime import date, timedelta

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get(self, request):
        today = date.today()
        upcoming_range = today + timedelta(days=30)
        company = request.user.company  # assuming the logged-in user is linked to a company

        # Fixing all queries using department__company
        total_employees = Employee_db.objects.filter(department__company=company).count()

        today_attendance = Attendance.objects.filter(
            date=today,
            employee__department__company=company
        ).count()

        today_leave = LeaveRequest.objects.filter(
            from_date__lte=today,
            to_date__gte=today,
            employee__department__company=company
        ).count()

        visa_expiring_soon = Employee_db.objects.filter(
            department__company=company,
            visa_expiry_date__range=[today, upcoming_range]
        ).count()

        return Response({
            "total_employees": total_employees,
            "today_attendance": today_attendance,
            "today_leave": today_leave,
            "visa_expiring_soon": visa_expiring_soon
        })







