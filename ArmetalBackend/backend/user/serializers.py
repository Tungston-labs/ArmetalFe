from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

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
        return token

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid username or password")

        data = super().validate(attrs)

        # Extract company module access if user belongs to a company
        company_modules = {}
        if user.company:
            company_modules = user.company.modules

        # Return structured user data
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superadmin': user.is_superadmin,
            'is_hr_admin': user.is_hr_admin,
            'is_employee': user.is_employee,
            'company_modules': company_modules,
        }

        return data
