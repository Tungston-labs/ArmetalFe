from rest_framework import serializers
from .models import Company,CompanySubscription,SubscriptionPlan
from user.models import User
from calendar import month_name
from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from datetime import date, timedelta
import calendar
from django.utils.timezone import now
from django.conf import settings
from django.core.mail import send_mail
import json
from decimal import Decimal
from finance.models import FinanceCategory
from employee.models import Employee_db



class CompanyCreateSerializer(serializers.ModelSerializer):
    number_of_employees = serializers.SerializerMethodField()

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
            "basic_salary_percent",
            "house_allowance_percent",
            "transport_allowance_percent",
            "special_allowance_percent",
            "working_hours_per_day",
            "half_day_hours",
            "is_active",
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
    def validate(self, attrs):

    # -------------------------------
    # Handle decimal fields from multipart
    # -------------------------------
        ape = self.initial_data.get("amount_per_employee")
        ip = self.initial_data.get("initial_payment")

        if ape not in [None, ""]:
            attrs["amount_per_employee"] = Decimal(ape)

        if ip not in [None, ""]:
            attrs["initial_payment"] = Decimal(ip)

        # -------------------------------
        # Salary Percentage Validation
        # -------------------------------
        basic = attrs.get("basic_salary_percent", 0)
        hra = attrs.get("house_allowance_percent", 0)
        transport = attrs.get("transport_allowance_percent", 0)
        special = attrs.get("special_allowance_percent", 0)

        total_percent = basic + hra + transport + special

        if total_percent > 100:
            raise serializers.ValidationError(
                "Total salary percentage cannot exceed 100%."
            )

        # -------------------------------
        # Working Hours Validation
        # -------------------------------
        working_hours = attrs.get("working_hours_per_day")
        half_day_hours = attrs.get("half_day_hours")

        if working_hours and half_day_hours:
            if half_day_hours >= working_hours:
                raise serializers.ValidationError(
                    "Half day hours must be less than working hours per day."
                )

        return attrs

    # ---------------------------------------------------------
    # CREATE
    # ---------------------------------------------------------
    def create(self, validated_data):

        modules = self.initial_data.get("modules")

        if isinstance(modules, str):
            validated_data["modules"] = json.loads(modules)

        company = Company.objects.create(**validated_data)

        # -------------------------------------------------
        # Create HR Admin User
        # -------------------------------------------------
        User.objects.create_user(
            username=company.company_id,
            email=company.email,
            password=company.default_password,
            is_hr_admin=True,
            company=company,
        )

        # -------------------------------------------------
        # Create Default Finance Categories
        # -------------------------------------------------
        company_modules = company.modules or {}

        finance_enabled = (
            company_modules.get("finance") is True
            or company_modules.get("finance") == "true"
        )

        if finance_enabled:

            default_categories = [
                {
                    "name": "salary",
                    "payment_type": "OUT"
                },
                {
                    "name": "reimbursement",
                    "payment_type": "OUT"
                },
            ]

            for category in default_categories:

                FinanceCategory.objects.get_or_create(
                    company=company,
                    name=category["name"],
                    payment_type=category["payment_type"]
                )

        # -------------------------------------------------
        # Send Mail
        # -------------------------------------------------
        try:
            send_mail(
                subject="Welcome to Rekory - Company Credentials",
                message=f"""
    Hi {company.name},

    Your company account has been successfully created.

    Login credentials:
    Username: {company.company_id}
    Password: {company.default_password}

    Regards,
    Rekory Team
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

    def get_number_of_employees(self, obj):
        return Employee_db.objects.filter(
            department__company=obj,
            is_deleted=False
        ).count()

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
            "id",
            "company",
            "month",
            "month_display",
            "year",
            "employee_count",
            "amount_per_employee",
            "paid_date",
            "amount",
            "currency",
            "status",
        ]

    def get_month_display(self, obj):
        return month_name[obj.month]
    
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
        today = now().date()
        billing_day = obj.created_at.day

        year, month = today.year, today.month

        # last valid day of this month
        days_in_month = calendar.monthrange(year, month)[1]
        due_day = min(billing_day, days_in_month)

        due_date = date(year, month, due_day)

        # if already passed → move to next month
        if today > due_date:
            if month == 12:
                month, year = 1, year + 1
            else:
                month += 1

            days_in_month = calendar.monthrange(year, month)[1]
            due_day = min(billing_day, days_in_month)
            due_date = date(year, month, due_day)

        return due_date.isoformat()




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
            "basic_salary_percent",
            "house_allowance_percent",
            "transport_allowance_percent",
            "special_allowance_percent",
            "working_hours_per_day",
            "half_day_hours",
        ]
        extra_kwargs = {
            "email": {"required": False},
            "modules": {"required": False},
        }


class CompanySubscriptionActionSerializer(serializers.Serializer):

    company_id = serializers.IntegerField()

    action = serializers.ChoiceField(
        choices=[
            ("freeze", "Freeze"),
            ("unfreeze", "Unfreeze"),
        ]
    )


    def validate_company_id(self, value):

        if not Company.objects.filter(id=value).exists():
            raise serializers.ValidationError(
                "Company not found"
            )

        return value
    




class SubscriptionReminderSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()


class SubscriptionReminderSimpleSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    email = serializers.EmailField(required=False, allow_blank=False)




from rest_framework import serializers
from .models import SubscriptionPlan


from rest_framework import serializers
from .models import SubscriptionFeature, SubscriptionPlan


class SubscriptionFeatureSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionFeature
        fields = "__all__"

    def validate_name(self, value):
        queryset = SubscriptionFeature.objects.filter(
            name__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Feature already exists."
            )

        return value
    

class SubscriptionPlanSerializer(serializers.ModelSerializer):

    features = SubscriptionFeatureSerializer(
        many=True,
        read_only=True
    )

    feature_ids = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionFeature.objects.filter(
            is_active=True
        ),
        many=True,
        write_only=True,
        source="features"
    )

    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "plan_type",
            "description",
            "base_price",
            "extra_employee_price",
            "is_active",
            "features",
            "feature_ids",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        queryset = SubscriptionPlan.objects.filter(
            name__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Plan already exists."
            )

        return value

    def validate_base_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Base price must be greater than 0."
            )

        return value

    def validate_extra_employee_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Extra employee price cannot be negative."
            )

        return value