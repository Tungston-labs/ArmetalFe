from rest_framework import serializers
from .models import Department
from employee.models import Employee_db

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['company']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if isinstance(self.instance, Department):
            self.fields['department_head'].queryset = Employee_db.objects.filter(department=self.instance)
    
