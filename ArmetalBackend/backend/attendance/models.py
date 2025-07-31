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


# class AttendanceSession(models.Model):
#     attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='sessions')
#     time_in = models.DateTimeField(null=True, blank=True)
#     time_out = models.DateTimeField(null=True, blank=True)
#     timezone = models.CharField(max_length=50, default='UTC',null=True,blank=True)  # Store the timezone used


#     # def save(self, *args, **kwargs):
#     #     # Ensure time_in is a datetime and timezone-aware
#     #     if isinstance(self.time_in, datetime):
#     #         if timezone.is_naive(self.time_in):
#     #             self.time_in = timezone.make_aware(self.time_in)
#     #     elif self.time_in is not None:
#     #         raise TypeError("time_in must be a datetime object")

#     #     # Ensure time_out is a datetime and timezone-aware
#     #     if isinstance(self.time_out, datetime):
#     #         print('time out',self.time_out)
#     #         if timezone.is_naive(self.time_out):
#     #             self.time_out = timezone.make_aware(self.time_out)
#     #     elif self.time_out is not None:
#     #         raise TypeError("time_out must be a datetime object")

#     #     super().save(*args, **kwargs)

#     def save(self, *args, **kwargs):
#         # --- Handle time_in ---
#         if self.time_in is not None:
#             if not isinstance(self.time_in, datetime):
#                 raise TypeError("time_in must be a datetime object")
#             if timezone.is_naive(self.time_in):
#                 self.time_in = timezone.make_aware(self.time_in)

#         # --- Handle time_out ---
#         if self.time_out is not None:
#             if not isinstance(self.time_out, datetime):
#                 raise TypeError("time_out must be a datetime object")
#             if timezone.is_naive(self.time_out):
#                 self.time_out = timezone.make_aware(self.time_out)

#         super().save(*args, **kwargs)



#     def __str__(self):
#         return f"{self.attendance.employee.name} - {self.attendance.date} [{self.time_in} - {self.time_out}]"


class AttendanceSession(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='sessions')
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC', null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        now = timezone.now()

        # --- Validate or correct time_in ---
        if self.time_in is not None:
            if not isinstance(self.time_in, datetime):
                try:
                    parsed_time_in = parse_datetime(str(self.time_in))
                    if parsed_time_in:
                        self.time_in = parsed_time_in
                    else:
                        self.time_in = now
                except Exception:
                    self.time_in = now
            if timezone.is_naive(self.time_in):
                self.time_in = timezone.make_aware(self.time_in)
        else:
            self.time_in = now

        # --- Validate or correct time_out ---
        if self.time_out is not None:
            if not isinstance(self.time_out, datetime):
                try:
                    parsed_time_out = parse_datetime(str(self.time_out))
                    if parsed_time_out:
                        self.time_out = parsed_time_out
                    else:
                        self.time_out = now
                except Exception:
                    self.time_out = now
            if timezone.is_naive(self.time_out):
                self.time_out = timezone.make_aware(self.time_out)
        # Optional: If you want to default to current time when missing
        # else:
        #     self.time_out = now

        super().save(*args, **kwargs)