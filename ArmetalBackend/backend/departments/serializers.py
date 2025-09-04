from rest_framework import serializers
from .models import Department
from employee.models import Employee_db
from employee.serializers import EmployeeSerializer
class DepartmentSerializer(serializers.ModelSerializer):
    department_head = EmployeeSerializer(read_only=True)
    department_head_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(),
        source='department_head',
        write_only=True,
        required=False
    )
    employee_count = serializers.IntegerField(read_only=True)
    reimbursement_employee_count = serializers.IntegerField(read_only=True)  # 👈 new

    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['company']

