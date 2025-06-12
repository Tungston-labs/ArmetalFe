import random
import string
from django.db import models
from shared.models import TimeStampedModel  

def generate_password():
    return 'CMP' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def generate_company_id(location):
    letters = ''.join(random.choices(string.ascii_lowercase, k=3))
    location_part = location[:3].lower()
    digits = ''.join(random.choices(string.digits, k=3))
    return f"{letters}_arm_{location_part}_{digits}"

class Company(TimeStampedModel):
    company_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    location = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    modules = models.JSONField(default=dict)  # e.g. {"attendance": True, "leave": True}
    number_of_employees = models.PositiveIntegerField(default=0, editable=False)
    default_password = models.CharField(max_length=50, editable=False)

    def save(self, *args, **kwargs):
        if not self.company_id:
            self.company_id = generate_company_id(self.location)
        if not self.default_password:
            self.default_password = generate_password()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.company_id})"

