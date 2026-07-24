from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  # usually 'username' or 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add roles to token payload
        token['is_superadmin'] = user.is_superadmin
        token['is_hr_admin'] = user.is_hr_admin
        token['is_employee'] = user.is_employee
        token['is_hr'] = user.is_hr  # ✅ Add HR flag
        return token

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        fcm_token = self.context['request'].data.get("fcm_token")

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Your account has been disabled."
            )

        company = None

        # HR Admin / Company Admin
        if user.company:
            company = user.company

        # Employee
        elif hasattr(user, "employee_db"):
            employee = user.employee_db

            if (
                employee and
                employee.department and
                employee.department.company
            ):
                company = employee.department.company

        if company and not company.is_active:
            raise serializers.ValidationError(
                "Your company's subscription has expired."
            )

        if user is None:
            raise serializers.ValidationError("Invalid username or password")

        if fcm_token:
            user.fcm_token = fcm_token
            user.save(update_fields=["fcm_token"])

        data = super().validate(attrs)

        # ✅ Find company
        company = None
        if user.company:
            company = user.company
        elif hasattr(user, "employee_db") and user.employee_db.department and user.employee_db.department.company:
            company = user.employee_db.department.company

        company_modules = company.modules if company else {}

        # ✅ Return structured user data + company info
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superadmin': user.is_superadmin,
            'is_hr_admin': user.is_hr_admin,
            'is_employee': user.is_employee,
            'is_hr': user.is_hr,
            'company_modules': company_modules,
            'fcm_token': user.fcm_token,
            "company": {
                "id": company.id if company else None,
                "name": company.name if company else None,
                "location": company.location if company else None,
                "country":company.country if company else None,
                "logo": self.context['request'].build_absolute_uri(company.logo.url) if company and company.logo else None  
            }
        }

        return data


from rest_framework import serializers
from .models import OTP, User

class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
