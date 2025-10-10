from rest_framework import serializers
from .models import Project
from employee.models import Employee_db

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_db
        fields = ['id', 'name', 'employee_id', 'email', 'designation', 'department']

class ProjectSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(),
        many=True,
        required=False
    )
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'company', 'employees']
        read_only_fields = ['company']

    def update(self, instance, validated_data):
        # Extract employees if provided
        employees = validated_data.pop('employees', None)

        # Update other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle ManyToMany update separately
        if employees is not None:
            instance.employees.set(employees)

        return instance
