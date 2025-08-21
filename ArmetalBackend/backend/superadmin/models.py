import random
import string
from django.db import models
from shared.models import TimeStampedModel  
from django.utils.timezone import now
from calendar import month_name
from user.models import User
from django.core.exceptions import ValidationError
from shared.dataencrpt import EncryptedCharField

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
    company_id = models.CharField(max_length=20, unique=True, editable=False)
    name = EncryptedCharField(max_length=255)
    address = models.TextField()
    location = models.CharField(max_length=100)
    country = models.CharField(max_length=3, choices=COUNTRY_CHOICES, blank=True, null=True)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    modules = models.JSONField(default=dict)  # e.g. {"attendance": True, "leave": True}
    number_of_employees = models.PositiveIntegerField(default=0, editable=False)
    default_password = models.CharField(max_length=50, editable=False)
    logo = models.ImageField(
        upload_to='company_logos/',
        null=True,
        blank=True,
        help_text="Upload PNG logo only."
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
            if not self.logo.name.lower().endswith('.png'):
                raise ValidationError("Only .png images are allowed for the logo.")



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
            self.amount = self.company.number_of_employees * rate
            self.currency = currency

        if self.status == 'paid' and not self.paid_date:
            self.paid_date = now().date()

        super().save(*args, **kwargs)

    def get_rate_per_employee_and_currency(self):
        """Return per-employee rate and currency based on location"""
        location = self.company.location.lower()
        if location == 'dubai':
            return 5.0, 'AED'
        elif location == 'india':
            return 113.0, 'INR'
        elif location == 'usa':
            return 2.0, 'USD'  # Example
        # Add more logic as needed
        return 5.0, 'AED'  # Default fallback
    

class ImpersonationRequest(models.Model):
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('super_admin', 'company')

