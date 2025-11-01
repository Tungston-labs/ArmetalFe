from django.db import models
from shared.models import TimeStampedModel
from employee.models import Employee_db
from rest_framework.exceptions import ValidationError


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

    def save(self, *args, **kwargs):
        is_new = self._state.adding  # True if this is a new leave request
        old_status = None

        if not is_new:
            old_status = LeaveRequest.objects.filter(pk=self.pk).values_list("status", flat=True).first()

        # ✅ Only adjust counts when status changes to 'approved'
        if self.status == "approved" and old_status != "approved":
            leave_days = (self.to_date - self.from_date).days + 1
            employee = self.employee

            available_leave = employee.total_leave or 0

            if available_leave >= leave_days:
                employee.total_leave -= leave_days
            else:
                remaining_days = leave_days - available_leave
                employee.total_leave = 0
                employee.paid_leave = (employee.paid_leave or 0) + remaining_days

            employee.save(update_fields=["total_leave", "paid_leave"])

        super().save(*args, **kwargs)