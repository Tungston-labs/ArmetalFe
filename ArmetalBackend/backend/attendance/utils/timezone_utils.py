import pytz

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
        company_tz = get_company_timezone(employee)

        if datetime_obj.tzinfo is None:
            datetime_obj = pytz.utc.localize(datetime_obj)

        localized = datetime_obj.astimezone(company_tz)
        return localized.strftime("%I:%M %p")

    except Exception as e:
        print("❌ Timezone conversion error:", str(e))
        return datetime_obj.strftime("%I:%M %p")    
