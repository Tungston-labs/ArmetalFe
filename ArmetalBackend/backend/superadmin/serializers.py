from rest_framework import serializers
from .models import Company,CompanySubscription
from user.models import User
from calendar import month_name
from datetime import date
import calendar
from rest_framework import serializers
from superadmin.models import Company
from user.models import User
from django.core.mail import send_mail
from django.conf import settings


from rest_framework import serializers
from django.conf import settings
from django.core.mail import send_mail
from .models import Company, User
import json


class CompanyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "id",
            "company_id",
            "name",
            "address",
            "location",
            "contact_number",
            "country",
            "logo",
            "email",
            "modules",
            "latitude",
            "longitude",
            "number_of_employees",
            "default_password",
            "created_at",
            "updated_at",
            "amount_per_employee",
            "initial_payment",
        ]

        read_only_fields = [
            "id",
            "company_id",
            "number_of_employees",
            "default_password",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "modules": {"required": True},
            "amount_per_employee": {"required": False},
            "initial_payment": {"required": False},
        }

    # ---------------------------------------------------------
    # CREATE
    # ---------------------------------------------------------
    def create(self, validated_data):

        # parse modules if multipart string
        modules = self.initial_data.get("modules")
        if isinstance(modules, str):
            validated_data["modules"] = json.loads(modules)

        # create company → model default handles missing decimals
        company = Company.objects.create(**validated_data)

        # create HR admin
        User.objects.create_user(
            username=company.company_id,
            email=company.email,
            password=company.default_password,
            is_hr_admin=True,
            company=company,
        )

        # send email
        try:
            send_mail(
                subject="Welcome to Armetal - Company Credentials",
                message=f"""
    Hi {company.name},

    Your company account has been successfully created.

    Login credentials:
    Username: {company.company_id}
    Password: {company.default_password}

    Regards,
    Armetal Support
    """,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[company.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return company


    # ---------------------------------------------------------
    # UPDATE
    # ---------------------------------------------------------
    def update(self, instance, validated_data):

        modules = self.initial_data.get("modules")
        if isinstance(modules, str):
            validated_data["modules"] = json.loads(modules)

        old_email = instance.email
        new_email = validated_data.get("email", old_email)

        instance = super().update(instance, validated_data)

        # sync HR admin email
        if new_email != old_email:
            hr_user = User.objects.filter(company=instance, is_hr_admin=True).first()
            if hr_user:
                hr_user.email = new_email
                hr_user.save()

        return instance

    # ---------------------------------------------------------
    # VALIDATION
    # ---------------------------------------------------------
    def validate_modules(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Modules must be a dictionary")
        return value



 
class CompanySubscriptionSerializer(serializers.ModelSerializer):
    month_display = serializers.SerializerMethodField()

    class Meta:
        model = CompanySubscription
        fields = [
            'id',
            'company',
            'month',
            'month_display',
            'year',
            'paid_date',
            'amount',   # INR only
            'status',
        ]

    def get_month_display(self, obj):
        return month_name[obj.month]
 
        return currency
    
class CompanyListSerializer(serializers.ModelSerializer):
    last_paid_date = serializers.SerializerMethodField()
    next_due_date = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id',
            'company_id',
            'name',
            'logo_url',
            'address',
            'contact_number',
            'number_of_employees',
            'last_paid_date',
            'next_due_date',
        ]

    def get_logo_url(self, obj):
        request = self.context.get('request', None)
        if obj.logo and hasattr(obj.logo, 'url'):
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

    def get_last_paid_date(self, obj):
        last_paid = obj.subscriptions.filter(status="paid").order_by('-year', '-month').first()
        if last_paid and last_paid.paid_date:
            return last_paid.paid_date.isoformat()
        return None

    def get_next_due_date(self, obj):
        last_paid = obj.subscriptions.filter(status="paid").order_by('-year', '-month').first()
        if not last_paid or not last_paid.paid_date:
            return None

        paid_date = last_paid.paid_date
        year, month, day = paid_date.year, paid_date.month, paid_date.day
        if month == 12:
            next_month, next_year = 1, year + 1
        else:
            next_month, next_year = month + 1, year

        days_in_next_month = calendar.monthrange(next_year, next_month)[1]
        next_day = min(day, days_in_next_month)
        return date(next_year, next_month, next_day).isoformat()



class CompanySelfUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "name",
            "address",
            "location",
            "latitude",
            "longitude",
            "country",
            "contact_number",
            "email",
            "modules",
            "logo",
            'amount_per_employee',   
            'initial_payment', 
        ]
        extra_kwargs = {
            "email": {"required": False},
            "modules": {"required": False},
        }
