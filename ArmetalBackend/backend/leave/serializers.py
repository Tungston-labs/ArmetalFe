from rest_framework import serializers
from .models import LeaveRequest
from employee.models import Employee_db

class EmployeeBasicSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        fields = '__all__'

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = EmployeeBasicSerializer(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ['employee']
