# employee/tasks.py
from celery import shared_task
from .models import ScheduleReminder
from employee.utils import send_push_notification  # your FCM helper

@shared_task
def send_reminder(reminder_id):
    try:
        reminder = ScheduleReminder.objects.get(id=reminder_id)
        user = reminder.employee.user
        token = user.fcm_token

        if token:
            send_push_notification(
                user=user,
                title=f"Reminder: {reminder.title}",
                message=reminder.body
            )

        # Mark reminder as notified
        reminder.notified = True
        reminder.save()

    except ScheduleReminder.DoesNotExist:
        pass


# @shared_task
# def send_reminder(reminder_id):
#     try:
#         reminder = ScheduleReminder.objects.get(id=reminder_id)
#         token = reminder.employee.user.fcm_token
#         if token:
#             send_push_notification(
#                 token,
#                 title="Reminder Alert",
#                 body=f"Reminder '{reminder.title}' scheduled for {reminder.scheduled_datetime.strftime('%Y-%m-%d %H:%M')}"
#             )
#     except ScheduleReminder.DoesNotExist:
#         pass

