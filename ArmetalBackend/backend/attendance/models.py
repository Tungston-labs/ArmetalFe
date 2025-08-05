from django.db import models
from datetime import datetime
from django.utils import timezone
from employee.models import Employee_db
from shared.models import TimeStampedModel
from datetime import timedelta,time
from django.utils.dateparse import parse_datetime  # ensure this is imported



class Attendance(TimeStampedModel):
    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    remark = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ['employee', 'date']

    def update_total_hours(self):
        total = timedelta()
        for session in self.sessions.all():
            if session.time_in and session.time_out:
                # Handle any time objects that might exist
                time_in = session.time_in
                time_out = session.time_out
                
                if isinstance(time_in, time):
                    time_in = datetime.combine(self.date, time_in)
                if isinstance(time_out, time):
                    time_out = datetime.combine(self.date, time_out)
                
                # Ensure timezone awareness
                if timezone.is_naive(time_in):
                    time_in = timezone.make_aware(time_in)
                if timezone.is_naive(time_out):
                    time_out = timezone.make_aware(time_out)
                
                total += (time_out - time_in)
        
        self.total_hours = round(total.total_seconds() / 3600, 2)
        self.save()


    def __str__(self):
        return f"{self.employee.name} - {self.date}"


class AttendanceSession(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='sessions')
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC', null=True, blank=True)
    note = models.TextField(blank=True, null=True)


def save(self, *args, **kwargs):
    now = timezone.now()

    # --- Handle time_in on creation only ---
    if self._state.adding:
        if self.time_in is not None:
            if not isinstance(self.time_in, datetime):
                if isinstance(self.time_in, str):
                    parsed_time_in = parse_datetime(self.time_in)
                    if parsed_time_in:
                        self.time_in = parsed_time_in
                    else:
                        self.time_in = now
                else:
                    self.time_in = now
        else:
            self.time_in = now

    # --- Handle time_out ---
    if self.time_out is not None:
        if not isinstance(self.time_out, datetime):
            if isinstance(self.time_out, str):
                parsed_time_out = parse_datetime(self.time_out)
                if parsed_time_out:
                    self.time_out = parsed_time_out
                else:
                    self.time_out = now
            else:
                self.time_out = now

    super().save(*args, **kwargs)
