from django.core.management.base import BaseCommand
from datetime import date
from superadmin.models import CompanySubscription


class Command(BaseCommand):
    help = "Freeze users of companies with unpaid subscription after 10th"

    def handle(self, *args, **kwargs):
        today = date.today()

        # run only after 10th
        if today.day <= 10:
            return

        # previous month calculation
        month = today.month - 1 if today.month > 1 else 12
        year = today.year if today.month > 1 else today.year - 1

        unpaid_subs = CompanySubscription.objects.filter(
            month=month,
            year=year,
            status="unpaid"
        )

        for sub in unpaid_subs:
            company = sub.company

            # deactivate all users
            updated = company.users.update(is_active=False)

            self.stdout.write(
                f"❄️ Frozen {updated} users of company {company.company_id}"
            )
