from datetime import timedelta, datetime, date
from decimal import Decimal
from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday
from attendance.models import Attendance, AttendanceSession

def build_employee_month_calendar(employee, start_date, end_date):
    today = date.today()

    # ✅ Get company hours dynamically
    company = employee.department.company
    full_day_hours = Decimal(company.working_hours_per_day)
    half_day_hours = Decimal(company.half_day_hours)

    # ---------- Holidays & Weekly Off ----------
    holidays_qs = PublicHoliday.objects.filter(
        date__range=(start_date, end_date),
        company=company
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

    working_days = 0
    present_days = 0
    unswiped_days_till_today = 0
    daily_records = []

    # ---------- Attendance ----------
    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(start_date, today)
    ).prefetch_related("sessions")

    attendance_map = {}

    for a in attendances:
        sessions = a.sessions.all()

        first_session = sessions.order_by("time_in").first()

        last_session = sessions.filter(
        time_out__isnull=False
    ).order_by("-time_out").first()

    attendance_map[a.date] = {
        "hours": Decimal(a.total_hours or 0),

        "first_punch_in":
            first_session.time_in.strftime("%H:%M")
            if first_session and first_session.time_in
            else None,

        "last_punch_out":
            last_session.time_out.strftime("%H:%M")
            if last_session and last_session.time_out
            else None,
    }

    attendance_dates = set(attendance_map.keys())

    # ---------- Approved Leaves ----------
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

    # ---------- MAIN LOOP ----------
    for i in range(total_days_full_month):
        d = start_date + timedelta(days=i)
        weekday = d.weekday()

        # Holiday
        if d in holidays:
            if d <= today:
                daily_records.append({"date": d, "status": "holiday", "total_hours": 0})
            continue

        # Weekly Off
        if weekday in company_off_days:
            if d <= today:
                daily_records.append({"date": d, "status": "off", "total_hours": 0})
            continue

        # Count working day
        working_days += 1

        if d > today:
            continue

        # ---------- Leave ----------
        if d in approved_leave_dates:
            status = "leave"
            hours = Decimal(0)
            unswiped_days_till_today += 1

        # ---------- Attendance ----------
        elif d in attendance_dates:
            hours = attendance_map[d]

            hours = attendance_data["hours"]
            first_punch_in = attendance_data["first_punch_in"]
            last_punch_out = attendance_data["last_punch_out"]

            if hours >= full_day_hours:
                status = "present"
                present_days += 1

            elif hours >= half_day_hours:
                status = "half_day"
                present_days += Decimal("0.5")
                unswiped_days_till_today += Decimal("0.5")

            else:
                status = "absent"
                unswiped_days_till_today += 1

        # ---------- No Swipe ----------
        else:
            status = "absent"
            hours = Decimal(0)
            unswiped_days_till_today += 1

        daily_records.append({
            "date": d,
            "status": status,
            "total_hours": float(round(hours, 2)),
            "first_punch_in": first_punch_in,
            "last_punch_out": last_punch_out,
        })

    # ---------- FINAL LOP CALC ----------
    total_leave_balance = Decimal(employee.total_leave or 0)
    leave_adjustment = min(len(approved_leave_dates), total_leave_balance)

    real_absent_days = Decimal(unswiped_days_till_today) - Decimal(leave_adjustment)

    lop_days = max(real_absent_days, 0)
    absent_days = max(real_absent_days, 0)

    return working_days, float(present_days), float(absent_days), float(lop_days), daily_records