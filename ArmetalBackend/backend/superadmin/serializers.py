from rest_framework import serializers
from .models import Company,CompanySubscription
from user.models import User
from calendar import month_name


from rest_framework import serializers
from superadmin.models import Company
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
        # Create HR admin user linked to the company
        User.objects.create_user(
            username=company.company_id,
            email=company.email,
            password=company.default_password,
            is_hr_admin=True,
            company=company
        )
        return company

    def update(self, instance, validated_data):
        old_email = instance.email
        new_email = validated_data.get('email', old_email)

        instance = super().update(instance, validated_data)

        # If company email was updated, sync to user email
        if new_email != old_email:
            hr_user = User.objects.filter(company=instance, is_hr_admin=True).first()
            if hr_user:
                hr_user.email = new_email
                hr_user.save()

        return instance

    def validate_modules(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Modules must be a dictionary")
        return value


class CompanySubscriptionSerializer(serializers.ModelSerializer):
    month_display = serializers.SerializerMethodField()

    class Meta:
        model = CompanySubscription
        fields = ['id', 'company', 'month', 'month_display', 'year', 'paid_date', 'amount', 'currency', 'status']

    def get_month_display(self, obj):
        return month_name[obj.month]    
    
