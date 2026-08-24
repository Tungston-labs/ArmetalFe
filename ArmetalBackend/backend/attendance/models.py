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
import logging
from django.conf import settings
logger = logging.getLogger(__name__)


class Attendance(TimeStampedModel):
    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    locations = models.JSONField(default=list, blank=True, null=True)
    status = models.CharField(
    max_length=20,
    choices=[
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ],
    default="pending",
    null=True,
    blank=True,
)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_attendances"
    )

    class Meta:
        unique_together = ['employee', 'date']

    def update_total_hours(self):
        """Calculate total hours from all completed sessions for this attendance date"""
        total_seconds = 0
        
        for session in self.sessions.all():
            if session.time_in and session.time_out:
                # Ensure both times are timezone-aware datetime objects
                time_in = self._ensure_datetime(session.time_in)
                time_out = self._ensure_datetime(session.time_out)
                
                if time_in and time_out:
                    # Calculate duration in seconds
                    duration = time_out - time_in
                    total_seconds += duration.total_seconds()
        
        # Convert seconds to hours with 2 decimal places
        self.total_hours = round(total_seconds / 3600, 2)
        self.save()

    def _ensure_datetime(self, dt_or_time):
        """Convert time objects to datetime and ensure timezone awareness"""
        if dt_or_time is None:
            return None
            
        # If it's a time object, combine with attendance date
        if isinstance(dt_or_time, time):
            dt_or_time = datetime.combine(self.date, dt_or_time)
        
        # Ensure it's a datetime object
        if not isinstance(dt_or_time, datetime):
            return None
            
        # Make timezone aware if naive
        if timezone.is_naive(dt_or_time):
            # Use UTC as default, will be converted to company timezone later
            dt_or_time = timezone.make_aware(dt_or_time, timezone=pytz.UTC)
            
        return dt_or_time

    def __str__(self):
        return f"{self.employee.name} - {self.date}"


class AttendanceSession(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='sessions')
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC', null=True, blank=True)
    note = models.TextField(blank=True, null=True)
    punch_in_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    punch_in_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    punch_in_location = models.CharField(max_length=255, null=True, blank=True)

    punch_out_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    punch_out_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    punch_out_location = models.CharField(max_length=255, null=True, blank=True)


    def save(self, *args, **kwargs):
        # Store original values before processing
        original_time_in = self.time_in
        original_time_out = self.time_out
        
        # Process time_in only if it's being set/updated
        if self.time_in is not None:
            self.time_in = self._process_datetime(self.time_in, field_name='time_in')
            
        # Process time_out only if it's being set/updated
        if self.time_out is not None:
            self.time_out = self._process_datetime(self.time_out, field_name='time_out')
            
        super().save(*args, **kwargs)
        
        # Update attendance total hours after saving
        if self.attendance:
            self.attendance.update_total_hours()

    def _process_datetime(self, dt, field_name='unknown'):
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
            except Exception as e:
                logger.error(f"Failed to parse {field_name} datetime string '{dt}': {e}")
                pass
                
        # If it's a time object, combine with attendance date
        if isinstance(dt, time) and self.attendance:
            dt = datetime.combine(self.attendance.date, dt)
            if timezone.is_naive(dt):
                dt = timezone.make_aware(dt, timezone=pytz.UTC)
            return dt
                
        # Only fallback to current time if we can't process the input
        logger.warning(f"Using current time as fallback for {field_name} with value: {dt}")
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
# attendance/models.py
from employee.models import Employee_db

class HourlyLocationLog(models.Model):
    employee = models.ForeignKey(Employee_db, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_name = models.CharField(max_length=255, blank=True, null=True)
    logged_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-logged_at']