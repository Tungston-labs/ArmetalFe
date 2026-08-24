# from datetime import timedelta, datetime, date
# from decimal import Decimal
# import pytz

# from attendance.models import Attendance
# from leave.models import LeaveRequest
# from holidays.models import PublicHoliday


# def build_employee_month_calendar(employee, start_date, end_date):

#     today = date.today()

#     # ---------- Company Settings ----------
#     company = employee.department.company

#     full_day_hours = Decimal(company.working_hours_per_day)
#     half_day_hours = Decimal(company.half_day_hours)

#     # ---------- Holidays & Weekly Off ----------
#     holidays_qs = PublicHoliday.objects.filter(
#         company=company
#     )

#     holiday_map = {}
#     company_off_days = {}

#     for h in holidays_qs:

#         # Weekly Off (Sunday, Friday, etc.)
#         if (
#             h.holiday_type == "company_off_day"
#             and h.off_day_weekday is not None
#         ):
#             company_off_days[h.off_day_weekday] = (
#                 h.description or "Company Off"
#             )

#         # Public / Company Holiday
#         elif h.date:
#             holiday_map[h.date] = (
#                 h.description or "Holiday"
#             )

#     # ---------- Full Month ----------
#     total_days_full_month = (end_date - start_date).days + 1

#     working_days = 0
#     present_days = Decimal("0")
#     unswiped_days_till_today = Decimal("0")

#     daily_records = []

#     # ---------- Attendance ----------
#     attendances = Attendance.objects.filter(
#         employee=employee,
#         date__range=(start_date, today)
#     )

#     attendance_map = {}

#     india_tz = pytz.timezone("Asia/Kolkata")
#     utc_tz = pytz.UTC

#     for a in attendances:
#         sessions = a.sessions.all().order_by("time_in")

#         first_punch_in = None
#         last_punch_out = None

#         if sessions.exists():
#             first_session = sessions.first()
#             last_session = sessions.last()

#             if first_session.time_in:
#                 first_dt = first_session.time_in

#                 # Ensure timezone aware
#                 if first_dt.tzinfo is None:
#                     first_dt = utc_tz.localize(first_dt)

#                 first_punch_in = (
#                     first_dt.astimezone(india_tz)
#                     .strftime("%I:%M %p")
#                 )

#             if last_session.time_out:
#                 last_dt = last_session.time_out

#                 if last_dt.tzinfo is None:
#                     last_dt = utc_tz.localize(last_dt)

#                 last_punch_out = (
#                     last_dt.astimezone(india_tz)
#                     .strftime("%I:%M %p")
#                 )

#         attendance_map[a.date] = {
#             "hours": Decimal(a.total_hours or 0),
#             "first_punch_in": first_punch_in,
#             "last_punch_out": last_punch_out,
#         }

#     attendance_dates = set(attendance_map.keys())

#     # ---------- Approved Leaves ----------
#     leave_requests = LeaveRequest.objects.filter(
#         employee=employee,
#         status="approved",
#         from_date__lte=today,
#         to_date__gte=start_date
#     )

#     approved_leave_dates = {}

#     for leave in leave_requests:

#         start = max(leave.from_date, start_date)
#         end = min(leave.to_date, today)

#         if isinstance(start, datetime):
#             start = start.date()

#         if isinstance(end, datetime):
#             end = end.date()

#         total_days = (end - start).days + 1

#         for i in range(total_days):

#             current_date = start + timedelta(days=i)

#             leave_amount = Decimal("1")

#             # ---------------------------------------------
#             # Single-day half-day leave
#             # ---------------------------------------------
#             if (
#                 leave.from_date == leave.to_date
#                 and leave.from_date_type in ["morning", "afternoon"]
#                 and leave.to_date_type in ["morning", "afternoon"]
#             ):
#                 leave_amount = Decimal("0.5")

#             # ---------------------------------------------
#             # First day of multi-day leave
#             # ---------------------------------------------
#             elif current_date == leave.from_date:

#                 if leave.from_date_type in ["morning", "afternoon"]:
#                     leave_amount = Decimal("0.5")

#             # ---------------------------------------------
#             # Last day of multi-day leave
#             # ---------------------------------------------
#             elif current_date == leave.to_date:

#                 if leave.to_date_type in ["morning", "afternoon"]:
#                     leave_amount = Decimal("0.5")

#             approved_leave_dates[current_date] = (
#                 approved_leave_dates.get(
#                     current_date,
#                     Decimal("0")
#                 ) + leave_amount
#             )

#     # ---------- Main Loop ----------
#     for i in range(total_days_full_month):

#         d = start_date + timedelta(days=i)
#         weekday = d.weekday()

