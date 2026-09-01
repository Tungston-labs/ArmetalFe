
from datetime import timedelta, datetime, date
from decimal import Decimal
import pytz

from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(employee, start_date, end_date):

    today = date.today()

    # ============================================================
    # CALCULATION DATE RANGE
    # ============================================================
    # Never calculate attendance after today.
    calculation_end_date = min(end_date, today)

    # Never calculate anything before employee joining date.
    if employee.joining_date:
        start_date = max(
            start_date,
            employee.joining_date
        )

    # Employee has not joined yet / no valid calculation range
    if start_date > calculation_end_date:
        return (
            0,
            0.0,
            0.0,
            0.0,
            []
        )

    # ============================================================
    # COMPANY SETTINGS
    # ============================================================

    company = employee.department.company

    full_day_hours = Decimal(
        company.working_hours_per_day or 8
    )

    half_day_hours = Decimal(
        company.half_day_hours or 4
    )

    # ============================================================
    # HOLIDAYS & COMPANY OFF DAYS
    # ============================================================

    holidays_qs = PublicHoliday.objects.filter(
        company=company
    )

    holiday_map = {}
    company_off_days = {}

    for h in holidays_qs:

        # --------------------------------------------------------
        # WEEKLY COMPANY OFF DAY
        # --------------------------------------------------------

        if (
            h.holiday_type == "company_off_day"
            and h.off_day_weekday is not None
        ):
            company_off_days[
                h.off_day_weekday
            ] = (
                h.description or "Company Off"
            )

        # --------------------------------------------------------
        # PUBLIC / COMPANY HOLIDAY
        # --------------------------------------------------------

        elif h.date:
            holiday_map[
                h.date
            ] = (
                h.description or "Holiday"
            )

    # ============================================================
    # INITIAL VALUES
    # ============================================================

    total_days = (
        calculation_end_date - start_date
    ).days + 1

    working_days = Decimal("0")

    present_days = Decimal("0")

    # This represents all working days without normal attendance.
    #
    # IMPORTANT:
    # Paid attendance is also included here.
    #
    # Therefore:
    #
    # working_days = 9
    # paid days    = 3
    # present      = 0
    # absent       = 9
    #
    unswiped_days_till_today = Decimal("0")

    daily_records = []

    # ============================================================
    # ATTENDANCE
    # ============================================================

    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(
            start_date,
            calculation_end_date
        )
    ).select_related(
        "updated_by"
    )

    attendance_map = {}

    india_tz = pytz.timezone(
        "Asia/Kolkata"
    )

    utc_tz = pytz.UTC

    for a in attendances:

        sessions = (
            a.sessions
            .all()
            .order_by("time_in")
        )

        first_punch_in = None
        last_punch_out = None

        # ========================================================
        # FIRST / LAST SESSION
        # ========================================================

        if sessions.exists():

            first_session = sessions.first()
            last_session = sessions.last()

            # ====================================================
            # FIRST PUNCH IN
            # ====================================================

            if first_session.time_in:

                if isinstance(
                    first_session.time_in,
                    datetime
                ):
                    first_dt = (
                        first_session.time_in
                    )
                else:
                    first_dt = datetime.combine(
                        a.date,
                        first_session.time_in
                    )

                if first_dt.tzinfo is None:
                    first_dt = utc_tz.localize(
                        first_dt
                    )

                first_dt_ist = (
                    first_dt.astimezone(
                        india_tz
                    )
                )

                first_punch_in = (
                    first_dt_ist.strftime(
                        "%I:%M %p"
                    )
                )

            # ====================================================
            # LAST PUNCH OUT
            # ====================================================

            if last_session.time_out:

                if isinstance(
                    last_session.time_out,
                    datetime
                ):
                    last_dt = (
                        last_session.time_out
                    )
                else:
                    last_dt = datetime.combine(
                        a.date,
                        last_session.time_out
                    )

                if last_dt.tzinfo is None:
                    last_dt = utc_tz.localize(
                        last_dt
                    )

                last_dt_ist = (
                    last_dt.astimezone(
                        india_tz
                    )
                )

                last_punch_out = (
                    last_dt_ist.strftime(
                        "%I:%M %p"
                    )
                )

        # ========================================================
        # UPDATED BY
        # ========================================================

        updated_by = None
        updated_by_role = None

        if a.updated_by:

            updated_by = (
                a.updated_by.username
            )

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
        # UPDATED AT
        # ========================================================

        updated_at = None

        if a.updated_at:

            updated_at_dt = a.updated_at

            if updated_at_dt.tzinfo is None:
                updated_at_dt = utc_tz.localize(
                    updated_at_dt
                )

            updated_at_dt = (
                updated_at_dt.astimezone(
                    india_tz
                )
            )

            updated_at = (
                updated_at_dt.strftime(
                    "%d-%m-%Y %I:%M %p"
                )
            )

        # ========================================================
        # STORE ATTENDANCE DATA
        # ========================================================

        attendance_map[a.date] = {

            "hours": Decimal(
                a.total_hours or 0
            ),

            "first_punch_in": (
                first_punch_in
            ),

            "last_punch_out": (
                last_punch_out
            ),

            "attendance_type": (
                a.attendance_type
            ),

            "remark": a.remark,

            "updated_by": updated_by,

            "updated_by_role": (
                updated_by_role
            ),

            "updated_at": updated_at,
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
        from_date__lte=calculation_end_date,
        to_date__gte=start_date
    )

    approved_leave_dates = set()

    for leave in leave_requests:

        leave_start = max(
            leave.from_date,
            start_date
        )

        leave_end = min(
            leave.to_date,
            calculation_end_date
        )

        if isinstance(
            leave_start,
            datetime
        ):
            leave_start = leave_start.date()

        if isinstance(
            leave_end,
            datetime
        ):
            leave_end = leave_end.date()

        for i in range(
            (leave_end - leave_start).days + 1
        ):
            approved_leave_dates.add(
                leave_start + timedelta(days=i)
            )

    # ============================================================
    # MAIN CALENDAR LOOP
    # ============================================================

    for i in range(total_days):

        d = (
            start_date +
            timedelta(days=i)
        )

        weekday = d.weekday()

        # ========================================================
        # PUBLIC / COMPANY HOLIDAY
        # ========================================================

        if d in holiday_map:

            daily_records.append({

                "date": d,

                "status": holiday_map[d],

                "total_hours": 0,

                "first_punch_in": None,

                "last_punch_out": None,

                "attendance_type": None,

                "remark": None,

                "updated_by": None,

                "updated_by_role": None,

                "updated_at": None,
            })

            continue

        # ========================================================
        # WEEKLY COMPANY OFF DAY
        # ========================================================

        if weekday in company_off_days:

            daily_records.append({

                "date": d,

                "status": company_off_days[
                    weekday
                ],

                "total_hours": 0,

                "first_punch_in": None,

                "last_punch_out": None,

                "attendance_type": None,

                "remark": None,

                "updated_by": None,

                "updated_by_role": None,

                "updated_at": None,
            })

            continue

        # ========================================================
        # WORKING DAY
        # ========================================================

        working_days += Decimal("1")

        # ========================================================
        # DEFAULT VALUES
        # ========================================================

        status = "absent"

        hours = Decimal("0")

        first_punch_in = None

        last_punch_out = None

        attendance_type = None

        remark = None

        updated_by = None

        updated_by_role = None

        updated_at = None

        # ========================================================
        # APPROVED LEAVE
        # ========================================================

        if d in approved_leave_dates:

            status = "leave"

            # Leave is a working day, but it is not
            # counted as present.
            #
            # It is also not counted as LOP if the employee
            # has sufficient leave balance.
            #
            # We handle the leave adjustment after the loop.

            daily_records.append({

                "date": d,

                "status": status,

                "total_hours": 0,

                "first_punch_in": None,

                "last_punch_out": None,

                "attendance_type": None,

                "remark": None,

                "updated_by": None,

                "updated_by_role": None,

                "updated_at": None,
            })

            continue

        # ========================================================
        # ATTENDANCE EXISTS
        # ========================================================

        if d in attendance_dates:

            attendance_data = (
                attendance_map[d]
            )

            hours = (
                attendance_data["hours"]
            )

            first_punch_in = (
                attendance_data[
                    "first_punch_in"
                ]
            )

            last_punch_out = (
                attendance_data[
                    "last_punch_out"
                ]
            )

            attendance_type = (
                attendance_data[
                    "attendance_type"
                ]
            )

            remark = (
                attendance_data["remark"]
            )

            updated_by = (
                attendance_data[
                    "updated_by"
                ]
            )

            updated_by_role = (
                attendance_data[
                    "updated_by_role"
                ]
            )

            updated_at = (
                attendance_data[
                    "updated_at"
                ]
            )

            # ====================================================
            # PAID ATTENDANCE
            # ====================================================
            #
            # IMPORTANT:
            #
            # Paid attendance is NOT present.
            #
            # It remains an absent day.
            #
            # It will reduce LOP later.
            #
            # Example:
            #
            # Aug 20 -> paid -> absent
            # Aug 21 -> paid -> absent
            # Aug 22 -> paid -> absent
            #
            # present_days = 0
            # absent_days  = 9
            # paid_days    = 3
            # lop_days     = 9 - 3 = 6
            #
            # ====================================================

            if (
                attendance_type
                and attendance_type.lower() == "paid"
            ):

                status = "absent"

                # IMPORTANT:
                # Count paid day as absent for attendance
                # statistics.
                unswiped_days_till_today += Decimal("1")

            # ====================================================
            # TODAY + PUNCH IN
            # ====================================================

            elif (
                d == today
                and first_punch_in
                and not last_punch_out
            ):

                status = "active"

            # ====================================================
            # MISSED PUNCH OUT
            # ====================================================

            elif (
                first_punch_in
                and not last_punch_out
            ):

                status = "missed_punchout"

            # ====================================================
            # FULL DAY
            # ====================================================

            elif hours >= full_day_hours:

                status = "present"

                present_days += Decimal("1")

            # ====================================================
            # HALF DAY
            # ====================================================

            elif hours >= half_day_hours:

                status = "half_day"

                present_days += Decimal("0.5")

                unswiped_days_till_today += (
                    Decimal("0.5")
                )

            # ====================================================
            # ABSENT
            # ====================================================

            else:

                status = "absent"

                unswiped_days_till_today += (
                    Decimal("1")
                )

        # ========================================================
        # NO ATTENDANCE RECORD
        # ========================================================

        else:

            status = "absent"

            unswiped_days_till_today += (
                Decimal("1")
            )

        # ========================================================
        # DAILY RECORD
        # ========================================================

        daily_records.append({

            "date": d,

            "status": status,

            "total_hours": float(
                round(hours, 2)
            ),

            "first_punch_in": (
                first_punch_in
            ),

            "last_punch_out": (
                last_punch_out
            ),

            "attendance_type": (
                attendance_type
            ),

            "remark": remark,

            "updated_by": updated_by,

            "updated_by_role": (
                updated_by_role
            ),

            "updated_at": updated_at,
        })

    # ============================================================
    # APPROVED LEAVE ADJUSTMENT
    # ============================================================
    #
    # Approved leave should not become LOP when the employee
    # has sufficient leave balance.
    #
    # But approved leave is NOT added to present_days.
    #
    # ============================================================

    total_leave_balance = Decimal(
        employee.total_leave or 0
    )

    leave_adjustment = min(
        Decimal(len(approved_leave_dates)),
        total_leave_balance
    )

    # ============================================================
    # ABSENT DAYS
    # ============================================================
    #
    # IMPORTANT:
    #
    # Paid attendance is intentionally included in absent_days.
    #
    # Therefore:
    #
    # working_days = 9
    # paid_days    = 3
    # present_days = 0
    # absent_days  = 9
    #
    # ============================================================

    absent_days = max(
        working_days - present_days,
        Decimal("0")
    )

    # Remove approved leave from absent count if it is covered
    # by available leave balance.

    absent_days = max(
        absent_days - leave_adjustment,
        Decimal("0")
    )

    # ============================================================
    # PAID ATTENDANCE DAYS
    # ============================================================

    paid_attendance_days = Decimal("0")

    for attendance_date, attendance_data in attendance_map.items():

        # Only dates actually calculated.
        if (
            attendance_date < start_date
            or attendance_date > calculation_end_date
        ):
            continue

        attendance_type = (
            attendance_data.get(
                "attendance_type"
            )
        )

        if (
            attendance_type
            and attendance_type.lower() == "paid"
        ):

            paid_attendance_days += Decimal("1")

    # ============================================================
    # LOP
    # ============================================================
    #
    # EXACT RULE:
    #
    # LOP = absent_days - paid_days
    #
    # Example:
    #
    # absent_days = 9
    # paid_days   = 3
    #
    # LOP = 9 - 3
    #     = 6
    #
    # ============================================================

    lop_days = max(
        absent_days - paid_attendance_days,
        Decimal("0")
    )

    # ============================================================
    # RETURN
    # ============================================================

    return (
        int(working_days),

        float(present_days),

        float(absent_days),

        float(lop_days),

        daily_records
    )