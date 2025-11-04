from rest_framework import serializers
from .models import LeaveRequest
from employee.models import Employee_db

class EmployeeBasicSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        fields = '__all__'

# class LeaveRequestSerializer(serializers.ModelSerializer):
#     employee = EmployeeBasicSerializer(read_only=True)
#     department_id = serializers.SerializerMethodField()

#     class Meta:
#         model = LeaveRequest
#         fields = '__all__'  # keep everything
#         read_only_fields = ['employee']

#     def get_department_id(self, obj):
#         return obj.employee.department.id if obj.employee and obj.employee.department else None

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = EmployeeBasicSerializer(read_only=True)
    department_id = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = '__all__'  # include new fields
        read_only_fields = ['employee']

    def get_department_id(self, obj):
        return obj.employee.department.id if obj.employee and obj.employee.department else None
