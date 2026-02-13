import random
import string
from django.db import models
from shared.models import TimeStampedModel  
from django.utils.timezone import now
from calendar import month_name
from user.models import User
from django.core.exceptions import ValidationError
from shared.dataencrpt import EncryptedCharField,EncryptedEmailField,EncryptedIntegerField,EncryptedTextField

import re
def generate_password():
    return 'CMP' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def generate_company_id_from_name(name):
    # remove spaces and special characters
    clean_name = re.sub(r'[^a-zA-Z0-9]', '', name)
    base_id = clean_name.lower()

    # ensure uniqueness
    unique_id = base_id
    counter = 1
    while Company.objects.filter(company_id=unique_id).exists():
        unique_id = f"{base_id}{counter}"
        counter += 1

    return unique_id



COUNTRY_CHOICES = [
    ("IN", "India"),
    ("US", "United States"),
    ("AE", "United Arab Emirates"),
    ("SG", "Singapore"),
    ("GB", "United Kingdom"),
    ("DE", "Germany"),
    ("FR", "France"),
    ("JP", "Japan"),
    ("CN", "China"),
    ("AU", "Australia"),
    ("CA", "Canada"),
    
]


class Company(TimeStampedModel):
    company_id = models.CharField(max_length=200, unique=True, editable=False)
    name = EncryptedCharField(max_length=255)
    address = EncryptedTextField()
    location = models.CharField(max_length=100)
    latitude = models.FloatField(help_text="Latitude of the company location",null=True,blank=True)
    longitude = models.FloatField(help_text="Longitude of the company location",null=True,blank=True)
    country = models.CharField(max_length=300, choices=COUNTRY_CHOICES, blank=True, null=True)
    contact_number = EncryptedCharField(max_length=300)
    email = models.EmailField(unique=True)
    modules = models.JSONField(default=dict)  # e.g. {"attendance": True, "leave": True}
    number_of_employees = models.PositiveIntegerField(default=0, editable=False)
    default_password = models.CharField(max_length=200, editable=False)
    logo = models.FileField(
                upload_to='company_logos/',
                null=True,
                blank=True,
                help_text="Upload PNG or SVG logo."
            )
    amount_per_employee = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0
)


    initial_payment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Advance amount paid during company onboarding (not linked to subscription)"
    )


    def save(self, *args, **kwargs):

    # ✅ force decimal defaults at DB level
        if self.amount_per_employee is None:
            self.amount_per_employee = 0

        if self.initial_payment is None:
            self.initial_payment = 0

        if not self.company_id:
            self.company_id = generate_company_id_from_name(self.name)

        if not self.default_password:
            self.default_password = generate_password()

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.name} ({self.company_id})"
    

    def clean(self):
        super().clean()
        if self.logo:
            ext = self.logo.name.lower().split('.')[-1]
            if ext not in ['png', 'svg']:
                raise ValidationError("Only .png or .svg files are allowed for the logo.")




class CompanySubscription(TimeStampedModel):
  
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='subscriptions')
    month = models.PositiveSmallIntegerField(choices=[(i, month_name[i]) for i in range(1, 13)])
    year = models.PositiveIntegerField(default=now().year)
    paid_date = models.DateField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10,default='unpaid')
    currency = models.CharField(max_length=10, default='AED')

    class Meta:
        unique_together = ('company', 'month', 'year')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.company.name} - {month_name[self.month]} {self.year} ({self.status})"


    def save(self, *args, **kwargs):
        rate = self.company.amount_per_employee or 0
        expected_amount = round(self.company.number_of_employees * rate, 2)

        if not self.amount or self.amount != expected_amount:
            self.amount = expected_amount

        # when marked as paid
        if self.status == "paid":
            if not self.paid_date:
                self.paid_date = now().date()

            self.company.users.update(is_active=True)

        super().save(*args, **kwargs)


    


    

class ImpersonationRequest(models.Model):
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('super_admin', 'company')

