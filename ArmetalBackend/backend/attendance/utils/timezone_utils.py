import pytz
from datetime import time

country_to_timezone = {
    "IN": "Asia/Kolkata",
    "AE": "Asia/Dubai",
    "US": "America/New_York",
    "GB": "Europe/London",
    "SG": "Asia/Singapore",
    "DE": "Europe/Berlin",
    "AU": "Australia/Sydney",
}

def get_company_timezone(employee):
    try:
        print("🔍 department:", getattr(employee, 'department', None))
        print("🏢 company:", getattr(employee.department, 'company', None))
        print("🌍 country:", getattr(employee.department.company, 'country', None))

        country = (
            getattr(employee, 'department', None)
            and getattr(employee.department, 'company', None)
            and getattr(employee.department.company, 'country', None)
        )

        print("✅ Final Country:", country)

        tz_name = country_to_timezone.get(country, "UTC")
        return pytz.timezone(tz_name)

    except Exception as e:
        print("❌ Error getting company timezone:", e)
        return pytz.UTC
def convert_to_company_timezone(datetime_obj, employee):
    if not datetime_obj:
        return None

    try:
        # ✅ Prevent .time input error
        if isinstance(datetime_obj, time):
            print("⛔ ERROR: Passed a time object instead of datetime to convert_to_company_timezone()")
            return None  # or handle as needed

        company_tz = get_company_timezone(employee)

        if datetime_obj.tzinfo is None:
            datetime_obj = pytz.utc.localize(datetime_obj)

        localized = datetime_obj.astimezone(company_tz)

        # 🚨 Warn if this is being used in the wrong place
        import inspect
        caller = inspect.stack()[1].function
        if caller != 'get_time_in' and caller != 'get_time_out':
            print("⚠️ WARNING: convert_to_company_timezone() used outside serializer:", caller)

        return localized.strftime("%I:%M %p")

    except Exception as e:
        print("❌ Timezone conversion error:", str(e))
        return None

