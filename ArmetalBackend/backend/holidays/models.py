from django.db import models

# Create your models here.
from django.db import models

class PublicHoliday(models.Model):
    HOLIDAY_TYPES = [
        ('public', 'Public Holiday'),
        ('religious', 'Religious Holiday'),
        ('company', 'Company Holiday'),
        ('optional', 'Optional/Restricted Holiday'),
        ('bank', 'Bank Holiday'),
        ('regional', 'Cultural/Regional Holiday'),
        ('observance', 'Observance/Non-Leave Day'),
    ]
    date = models.DateField(unique=True)
    description = models.CharField(max_length=255)
    holiday_type = models.CharField(max_length=20, choices=HOLIDAY_TYPES,null=True,blank=True)
    

    def __str__(self):
        return f"{self.date} - {self.description}"
