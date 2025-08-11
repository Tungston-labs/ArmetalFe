from django.db import models

from employee.models import Employee_db,EmpBankPaymentModel

class EmployeePayrollRecord(models.Model):
    STATUS_CHOICES = [
        ('OnHold', 'OnHold'),
        ('Cancelled', 'Cancelled'),
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
    ]

    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE)
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    salary_date = models.DateField(auto_now_add=True)

    # Snapshot from EmpBankPaymentModel
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    salary_increment = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    transportation = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    tds_deduction_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_mode = models.CharField(max_length=10, choices=EmpBankPaymentModel.PAYMENT_MODES, blank=True, null=True)
    tax_regime = models.CharField(max_length=10, choices=EmpBankPaymentModel.TAX_REGIMES, blank=True, null=True)
    pan_number = models.CharField(max_length=15, blank=True, null=True)
    account_number = models.CharField(max_length=30, blank=True, null=True)
    payslip_file = models.FileField(upload_to='payslips/', null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')

    def __str__(self):
        return f"{self.employee.name} - {self.month}/{self.year}"
