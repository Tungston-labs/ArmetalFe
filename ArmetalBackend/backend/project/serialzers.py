from rest_framework import serializers
from .models import Project
from employee.models import Employee_db

class ProjectSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(
        queryset=Employee_db.objects.all(), many=True, required=False
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'punch_type', 'latitude', 'longitude', 'employees']

    def validate_employees(self, value):
        """Prevent duplicate employees"""
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate employees are not allowed.")
        return value