#         # ---------- Holiday ----------
#         if d in holiday_map:

#             if d <= today:
#                 daily_records.append({
#                     "date": d,
#                     "status": holiday_map[d],
#                     "total_hours": 0,
#                     "first_punch_in": None,
#                     "last_punch_out": None,
#                 })

#             continue

#         # ---------- Weekly Off ----------
#         if weekday in company_off_days:

#             if d <= today:
#                 daily_records.append({
#                     "date": d,
#                     "status": company_off_days[weekday],
#                     "total_hours": 0,
#                     "first_punch_in": None,
#                     "last_punch_out": None,
#                 })

#             continue

#         # ---------- Working Day ----------
#         working_days += 1

#         if d > today:
#             continue

#         status = "absent"
#         hours = Decimal("0")
#         first_punch_in = None
#         last_punch_out = None

#         # ---------- Approved Leave ----------
#         if d in approved_leave_dates:

#             status = "leave"
#             unswiped_days_till_today += 1

#         # ---------- Attendance ----------
#         elif d in attendance_dates:

#             attendance_data = attendance_map[d]

#             hours = attendance_data["hours"]
#             first_punch_in = attendance_data["first_punch_in"]
#             last_punch_out = attendance_data["last_punch_out"]

#             if d == today and first_punch_in:

#                 status = "active"

#             elif first_punch_in and not last_punch_out:

#                 status = "missed_punchout"

#                 if hours >= full_day_hours:
#                     present_days += 1

#                 elif hours >= half_day_hours:
#                     present_days += Decimal("0.5")
#                     unswiped_days_till_today += Decimal("0.5")

#                 else:
#                     unswiped_days_till_today += 1

#             elif hours >= full_day_hours:

#                 status = "present"
#                 present_days += 1

#             elif hours >= half_day_hours:

#                 status = "half_day"
#                 present_days += Decimal("0.5")
#                 unswiped_days_till_today += Decimal("0.5")

#             else:

#                 status = "absent"
#                 unswiped_days_till_today += 1

#         # ---------- No Swipe ----------
#         else:

#             status = "absent"
#             unswiped_days_till_today += 1

#         daily_records.append({
#             "date": d,
#             "status": status,
#             "total_hours": float(round(hours, 2)),
#             "first_punch_in": first_punch_in,
#             "last_punch_out": last_punch_out,
#         })

#     # ---------- Leave Adjustment ----------
#     total_leave_balance = Decimal(
#         employee.total_leave or 0
#     )

#     leave_adjustment = min(
#         Decimal(len(approved_leave_dates)),
#         total_leave_balance
#     )

#     real_absent_days = (
#         Decimal(unswiped_days_till_today)
#         - leave_adjustment
#     )

#     lop_days = max(real_absent_days, Decimal("0"))
#     absent_days = max(real_absent_days, Decimal("0"))

#     return (
#         working_days,
#         float(present_days),
#         float(absent_days),
#         float(lop_days),
#         daily_records
#     )


from datetime import timedelta, datetime, date
from decimal import Decimal
import pytz

from attendance.models import Attendance
from leave.models import LeaveRequest
from holidays.models import PublicHoliday


