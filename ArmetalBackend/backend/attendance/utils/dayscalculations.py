from datetime import timedelta, datetime, date
from decimal import Decimal

import pytz

from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(employee, start_date, end_date):

    today = date.today()

    # ============================================================
    # COMPANY SETTINGS
    # ============================================================

    company = employee.department.company

    full_day_hours = Decimal(company.working_hours_per_day)
    half_day_hours = Decimal(company.half_day_hours)

    # ============================================================
    # HOLIDAYS & WEEKLY OFF
    # ============================================================

    holidays_qs = PublicHoliday.objects.filter(
        company=company
    )

    holiday_map = {}
    company_off_days = {}

    for h in holidays_qs:

        # Weekly Off
        if (
            h.holiday_type == "company_off_day"
            and h.off_day_weekday is not None
        ):
            company_off_days[h.off_day_weekday] = (
                h.description or "Company Off"
            )

        # Public / Company Holiday
        elif h.date:
            holiday_map[h.date] = (
                h.description or "Holiday"
            )

    # ============================================================
    # INITIAL VALUES
    # ============================================================

    total_days_full_month = (
        end_date - start_date
    ).days + 1

    working_days = 0
    present_days = Decimal("0")
    unswiped_days_till_today = Decimal("0")

    daily_records = []

    # ============================================================
    # ATTENDANCE
    # ============================================================

    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(start_date, today)
    ).select_related("updated_by")

    attendance_map = {}

    india_tz = pytz.timezone("Asia/Kolkata")
    utc_tz = pytz.UTC

    for a in attendances:

        sessions = (
            a.sessions
            .all()
            .order_by("time_in")
        )

        first_punch_in = None
        last_punch_out = None

        # --------------------------------------------------------
        # FIRST / LAST SESSION
        # --------------------------------------------------------

        if sessions.exists():

            first_session = sessions.first()
            last_session = sessions.last()

            # ----------------------------------------------------
            # FIRST PUNCH IN
            # ----------------------------------------------------

            if first_session.time_in:

                if isinstance(
                    first_session.time_in,
                    datetime
                ):
                    first_dt = first_session.time_in

                else:
                    first_dt = datetime.combine(
                        a.date,
                        first_session.time_in
                    )

                if first_dt.tzinfo is None:
                    first_dt = utc_tz.localize(first_dt)

                first_dt_ist = first_dt.astimezone(
                    india_tz
                )

                first_punch_in = first_dt_ist.strftime(
                    "%I:%M %p"
                )

            # ----------------------------------------------------
            # LAST PUNCH OUT
            # ----------------------------------------------------

            if last_session.time_out:

                if isinstance(
                    last_session.time_out,
                    datetime
                ):
                    last_dt = last_session.time_out

                else:
                    last_dt = datetime.combine(
                        a.date,
                        last_session.time_out
                    )

                if last_dt.tzinfo is None:
                    last_dt = utc_tz.localize(last_dt)

                last_dt_ist = last_dt.astimezone(
                    india_tz
                )

                last_punch_out = last_dt_ist.strftime(
                    "%I:%M %p"
                )

        # ========================================================
        # UPDATED BY
        # ========================================================

        updated_by = None
        updated_by_role = None

        if a.updated_by:

            updated_by = a.updated_by.username

            if a.updated_by.is_superadmin:
                updated_by_role = "Super Admin"

            elif a.updated_by.is_hr_admin:
                updated_by_role = "HR Admin"

            elif a.updated_by.is_hr:
                updated_by_role = "HR"

            elif a.updated_by.is_employee:
                updated_by_role = "Employee"

            else:
                updated_by_role = "User"

        # ========================================================
        # STORE ATTENDANCE DATA
        # ========================================================

        attendance_map[a.date] = {
            "hours": Decimal(a.total_hours or 0),
            "first_punch_in": first_punch_in,
            "last_punch_out": last_punch_out,

            # Manual/admin status
            "status": a.status,

            # Manual remark
            "remark": a.remark,

            # Who updated
            "updated_by": updated_by,

            # Role of updater
            "updated_by_role": updated_by_role,
        }

    attendance_dates = set(
        attendance_map.keys()
    )

    # ============================================================
    # APPROVED LEAVES
    # ============================================================

    leave_requests = LeaveRequest.objects.filter(
        employee=employee,
        status="approved",
        from_date__lte=today,
        to_date__gte=start_date
    )

    approved_leave_dates = set()

    for leave in leave_requests:

        start = max(
            leave.from_date,
            start_date
        )

        end = min(
            leave.to_date,
            today
        )

        if isinstance(start, datetime):
            start = start.date()

        if isinstance(end, datetime):
            end = end.date()

        for i in range(
            (end - start).days + 1
        ):
            approved_leave_dates.add(
                start + timedelta(days=i)
            )

    # ============================================================
    # MAIN CALENDAR LOOP
    # ============================================================

    for i in range(total_days_full_month):

        d = start_date + timedelta(days=i)

        weekday = d.weekday()

        # ========================================================
        # HOLIDAY
        # ========================================================

        if d in holiday_map:

            if d <= today:

                daily_records.append({
                    "date": d,
                    "status": holiday_map[d],
                    "total_hours": 0,
                    "first_punch_in": None,
                    "last_punch_out": None,

                    "attendance_status": None,
                    "remark": None,
                    "updated_by": None,
                    "updated_by_role": None,
                })

            continue

        # ========================================================
        # WEEKLY OFF
        # ========================================================

        if weekday in company_off_days:

            if d <= today:

                daily_records.append({
                    "date": d,
                    "status": company_off_days[weekday],
                    "total_hours": 0,
                    "first_punch_in": None,
                    "last_punch_out": None,

                    "attendance_status": None,
                    "remark": None,
                    "updated_by": None,
                    "updated_by_role": None,
                })

            continue

        # ========================================================
        # WORKING DAY
        # ========================================================

        working_days += 1

        # Future date
        if d > today:
            continue

        # ========================================================
        # DEFAULT VALUES
        # ========================================================

        status = "absent"

        hours = Decimal("0")

        first_punch_in = None
        last_punch_out = None

        manual_status = None
        remark = None
        updated_by = None
        updated_by_role = None

        # ========================================================
        # APPROVED LEAVE
        # ========================================================

        if d in approved_leave_dates:

            status = "leave"

            unswiped_days_till_today += Decimal("1")

            daily_records.append({
                "date": d,
                "status": status,
                "total_hours": 0,
                "first_punch_in": None,
                "last_punch_out": None,

                "attendance_status": None,
                "remark": None,
                "updated_by": None,
                "updated_by_role": None,
            })

            continue

        # ========================================================
        # ATTENDANCE EXISTS
        # ========================================================

        if d in attendance_dates:

            attendance_data = attendance_map[d]

            hours = attendance_data["hours"]

            first_punch_in = (
                attendance_data["first_punch_in"]
            )

            last_punch_out = (
                attendance_data["last_punch_out"]
            )

            manual_status = (
                attendance_data["status"]
            )

            remark = (
                attendance_data["remark"]
            )

            updated_by = (
                attendance_data["updated_by"]
            )

            updated_by_role = (
                attendance_data["updated_by_role"]
            )

            # ====================================================
            # APPROVED MANUAL ATTENDANCE
            # ====================================================
            #
            # If admin/HR approves the attendance:
            #
            # approved
            #      ↓
            # Full Day Present
            #      ↓
            # Full Working Hours
            #
            # Actual swipe hours are ignored.
            #
            # ====================================================

            if manual_status == "approved":

                hours = attendance_data["hours"]

                if hours >= full_day_hours:

                    status = "present"
                    present_days += Decimal("1")

                elif hours >= half_day_hours:

                    status = "half_day"
                    present_days += Decimal("0.5")
                    unswiped_days_till_today += Decimal("0.5")

                else:

                    status = "absent"
                    unswiped_days_till_today += Decimal("1")

        # ========================================================
        # DAILY RECORD
        # ========================================================

        daily_records.append({

            "date": d,

            # Calculated attendance status
            "status": status,

            "total_hours": float(
                round(hours, 2)
            ),

            "first_punch_in": first_punch_in,

            "last_punch_out": last_punch_out,

            # Manual/admin attendance status
            "attendance_status": manual_status,

            # Admin remark
            "remark": remark,

            # User who modified attendance
            "updated_by": updated_by,

            # Role of user who modified attendance
            "updated_by_role": updated_by_role,
        })

    # ============================================================
    # LEAVE ADJUSTMENT
    # ============================================================

    total_leave_balance = Decimal(
        employee.total_leave or 0
    )

    leave_adjustment = min(
        Decimal(len(approved_leave_dates)),
        total_leave_balance
    )

    real_absent_days = (
        unswiped_days_till_today
        - leave_adjustment
    )

    # ============================================================
    # LOP
    # ============================================================

    lop_days = max(
        real_absent_days,
        Decimal("0")
    )

    # ============================================================
    # ABSENT
    # ============================================================

    absent_days = max(
        real_absent_days,
        Decimal("0")
    )

    # ============================================================
    # RETURN
    # ============================================================

    return (
        working_days,
        float(present_days),
        float(absent_days),
        float(lop_days),
        daily_records
    )