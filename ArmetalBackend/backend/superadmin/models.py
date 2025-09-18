import random
import string
from django.db import models
from shared.models import TimeStampedModel  
from django.utils.timezone import now
from calendar import month_name
from user.models import User
from django.core.exceptions import ValidationError
from shared.dataencrpt import EncryptedCharField,EncryptedEmailField,EncryptedIntegerField,EncryptedTextField

def generate_password():
    return 'CMP' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def generate_company_id(location):
    letters = ''.join(random.choices(string.ascii_lowercase, k=3))
    location_part = location[:3].lower()
    digits = ''.join(random.choices(string.digits, k=3))
    return f"{letters}_arm_{location_part}_{digits}"


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


    def save(self, *args, **kwargs):
        if not self.company_id:
            self.company_id = generate_company_id(self.location)
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
        if self.amount is None or self.amount == 0:
            rate, currency = self.get_rate_per_employee_and_currency()
            self.amount = round(self.company.number_of_employees * rate, 2)
            self.currency = currency

        if self.status == 'paid' and not self.paid_date:
            self.paid_date = now().date()

        super().save(*args, **kwargs)

    def get_rate_per_employee_and_currency(self):
        """Return per-employee rate and currency based on the company's country"""
        country_rate_map = {
            'AE': (5.0, 'AED'),
            'IN': (113.0, 'INR'),
            'US': (2.0, 'USD'),
            'SG': (2.7, 'SGD'),
            'GB': (1.9, 'GBP'),
            'DE': (2.0, 'EUR'),
            'FR': (2.0, 'EUR'),
            'JP': (300.0, 'JPY'),
            'CN': (13.0, 'CNY'),
            'AU': (3.0, 'AUD'),
            'CA': (2.5, 'CAD'),
        }

        country_code = self.company.country or 'AE'  # Default to UAE if not set
        return country_rate_map.get(country_code, (5.0, 'AED'))
    

class ImpersonationRequest(models.Model):
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('super_admin', 'company')

