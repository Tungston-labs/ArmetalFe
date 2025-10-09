from rest_framework import serializers
from .models import Project
from employee.models import Employee_db

class ProjectSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(), many=True, required=False
    )
    company = serializers.StringRelatedField(read_only=True) 

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'company', 'employees']
        read_only_fields = ['company'] 

    def validate_employees(self, value):
        """Prevent duplicate employees"""
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate employees are not allowed.")
        return value
