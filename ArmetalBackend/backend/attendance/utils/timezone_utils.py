import pytz
from datetime import time,timezone

import logging
logger = logging.getLogger(__name__)


# Country to timezone mapping (expanded)
COUNTRY_TIMEZONE_MAPPING = {
    "IN": "Asia/Kolkata",
    "AE": "Asia/Dubai",
    "US": "America/New_York",
    "GB": "Europe/London",
    "SG": "Asia/Singapore",
    "DE": "Europe/Berlin",
    "AU": "Australia/Sydney",
    # Add more countries as needed
}

def get_company_timezone(employee):
    """
    Get timezone based on employee's company country
    Falls back to Asia/Kolkata if country not found or invalid
    """
    try:
        # Safely traverse the relationships
        country = None
        if hasattr(employee, 'department') and employee.department:
            if hasattr(employee.department, 'company') and employee.department.company:
                country = getattr(employee.department.company, 'country', None)
        
        logger.debug(f"Country detected: {country}")
        
        # Get timezone from country or default to Asia/Kolkata
        tz_name = COUNTRY_TIMEZONE_MAPPING.get(country, "Asia/Kolkata")
        return pytz.timezone(tz_name)
        
    except Exception as e:
        logger.error(f"Error getting timezone: {str(e)}")
        return pytz.timezone("Asia/Kolkata")  # Default fallback

def convert_to_company_timezone(datetime_obj, employee, return_str=False):
    """
    Convert datetime to company timezone
    Handles both naive and aware datetimes
    """
    if not datetime_obj:
        return None

    try:
        if isinstance(datetime_obj, time):
            logger.error("Received time object instead of datetime")
            return None

        company_tz = get_company_timezone(employee)
        
        # Handle naive datetimes
        if timezone.is_naive(datetime_obj):
            datetime_obj = timezone.make_aware(datetime_obj, timezone=pytz.UTC)
        
        localized = datetime_obj.astimezone(company_tz)
        
        return localized.strftime("%I:%M %p") if return_str else localized
        
    except Exception as e:
        logger.error(f"Timezone conversion failed: {str(e)}")
        return None