from django.db import models
from employee.models import Employee_db

class Project(models.Model):
    PUNCH_TYPE_CHOICES = [
        ('on_site', 'On Site'),
        ('variant', 'Variant'),
    ]

    name = models.CharField(max_length=255)
    punch_type = models.CharField(max_length=20, choices=PUNCH_TYPE_CHOICES, default='on_site')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    employees = models.ManyToManyField(Employee_db, related_name='projects', blank=True)

    def __str__(self):
        return self.name
