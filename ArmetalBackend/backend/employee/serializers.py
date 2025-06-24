from rest_framework import serializers
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


class EmpBankPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpBankPaymentModel
        fields = '__all__'
        read_only_fields = ['employee']
class EmployeeSerializer(serializers.ModelSerializer):
    dob = SafeDateField(required=False)
    joining_date = SafeDateField(required=False)
    visa_expiry = SafeDateField(required=False)
    passport_expiry = SafeDateField(required=False)
    contract_start = SafeDateField(required=False)
    contract_end = SafeDateField(required=False)

    department_id = serializers.PrimaryKeyRelatedField(
        source='department',
        queryset=Department.objects.all(),
        write_only=True
    )
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee_db
        exclude = ['user', 'password']



class TempUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempUpload
        fields = ['id', 'file']


class EmpDocumentSerializer(serializers.ModelSerializer):
    class Meta :
        model = EmpDocument
        fields = [
            'passport_image1_url',
            'passport_image2_url',
            'insurance_image_url',
            'work_permit_urls',
            'contract_urls',
            'certificate_urls'
        ]
