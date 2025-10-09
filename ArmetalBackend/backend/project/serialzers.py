from rest_framework import serializers
from .models import Project
from employee.models import Employee_db

from rest_framework import serializers
from .models import Project
from employee.models import Employee_db

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_db
        fields = ['id', 'name', 'employee_id', 'email', 'position', 'department']

class ProjectSerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True, read_only=True)  # nested full details
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'company', 'employees']
        read_only_fields = ['company']
