from rest_framework import serializers
from .models import ScheduleReminder

from datetime import datetime
from .models import (
    Employee_db, EmpBankPaymentModel, EmpDocument, TempUpload
)
from departments.models import Department

# Custom field to handle datetime-to-date safely
class SafeDateField(serializers.DateField):
    def to_representation(self, value):
        if isinstance(value, datetime):
            return value.date().isoformat()
        return super().to_representation(value)



class EmployeeSerializer(serializers.ModelSerializer):
    dob = SafeDateField(required=False)
    joining_date = SafeDateField(required=False)
    visa_expiry_date = SafeDateField(required=False)
  
 

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

class EmpBankPaymentSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    class Meta:
        model = EmpBankPaymentModel
        fields = '__all__'
        read_only_fields = ['employee']



class TempUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempUpload
        fields = ['id', 'file']

class EmpDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpDocument
        fields = [
            "employee",
            'passport_image1_url',
            'passport_image2_url',
            'insurance_image_url',
            'work_permit_urls',
            'contract_urls',
            'certificate_urls'
        ]
        read_only_fields = ['employee']


# for mobile app




class DepartmentForProfileSerializer(serializers.ModelSerializer):
    head = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['name', 'head']

    def get_head(self, obj):
        return obj.department_head.name if obj.department_head else None


from rest_framework import serializers
from .models import Employee_db


class EmployeeProfileSerializer(serializers.ModelSerializer):
    department = DepartmentForProfileSerializer()

    class Meta:
        model = Employee_db
        exclude = ['password']



from rest_framework import serializers
from employee.models import Employee_db, EmpDocument
from rest_framework import serializers
from .models import Employee_db

class EmployeeDocumentSummarySerializer(serializers.ModelSerializer):
    healthcard_number = serializers.CharField(source='insurance_number')
    work_permit_urls = serializers.SerializerMethodField()
    contract_urls = serializers.SerializerMethodField()
    passport_number = serializers.CharField()
    iqama_number = serializers.CharField()
    visa_expiry_date = serializers.DateField()
    insurance_image_url = serializers.SerializerMethodField()
    employee_id = serializers.IntegerField(source='id')

    class Meta:
        model = Employee_db
        fields = [
            'employee_id',
            'name',
            'healthcard_number',
            'passport_number',
            'iqama_number',
            'visa_expiry_date',
            'work_permit_urls',
            'contract_urls',
            'insurance_image_url',
        ]

    def get_work_permit_urls(self, obj):
        try:
            return obj.documents.work_permit_urls  # Make sure this is actually a list of URLs
        except:
            return []


    def get_contract_urls(self, obj):
        try:
            return obj.documents.contract_urls
        except:
            return []

    def get_insurance_image_url(self, obj):
        try:
            return obj.documents.insurance_image_url
        except:
            return None
class EmployeeDashboardSerializer(serializers.ModelSerializer):
    bank_details = EmpBankPaymentSerializer(read_only=True)
    company_days = serializers.SerializerMethodField()

    dob = SafeDateField(required=False)
    joining_date = SafeDateField(required=False)
    visa_expiry_date = SafeDateField(required=False)

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']

    def get_company_days(self, obj):
        from datetime import date
        if obj.joining_date:
            return (date.today() - obj.joining_date).days
        return 0

class ScheduleReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleReminder
        fields = '__all__'
        read_only_fields = ('employee', 'created_at', 'notified')
