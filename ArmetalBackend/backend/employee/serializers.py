from rest_framework import serializers
from .models import (
    Employee_db, EmpBankPaymentModel
)

class EmpBankPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpBankPaymentModel
        fields = '__all__'
        read_only_fields = ['employee']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_db
        exclude = ['user', 'password']  # password and user will be handled internally


from rest_framework import serializers
from .models import EmpDocument,TempUpload

# serializers.py
class TempUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempUpload
        fields = ['id', 'file']


class EmpDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpDocument
        fields = [
            'passport_image1_url',
            'passport_image2_url',
            'insurance_image_url',
            'work_permit_urls',
            'contract_urls',
            'certificate_urls'
        ]
