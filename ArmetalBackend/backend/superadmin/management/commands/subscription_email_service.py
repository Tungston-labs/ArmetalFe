import calendar
from datetime import date, timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils.timezone import now

from superadmin.models import CompanySubscription


class SubscriptionEmailService:

    @staticmethod
    def send_subscription_email(company):

        today = now().date()

        billing_day = company.created_at.day

        year = today.year
        month = today.month

        # Current month's due date
        days = calendar.monthrange(year, month)[1]
        due_day = min(billing_day, days)

        due_date = date(year, month, due_day)

        # If already passed, calculate next month's due date
        if today > due_date:

            if month == 12:
                month = 1
                year += 1
            else:
                month += 1

            days = calendar.monthrange(year, month)[1]
            due_day = min(billing_day, days)

            due_date = date(year, month, due_day)

        subscription = CompanySubscription.objects.filter(
            company=company,
            month=month,
            year=year
        ).first()

        amount = subscription.amount if subscription else 0
        currency = subscription.currency if subscription else "AED"

        send_mail(
            subject="Upcoming Subscription Payment",

            message=f"""
Dear {company.name},

This is a reminder regarding your HRMS subscription.

Subscription Month : {calendar.month_name[month]} {year}

Due Date           : {due_date}

Amount             : {amount} {currency}

Please complete your payment before the due date to avoid interruption of service.

Thank you.

Support Team
""",

            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[company.email],
            fail_silently=False,
        )