from django.db import models
from datetime import datetime
from django.utils import timezone
from employee.models import Employee_db
from shared.models import TimeStampedModel
from datetime import timedelta,time
from django.utils.dateparse import parse_datetime  # ensure this is imported
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_naive, make_aware, now as tz_now
import pytz


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
        # Ensure time_in is properly formatted and timezone-aware
        if self.time_in:
            self.time_in = self._process_datetime(self.time_in)
            
        # Ensure time_out is properly formatted and timezone-aware
        if self.time_out:
            self.time_out = self._process_datetime(self.time_out)
            
        super().save(*args, **kwargs)
        
        # Update attendance total hours after saving
        if self.attendance:
            self.attendance.update_total_hours()

    def _process_datetime(self, dt):
        """Process datetime to ensure it's timezone-aware"""
        if dt is None:
            return None
            
        # If it's already a datetime object
        if isinstance(dt, datetime):
            # Make timezone aware if naive
            if timezone.is_naive(dt):
                dt = timezone.make_aware(dt, timezone=pytz.UTC)
            return dt
            
        # If it's a string, try to parse it
        if isinstance(dt, str):
            try:
                parsed = parse_datetime(dt)
                if parsed:
                    if timezone.is_naive(parsed):
                        parsed = timezone.make_aware(parsed, timezone=pytz.UTC)
                    return parsed
            except Exception:
                pass
                
        # Fallback to current time
        return tz_now()

    def get_duration(self):
        """Get duration of this session in hours"""
        if self.time_in and self.time_out:
            time_in = self._ensure_datetime(self.time_in)
            time_out = self._ensure_datetime(self.time_out)
            
            if time_in and time_out:
                duration = time_out - time_in
                return round(duration.total_seconds() / 3600, 2)
        return 0

    def _ensure_datetime(self, dt_or_time):
        """Helper method to ensure datetime object"""
        if dt_or_time is None:
            return None
            
        if isinstance(dt_or_time, time):
            dt_or_time = datetime.combine(self.attendance.date, dt_or_time)
        
        if isinstance(dt_or_time, datetime):
            if timezone.is_naive(dt_or_time):
                dt_or_time = timezone.make_aware(dt_or_time, timezone=pytz.UTC)
            return dt_or_time
            
        return None




    # def save(self, *args, **kwargs):
    #     # Only parse/adjust time_in if it already exists (i.e., during punch-in)
    #     if self.time_in:
    #         if not isinstance(self.time_in, datetime):
    #             try:
    #                 parsed_time_in = parse_datetime(str(self.time_in))
    #                 if parsed_time_in:
    #                     self.time_in = parsed_time_in
    #                 else:
    #                     raise ValueError
    #             except Exception:
    #                 self.time_in = tz_now()
    #         if is_naive(self.time_in):
    #             self.time_in = make_aware(self.time_in)

    #     # DO NOT default time_in here. It's set explicitly during punch-in in view.

    #     # Only handle time_out if it's provided (i.e., during punch-out)
    #     if self.time_out:
    #         if not isinstance(self.time_out, datetime):
    #             try:
    #                 parsed_time_out = parse_datetime(str(self.time_out))
    #                 if parsed_time_out:
    #                     self.time_out = parsed_time_out
    #                 else:
    #                     raise ValueError
    #             except Exception:
    #                 self.time_out = tz_now()
    #         if is_naive(self.time_out):
    #             self.time_out = make_aware(self.time_out)

    #     # DO NOT set time_out = now if it's None — handled explicitly in view
    #     super().save(*args, **kwargs)
