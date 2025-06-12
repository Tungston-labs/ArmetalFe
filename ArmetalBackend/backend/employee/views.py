# employees/views.py

from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin,IsEmployee
from .models import Employee_db
from .serializers import EmployeeSerializer,EmpDocumentSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

# 1. List and Create
class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee_db.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']  # optional

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        return Response({
            "message": "Employee created successfully.",
            "employee": EmployeeSerializer(employee).data,
            "login_credentials": {
                "username": employee.employee_id,
                "password": employee.password  # ⚠️ show only once if needed
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
    lookup_field = 'id' 


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import TempUpload
from .serializers import TempUploadSerializer

class UploadImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # or AllowAny for testing

    def post(self, request, *args, **kwargs):
        serializer = TempUploadSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            file_url = request.build_absolute_uri(instance.file.url)
            return Response({'url': file_url}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class EmpDocumentCreateFromURLView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, employee_id):
        employee = get_object_or_404(Employee_db, id=employee_id)

        serializer = EmpDocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=employee)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)













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








