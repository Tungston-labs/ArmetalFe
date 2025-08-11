from celery import shared_task
from django.utils import timezone
from .models import ScheduleReminder
from employee.utils import send_push_notification  # Adjust path if needed

@shared_task
def check_reminders():
    now = timezone.now()
    reminders = ScheduleReminder.objects.filter(
        scheduled_datetime__lte=now,
        notified=False
    )

    for reminder in reminders:
        user = reminder.employee.user
        send_push_notification(
            user=user,
            title=reminder.title,
            message=reminder.body
        )
        reminder.notified = True
        reminder.save()
