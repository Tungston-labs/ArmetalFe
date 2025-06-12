from django.db import models

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
     # Roles
    is_superadmin = models.BooleanField(default=False)
    is_hr_admin = models.BooleanField(default=False)
    is_employee = models.BooleanField(default=False)

    company = models.ForeignKey(
        'superadmin.Company',  # or your actual app label if different
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='users'
    )
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

