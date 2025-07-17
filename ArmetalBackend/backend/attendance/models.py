from django.db import models
from datetime import datetime
from django.utils import timezone
from employee.models import Employee_db
from shared.models import TimeStampedModel
from datetime import timedelta,time

class Attendance(TimeStampedModel):
    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    remark = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ['employee', 'date']

    def update_total_hours(self):
        sessions = self.sessions.all()
        total = timedelta()

        for session in sessions:
            if session.time_in and session.time_out:
                # Ensure both are timezone-aware
                time_in = session.time_in
                time_out = session.time_out
                
                if timezone.is_naive(time_in):
                    time_in = timezone.make_aware(time_in)
                if timezone.is_naive(time_out):
                    time_out = timezone.make_aware(time_out)
                
                total += time_out - time_in

        self.total_hours = round(total.total_seconds() / 3600, 2)
        self.save()


    def __str__(self):
        return f"{self.employee.name} - {self.date}"


class AttendanceSession(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='sessions')
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC',null=True,blank=True)  # Store the timezone used


    def __str__(self):
        return f"{self.attendance.employee.name} - {self.attendance.date} [{self.time_in} - {self.time_out}]"
