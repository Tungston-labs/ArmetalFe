from django.db import models
from shared.models import TimeStampedModel
from employee.models import Employee_db

# Create your models here.
class LeaveRequest(TimeStampedModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    LEAVE_TYPES = [
        ('casual', 'Casual'),
        ('sick', 'Sick'),
        ('earned', 'Earned'),
        ('maternity', 'Maternity'),
        ('others', 'Others'),
    ]

    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE, related_name='leave_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    reason = models.TextField()
    from_date = models.DateField()
    to_date = models.DateField()
    to_email = models.EmailField(help_text="Department lead email")
    cc_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee.name} - {self.leave_type} ({self.status})"