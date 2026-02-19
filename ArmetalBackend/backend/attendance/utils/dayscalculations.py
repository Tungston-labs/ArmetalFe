from datetime import timedelta, datetime, date
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(employee, start_date, end_date):
    """
    Returns:
    working_days, present_days, absent_days, lop_days, daily_records
    """

    today = date.today()

    # --------------------------------------------------
    # Holidays & Off days (FULL MONTH still needed)
    # --------------------------------------------------
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

    # --------------------------------------------------
    # Attendance (ONLY till today matters for HR counts)
    # --------------------------------------------------
    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(start_date, min(end_date, today))
    )

    attendance_map = {a.date: float(a.total_hours or 0) for a in attendances}
    attendance_dates = set(attendance_map.keys())

    full_days = 0
    half_days = 0

    for hrs in attendance_map.values():
        if hrs >= 8:
            full_days += 1
        elif 5 <= hrs < 8:
            half_days += 1

    present_days = full_days + (0.5 * half_days)

    # --------------------------------------------------
    # Approved Leaves (ONLY till today)
    # --------------------------------------------------
    leave_requests = LeaveRequest.objects.filter(
        employee=employee,
        status="approved",
        from_date__lte=min(end_date, today),
        to_date__gte=start_date
    )

    approved_leave_dates = set()

    for leave in leave_requests:
        start = max(leave.from_date, start_date)
        end = min(leave.to_date, min(end_date, today))

        if isinstance(start, datetime):
            start = start.date()
        if isinstance(end, datetime):
            end = end.date()

        for i in range((end - start).days + 1):
            approved_leave_dates.add(start + timedelta(days=i))

    approved_leave_count = len(approved_leave_dates)

    # --------------------------------------------------
    # FULL MONTH working days (HR display requirement)
    # --------------------------------------------------
    total_days_full_month = (end_date - start_date).days + 1

    working_days = 0
    daily_records = []

    # --------------------------------------------------
    # HR COUNTS ONLY TILL TODAY
    # --------------------------------------------------
    unswiped_days_till_today = 0

    for i in range(total_days_full_month):
        d = start_date + timedelta(days=i)
        weekday = d.weekday()

        # ---------- Holiday ----------
        if d in holidays:
            status = "holiday"
            hours = 0

        # ---------- Company off ----------
        elif weekday in company_off_days:
            status = "off"
            hours = 0

        else:
            # Count working day for FULL month
            working_days += 1

            # ----- FUTURE DATE → do NOT affect HR counts -----
            if d > today:
                status = "upcoming"
                hours = 0

            # ----- Leave -----
            elif d in approved_leave_dates:
                status = "leave"
                hours = 0
                unswiped_days_till_today += 1

            # ----- Attendance -----
            elif d in attendance_dates:
                hours = attendance_map[d]

                if hours >= 8:
                    status = "present"
                elif 5 <= hrs < 8:
                    status = "half_day"
                else:
                    status = "absent"
                    unswiped_days_till_today += 1

            # ----- Absent till today -----
            else:
                status = "absent"
                hours = 0
                unswiped_days_till_today += 1

        daily_records.append({
            "date": d,
            "status": status,
            "total_hours": round(hours, 2),
        })

    # --------------------------------------------------
    # FINAL HR-CORRECT CALCULATIONS (ONLY till today)
    # --------------------------------------------------

    real_absent_days = unswiped_days_till_today - approved_leave_count

    total_leave_balance = float(employee.total_leave or 0)
    paid_leave = float(employee.paid_leave or 0)

    leave_adjustment = min(approved_leave_count, total_leave_balance)

    lop_from_absent = max(real_absent_days - leave_adjustment, 0)

    lop_days = lop_from_absent + paid_leave

    absent_days = max(
        (unswiped_days_till_today - leave_adjustment),
        0
    )

    return working_days, present_days, absent_days, lop_days, daily_records
