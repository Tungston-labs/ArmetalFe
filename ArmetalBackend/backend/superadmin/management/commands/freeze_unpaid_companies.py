from django.core.management.base import BaseCommand
from datetime import date, timedelta
import calendar
from django.utils.timezone import now
from superadmin.models import Company, CompanySubscription


class Command(BaseCommand):
    help = "Freeze users of companies after grace period if unpaid"

    def handle(self, *args, **kwargs):
        today = now().date()

        for company in Company.objects.all():

            billing_day = company.created_at.day
            year, month = today.year, today.month

            # due date for current month
            days_in_month = calendar.monthrange(year, month)[1]
            due_day = min(billing_day, days_in_month)
            due_date = date(year, month, due_day)

            # if today is before due date → check previous month cycle
            if today <= due_date:
                if month == 1:
                    month, year = 12, year - 1
                else:
                    month -= 1

                days_in_month = calendar.monthrange(year, month)[1]
                due_day = min(billing_day, days_in_month)
                due_date = date(year, month, due_day)

            # grace date
            freeze_date = due_date + timedelta(days=10)

            # skip if still in grace
            if today <= freeze_date:
                continue

            # check subscription for that billing month
            sub = CompanySubscription.objects.filter(
                company=company,
                month=month,
                year=year,
                status="paid"
            ).exists()

            if not sub:
                updated = company.users.update(is_active=False)

                self.stdout.write(
                    f" Frozen {updated} users of company {company.company_id}"
                )
