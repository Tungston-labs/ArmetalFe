import random
import string
from django.db import models
from django.utils import timezone
from user.models import User
from departments.models import Department
from shared.models import TimeStampedModel

def generate_employee_id(company_name, department_name):
    company_part = company_name[:3].upper()
    department_part = department_name[:3].upper()
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
    return f"{company_part}{department_part}{random_part}"

def generate_password():
    return 'EMP' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class Employee_db(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True, editable=False)
    password = models.CharField(max_length=20,unique=True,null=True,blank=True)
    name = models.CharField(max_length=255)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    email = models.EmailField(unique=True)
    address = models.TextField()
    dob = models.DateField()
    gender = models.CharField(max_length=10, choices=[
        ('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')
    ])
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    joining_date = models.DateField(default=timezone.now)
    employment_type = models.CharField(max_length=20, choices=[
        ('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract')
    ])
    passport_number = models.CharField(max_length=50)
    iqama_number = models.CharField(max_length=50)
    insurance_number = models.CharField(max_length=50)
    visa_expiry_date = models.DateField()

    def save(self, *args, **kwargs):
        if not self.employee_id:
            company_name = self.department.company.name if self.department and self.department.company else "DEF"
            department_name = self.department.name if self.department else "GEN"
            self.employee_id = generate_employee_id(company_name, department_name)

        if not hasattr(self, 'user') or self.user is None:
            password = generate_password()
            self.password = password
            self.user = User.objects.create_user(
                username=self.employee_id,
                email=self.email,
                password=password,
                is_employee=True,
                company=self.department.company if self.department else None
                

            )
        super().save(*args, **kwargs)

    def __str__(self):
        
        return f"{self.name} ({self.employee_id})"


class EmpBankPaymentModel(models.Model):
    PAYMENT_MODES = [
        ('online', 'Online'),
        ('cod', 'Cash on Delivery'),
        ('cheque', 'Cheque'),
    ]

    TAX_REGIMES = [
        ('old', 'Old Regime'),
        ('new', 'New Regime'),
    ]

    employee = models.OneToOneField(Employee_db, on_delete=models.CASCADE, related_name='bank_details')
    bank_name = models.CharField(max_length=100)
    swift_code = models.CharField(max_length=20, blank=True, null=True)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODES)
    account_number = models.CharField(max_length=30)
    uan_epf_number = models.CharField(max_length=30, blank=True, null=True)
    pan_number = models.CharField(max_length=15)
    tax_regime = models.CharField(max_length=10, choices=TAX_REGIMES)
    tds_deduction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    declaration_80c = models.BooleanField(default=False)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    salary_increment = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    document = models.FileField(upload_to='bank_documents/', null=True, blank=True)

    def __str__(self):
        return f"{self.employee.name} - {self.bank_name}"


from django.db import models
from django.contrib.postgres.fields import ArrayField  # Optional if using PostgreSQL
from django.db.models import JSONField  # Django 3.1+ for generic DB support

# models.py
class TempUpload(models.Model):
    file = models.ImageField(upload_to='temp_uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class EmpDocument(models.Model):
    employee = models.OneToOneField('Employee_db', on_delete=models.CASCADE, related_name='documents')
    
    # Single image URLs
    passport_image1_url = models.URLField(blank=True, null=True)
    passport_image2_url = models.URLField(blank=True, null=True)
    insurance_image_url = models.URLField(blank=True, null=True)

    # Multiple image URLs as lists
    work_permit_urls = models.JSONField(default=list, blank=True)  # array of URLs
    contract_urls = models.JSONField(default=list, blank=True)
    certificate_urls = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Documents for {self.employee}"
