from django.db import models
from superadmin.models import Company
import datetime

class PublicHoliday(models.Model):
    HOLIDAY_TYPES = [
        ('public', 'Public Holiday'),
        ('company', 'Company Holiday'),
        ('company_off_day', 'Company Off Day'),  
        ('second_saturday', 'Second Saturday'),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='holidays'
    )
    date = models.DateField()
    day = models.CharField(max_length=20, blank=True, null=True)  # 🆕 auto-calculated
    description = models.CharField(max_length=255)
    holiday_type = models.CharField(max_length=20, choices=HOLIDAY_TYPES, null=True, blank=True)

    class Meta:
        unique_together = ('company', 'date')
        ordering = ['date']

    def save(self, *args, **kwargs):
        # Auto-fetch day from date (e.g. Monday, Tuesday...)
        if self.date:
            self.day = self.date.strftime('%A')  # e.g. Sunday
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} ({self.day}) - {self.description}"
