from django.db import models
from superadmin.models import Company

# Create your models here.
from django.db import models

class FinanceRecord(models.Model):
    PAYMENT_TYPE_CHOICES = (
        ("IN", "Income"),
        ("OUT", "Expense"),
    )

    CATEGORY_CHOICES = (
        ("SALARY", "Salary"),
        ("REIMBURSEMENT", "Reimbursement"),
        ("TRAVEL", "Travel"),
        ("FOOD", "Food"),
        ("SUBSCRIPTION", "Subscription"),
        ("OTHER", "Other"),
    )

    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(
        max_length=3,
        choices=PAYMENT_TYPE_CHOICES
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )
    note = models.TextField(blank=True, null=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="finance_records"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.amount}"
