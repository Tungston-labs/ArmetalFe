from calendar import monthrange
from datetime import date

from employee.models import Employee_db


def get_billable_employee_count(company, month, year):
    """
    Employee must work at least 15 days in the month.
    """

    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])

    employees = Employee_db.objects.filter(
        user__company=company
    )

    total = 0

    for emp in employees:

        # Joined after month
        if emp.joining_date > last_day:
            continue

        start = max(emp.joining_date, first_day)

        if emp.is_deleted and emp.deleted_at:
            end = min(emp.deleted_at.date(), last_day)
        else:
            end = last_day

        days = (end - start).days + 1

        if days >= 15:
            total += 1

    return total