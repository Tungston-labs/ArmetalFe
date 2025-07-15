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
    search_fields = ['name', 'employee_id']
    pagination_class = CustomPagination

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
    # def patch(self, request, employee_id):
    #     employee = get_object_or_404(Employee_db, id=employee_id)

    #     try:
    #         emp_doc = EmpDocument.objects.get(employee=employee)
    #     except EmpDocument.DoesNotExist:
    #         return Response({"detail": "Document not found for PATCH."}, status=status.HTTP_404_NOT_FOUND)

    #     # Combine form data and files
    #     data = request.data.copy()
    #     for key in request.FILES:
    #         data.setlist(key, request.FILES.getlist(key))

    #     serializer = EmpDocumentSerializer(emp_doc, data=data, partial=True)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class EmployeeDocumentsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     parser_classes = (MultiPartParser, FormParser)

   
    # def patch(self, request, employee_id):
    #     employee = get_object_or_404(Employee_db, id=employee_id)

    #     try:
    #         emp_doc = EmpDocument.objects.get(employee=employee)
    #     except EmpDocument.DoesNotExist:
    #         return Response({"detail": "Document not found for PATCH."}, status=status.HTTP_404_NOT_FOUND)

    #     # Merge request.data and request.FILES
    #     data = request.data.copy()
    #     for key in request.FILES:
    #         data.setlist(key, request.FILES.getlist(key))

    #     # Prepare to delete old files if new ones are replacing them
    #     for field in request.FILES:
    #         old_file = getattr(emp_doc, field, None)
    #         if old_file and default_storage.exists(old_file):  # ✅ FIXED: removed .name
    #             default_storage.delete(old_file)

    #     serializer = EmpDocumentSerializer(emp_doc, data=data, partial=True)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class EmpDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = EmpDocument.objects.all()
#     serializer_class = EmpDocumentSerializer
#     permission_classes = [permissions.IsAuthenticated,IsHRAdmin]


from rest_framework import generics, permissions
from .models import EmpDocument
from .serializers import EmpDocumentSerializer

class EmpDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmpDocument.objects.all()
    serializer_class = EmpDocumentSerializer
    permission_classes = [permissions.IsAuthenticated,IsHRAdmin]
    lookup_field = 'employee_id' 

# class EmployeeDocumentListView(generics.ListAPIView):
#     serializer_class = EmpDocumentSerializer
#     permission_classes = [permissions.IsAuthenticated, IsHRAdmin]

#     def get_queryset(self):
#         employee_id = self.kwargs['employee_id']
#         return EmpDocument.objects.filter(employee_id=employee_id)





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
            serializer = EmployeeProfileSerializer(employee)
            return Response(serializer.data)
        except Employee_db.DoesNotExist:
            return Response({"detail": "Employee profile not found."}, status=404)
        

# views.py
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
            serializer = EmployeeDocumentSummarySerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employee_db.DoesNotExist:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

