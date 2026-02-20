from datetime import timedelta, datetime, date
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(employee, start_date, end_date):
    today = date.today()

    # ---------- Holidays & Weekly Off ----------
    holidays_qs = PublicHoliday.objects.filter(
        date__range=(start_date, end_date),
        company=employee.department.company
    )

    holidays = set()
    company_off_days = set()

    for h in holidays_qs:
        if h.holiday_type == "company_off_day":
            company_off_days.add(h.date.weekday())
        else:
            holidays.add(h.date)

    # ---------- FULL MONTH LOOP ----------
    total_days_full_month = (end_date - start_date).days + 1

    working_days = 0  # Full month working days excluding holidays/off
    present_days = 0
    unswiped_days_till_today = 0
    daily_records = []

    # ---------- Attendance & Leaves ----------
    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(start_date, today)  # Only upto today
    )
    attendance_map = {a.date: float(a.total_hours or 0) for a in attendances}
    attendance_dates = set(attendance_map.keys())

    leave_requests = LeaveRequest.objects.filter(
        employee=employee,
        status="approved",
        from_date__lte=today,
        to_date__gte=start_date
    )

    approved_leave_dates = set()
    for leave in leave_requests:
        start = max(leave.from_date, start_date)
        end = min(leave.to_date, today)
        if isinstance(start, datetime):
            start = start.date()
        if isinstance(end, datetime):
            end = end.date()
        for i in range((end - start).days + 1):
            approved_leave_dates.add(start + timedelta(days=i))

    # ---------- Loop all month for working days, but daily records only upto today ----------
    for i in range(total_days_full_month):
        d = start_date + timedelta(days=i)
        weekday = d.weekday()

        # Holiday
        if d in holidays:
            if d <= today:
                daily_records.append({"date": d, "status": "holiday", "total_hours": 0})
            continue  # Not a working day

        # Weekly off
        if weekday in company_off_days:
            if d <= today:
                daily_records.append({"date": d, "status": "off", "total_hours": 0})
            continue  # Not a working day

        # Count as working day
        working_days += 1

        if d > today:
            continue  # No daily record for future

        # ---------- Check attendance / leave ----------
        if d in approved_leave_dates:
            status = "leave"
            hours = 0
            unswiped_days_till_today += 1

        elif d in attendance_dates:
            hours = attendance_map[d]
            if hours >= 8:
                status = "present"
                present_days += 1
            elif 5 <= hours < 8:
                status = "half_day"
                present_days += 0.5
                unswiped_days_till_today += 0.5
            else:
                status = "absent"
                unswiped_days_till_today += 1
        else:
            status = "absent"
            hours = 0
            unswiped_days_till_today += 1

        daily_records.append({"date": d, "status": status, "total_hours": round(hours, 2)})

    # ---------- FINAL LOP CALC ----------
    total_leave_balance = float(employee.total_leave or 0)
    leave_adjustment = min(len(approved_leave_dates), total_leave_balance)

    real_absent_days = unswiped_days_till_today - leave_adjustment
    lop_days = max(real_absent_days, 0)
    absent_days = max(real_absent_days, 0)

    return working_days, present_days, absent_days, lop_days, daily_records