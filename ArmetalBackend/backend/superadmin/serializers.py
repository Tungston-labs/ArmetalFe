from rest_framework import serializers
from .models import Company
from user.models import User

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id',
            'company_id',
            'name',
            'address',
            'location',
            'contact_number',
            'email',
            'modules',
            'number_of_employees',
            'default_password',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'company_id',
            'number_of_employees',
            'default_password',
            'created_at',
            'updated_at'
        ]
        extra_kwargs = {
            'modules': {'required': True},
        }

    def create(self, validated_data):
        company = Company.objects.create(**validated_data)
        user = User.objects.create_user(
                username=company.company_id,
                email=company.email,
                password=company.default_password,
                is_hr_admin=True,
                company=company  

    
                )
        return company


    def validate_modules(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Modules must be a dictionary")
        return value
    
    
