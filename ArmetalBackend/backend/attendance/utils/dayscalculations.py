# payroll/utils.py
from datetime import timedelta, datetime
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(employee, start_date, end_date):
    """
    Returns:
    working_days, present_days, absent_days, lop_days, daily_records
    """

    # --- Holidays & Off days ---
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

    # --- Attendance pulled from REAL total_hours (auto-calculated from sessions) ---
    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(start_date, end_date)
    )

    attendance_map = {a.date: float(a.total_hours or 0) for a in attendances}
    attendance_dates = set(attendance_map.keys())

    full_days = 0
    half_days = 0

    for hrs in attendance_map.values():
        if hrs >= 8:
            full_days += 1
        elif 4 <= hrs < 8:
            half_days += 1

    present_days = full_days + (0.5 * half_days)

    # --- Approved Leaves ---
    leave_requests = LeaveRequest.objects.filter(
        employee=employee,
        status="approved",
        from_date__lte=end_date,
        to_date__gte=start_date
    )

    approved_leave_dates = set()

    for leave in leave_requests:
        start = max(leave.from_date, start_date)
        end = min(leave.to_date, end_date)

        if isinstance(start, datetime):
            start = start.date()
        if isinstance(end, datetime):
            end = end.date()

        for i in range((end - start).days + 1):
            approved_leave_dates.add(start + timedelta(days=i))

    # --- Build Day-wise Calendar ---
    total_days = (end_date - start_date).days + 1

    working_days = 0
    unswiped_valid_days = 0
    daily_records = []

    for i in range(total_days):
        d = start_date + timedelta(days=i)
        weekday = d.weekday()

        # Holiday
        if d in holidays:
            status = "holiday"
            hours = 0

        # Company off-day
        elif weekday in company_off_days:
            status = "off"
            hours = 0

        # Approved leave
        elif d in approved_leave_dates:
            status = "leave"
            hours = 0

        # Present
        elif d in attendance_dates:
            hours = attendance_map[d]

            if hours >= 8:
                status = "present"
            elif 4 <= hours < 8:
                status = "half_day"
            else:
                status = "absent"

            working_days += 1

        # Absent without swipe
        else:
            status = "absent"
            hours = 0
            working_days += 1
            unswiped_valid_days += 1

        daily_records.append({
            "date": d,
            "status": status,
            "total_hours": round(hours, 2),
        })

    # --- Paid leave balance ---
    paid_leave = float(employee.paid_leave or 0)

    # --- LOP with HALF-DAY consideration ---
    effective_absent = unswiped_valid_days - paid_leave
    lop_days = max(effective_absent, 0)

    # --- Final absent days (for display) ---
    absent_days = max(working_days - present_days - paid_leave, 0)

    return working_days, present_days, absent_days, lop_days, daily_records