def build_employee_month_calendar(
    employee,
    start_date,
    end_date
):

    today = date.today()

    # =========================================================
    # COMPANY SETTINGS
    # =========================================================

    company = employee.department.company

    full_day_hours = Decimal(
        company.working_hours_per_day
    )

    half_day_hours = Decimal(
        company.half_day_hours
    )

    # =========================================================
    # HOLIDAYS & WEEKLY OFF
    # =========================================================

    holidays_qs = PublicHoliday.objects.filter(
        company=company
    )

    holiday_map = {}
    company_off_days = {}

    for h in holidays_qs:

        # -----------------------------------------------------
        # Weekly Off
        # -----------------------------------------------------

        if (
            h.holiday_type == "company_off_day"
            and h.off_day_weekday is not None
        ):

            company_off_days[
                h.off_day_weekday
            ] = (
                h.description
                or "Company Off"
            )

        # -----------------------------------------------------
        # Public / Company Holiday
        # -----------------------------------------------------

        elif h.date:

            holiday_map[h.date] = (
                h.description
                or "Holiday"
            )

    # =========================================================
    # MONTH CALCULATION
    # =========================================================

    total_days_full_month = (
        end_date - start_date
    ).days + 1

    working_days = Decimal("0")

    present_days = Decimal("0")

    # Only elapsed working days without attendance/leave
    unswiped_days_till_today = Decimal("0")

    daily_records = []

    # =========================================================
    # ATTENDANCE
    # =========================================================

    # Don't query attendance for future dates.
    attendance_end_date = min(
        end_date,
        today
    )

    attendances = Attendance.objects.filter(
        employee=employee,
        date__range=(
            start_date,
            attendance_end_date
        )
    ).prefetch_related(
        "sessions"
    )

    attendance_map = {}

    india_tz = pytz.timezone(
        "Asia/Kolkata"
    )

    utc_tz = pytz.UTC

    for attendance in attendances:

        sessions = (
            attendance.sessions
            .all()
            .order_by("time_in")
        )

        first_punch_in = None
        last_punch_out = None

        if sessions.exists():

            first_session = sessions.first()
            last_session = sessions.last()

            # -------------------------------------------------
            # First Punch In
            # -------------------------------------------------

            if first_session.time_in:

                first_dt = (
                    first_session.time_in
                )

                # Make timezone aware
                if first_dt.tzinfo is None:

                    first_dt = (
                        utc_tz.localize(
                            first_dt
                        )
                    )

                first_punch_in = (
                    first_dt
                    .astimezone(india_tz)
                    .strftime("%I:%M %p")
                )

            # -------------------------------------------------
            # Last Punch Out
            # -------------------------------------------------

            if last_session.time_out:

                last_dt = (
                    last_session.time_out
                )

                if last_dt.tzinfo is None:

                    last_dt = (
                        utc_tz.localize(
                            last_dt
                        )
                    )

                last_punch_out = (
                    last_dt
                    .astimezone(india_tz)
                    .strftime("%I:%M %p")
                )

        attendance_map[
            attendance.date
        ] = {

            "hours": Decimal(
                attendance.total_hours or 0
            ),

            "first_punch_in":
                first_punch_in,

            "last_punch_out":
                last_punch_out,
        }

    attendance_dates = set(
        attendance_map.keys()
    )

    # =========================================================
    # APPROVED LEAVES
    # =========================================================

    # Dictionary instead of set.
    #
    # Example:
    #
    # {
    #     2026-08-17: Decimal("0.5"),
    #     2026-08-18: Decimal("1")
    # }
    #
    approved_leave_dates = {}

    leave_requests = LeaveRequest.objects.filter(
        employee=employee,
        status="approved",

        # Leave starts before/end of selected month
        from_date__lte=end_date,

        # Leave ends after/start of selected month
        to_date__gte=start_date
    )

    for leave in leave_requests:

        # -----------------------------------------------------
        # Limit leave to selected month
        # -----------------------------------------------------

        start = max(
            leave.from_date,
            start_date
        )

        end = min(
            leave.to_date,
            end_date,
            today
        )

        if isinstance(
            start,
            datetime
        ):
            start = start.date()

        if isinstance(
            end,
            datetime
        ):
            end = end.date()

        # Nothing to process
        if start > end:
            continue

        total_leave_days = (
            end - start
        ).days + 1

        # -----------------------------------------------------
        # Each date of the leave
        # -----------------------------------------------------

        for i in range(
            total_leave_days
        ):

            current_date = (
                start
                + timedelta(days=i)
            )

            leave_amount = Decimal("1")

            # =================================================
            # SINGLE DAY LEAVE
            # =================================================

            if (
                leave.from_date
                == leave.to_date
            ):

                if (
                    leave.from_date_type
                    in [
                        "morning",
                        "afternoon"
                    ]
                ):

                    leave_amount = (
                        Decimal("0.5")
                    )

            # =================================================
            # FIRST DAY OF MULTI-DAY LEAVE
            # =================================================

            elif (
                current_date
                == leave.from_date
            ):

                if (
                    leave.from_date_type
                    in [
                        "morning",
                        "afternoon"
                    ]
                ):

                    leave_amount = (
                        Decimal("0.5")
                    )

            # =================================================
            # LAST DAY OF MULTI-DAY LEAVE
            # =================================================

            elif (
                current_date
                == leave.to_date
            ):

                if (
                    leave.to_date_type
                    in [
                        "morning",
                        "afternoon"
                    ]
                ):

                    leave_amount = (
                        Decimal("0.5")
                    )

            # =================================================
            # SAVE LEAVE AMOUNT
            # =================================================

            approved_leave_dates[
                current_date
            ] = (
                approved_leave_dates.get(
                    current_date,
                    Decimal("0")
                )
                + leave_amount
            )

    # =========================================================
    # MAIN CALENDAR LOOP
    # =========================================================

    for i in range(
        total_days_full_month
    ):

        d = (
            start_date
            + timedelta(days=i)
        )

        weekday = d.weekday()

        # =====================================================
        # PUBLIC HOLIDAY
        # =====================================================

        if d in holiday_map:

            # Only return records up to today
            if d <= today:

                daily_records.append({

                    "date": d,

                    "status":
                        holiday_map[d],

                    "total_hours": 0,

                    "first_punch_in":
                        None,

                    "last_punch_out":
                        None,
                })

            continue

        # =====================================================
        # COMPANY WEEKLY OFF
        # =====================================================

        if weekday in company_off_days:

            if d <= today:

                daily_records.append({

                    "date": d,

                    "status":
                        company_off_days[
                            weekday
                        ],

                    "total_hours": 0,

                    "first_punch_in":
                        None,

                    "last_punch_out":
                        None,
                })

            continue

        # =====================================================
        # WORKING DAY
        # =====================================================

        working_days += Decimal("1")

        # -----------------------------------------------------
        # Don't generate attendance status for future dates
        # -----------------------------------------------------

        if d > today:
            continue

        status = "absent"

        hours = Decimal("0")

        first_punch_in = None

        last_punch_out = None

        # =====================================================
        # APPROVED LEAVE
        # =====================================================

        if d in approved_leave_dates:

            leave_amount = (
                approved_leave_dates[d]
            )

            # -------------------------------------------------
            # Full-day leave
            # -------------------------------------------------

            if leave_amount >= Decimal("1"):

                status = "leave"

            # -------------------------------------------------
            # Half-day leave
            # -------------------------------------------------

            else:

                status = "half_day_leave"

            # -------------------------------------------------
            # IMPORTANT:
            #
            # Approved leave is NOT absence.
            #
            # Therefore:
            #
            # DON'T increment
            # unswiped_days_till_today
            #
            # DON'T increment
            # absent_days
            #
            # DON'T increment
            # lop_days
            # -------------------------------------------------

            daily_records.append({

                "date": d,

                "status": status,

                "total_hours": 0,

                "first_punch_in":
                    None,

                "last_punch_out":
                    None,
            })

            continue

        # =====================================================
        # ATTENDANCE
        # =====================================================

        elif d in attendance_dates:

            attendance_data = (
                attendance_map[d]
            )

            hours = (
                attendance_data[
                    "hours"
                ]
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

            # -------------------------------------------------
            # TODAY - ACTIVE
            # -------------------------------------------------

            if (
                d == today
                and first_punch_in
            ):

                status = "active"

            # -------------------------------------------------
            # MISSED PUNCH OUT
            # -------------------------------------------------

            elif (
                first_punch_in
                and not last_punch_out
            ):

                status = (
                    "missed_punchout"
                )

                if (
                    hours
                    >= full_day_hours
                ):

                    present_days += (
                        Decimal("1")
                    )

                elif (
                    hours
                    >= half_day_hours
                ):

                    present_days += (
                        Decimal("0.5")
                    )

                    unswiped_days_till_today += (
                        Decimal("0.5")
                    )

                else:

                    unswiped_days_till_today += (
                        Decimal("1")
                    )

            # -------------------------------------------------
            # FULL DAY PRESENT
            # -------------------------------------------------

            elif (
                hours
                >= full_day_hours
            ):

                status = "present"

                present_days += (
                    Decimal("1")
                )

            # -------------------------------------------------
            # HALF DAY PRESENT
            # -------------------------------------------------

            elif (
                hours
                >= half_day_hours
            ):

                status = "half_day"

                present_days += (
                    Decimal("0.5")
                )

                unswiped_days_till_today += (
                    Decimal("0.5")
                )

            # -------------------------------------------------
            # INSUFFICIENT HOURS
            # -------------------------------------------------

            else:

                status = "absent"

                unswiped_days_till_today += (
                    Decimal("1")
                )

        # =====================================================
        # NO ATTENDANCE
        # =====================================================

        else:

            status = "absent"

            unswiped_days_till_today += (
                Decimal("1")
            )

        # =====================================================
        # DAILY RECORD
        # =====================================================

        daily_records.append({

            "date": d,

            "status": status,

            "total_hours": float(
                round(hours, 2)
            ),

            "first_punch_in":
                first_punch_in,

            "last_punch_out":
                last_punch_out,
        })

    # =========================================================
    # ABSENT / LOP CALCULATION
    # =========================================================

    # Approved leaves have already been excluded from
    # unswiped_days_till_today.
    #
    # Therefore DO NOT subtract employee.total_leave here.
    #
    # employee.total_leave represents leave balance and should
    # be calculated separately.

    real_absent_days = (
        unswiped_days_till_today
    )

    lop_days = max(
        real_absent_days,
        Decimal("0")
    )

    absent_days = max(
        real_absent_days,
        Decimal("0")
    )

    # =========================================================
    # RETURN
    # =========================================================

    return (
        float(working_days),

        float(present_days),

        float(absent_days),

        float(lop_days),

        daily_records
    )