import pytz
from datetime import datetime, time
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

COUNTRY_TIMEZONE_MAPPING = {
    "IN": "Asia/Kolkata",
    "AE": "Asia/Dubai",
    "US": "America/New_York",
    # Add other countries as needed
}
def convert_to_company_timezone(dt, employee):
    """Convert a datetime to the employee's company timezone."""
    if dt is None:
        return None
    try:
        tz = get_company_timezone(employee)
        dt = ensure_timezone(dt, pytz.UTC)
        return dt.astimezone(tz).strftime('%Y-%m-%d %H:%M:%S')  # Optional: format string
    except Exception as e:
        logger.error(f"Failed to convert to company timezone: {e}")
        return dt  # fallback as UTC


def safe_parse_datetime(dt_str):
    """Safely parse datetime string with multiple format support"""
    if isinstance(dt_str, datetime):
        return dt_str  # Already parsed

    if not isinstance(dt_str, str):
        raise ValueError("Input must be string or datetime")

    try:
        if dt_str.endswith('Z'):
            dt_str = dt_str[:-1] + '+00:00'
        return datetime.fromisoformat(dt_str)
    except ValueError:
        try:
            return datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%S")


def get_company_timezone(employee):
    """Get timezone with comprehensive error handling"""
    try:
        country = None
        if (hasattr(employee, 'department') and 
            employee.department and 
            hasattr(employee.department, 'company') and 
            employee.department.company):
            country = employee.department.company.country
        
        tz_name = COUNTRY_TIMEZONE_MAPPING.get(country, "Asia/Kolkata")
        return pytz.timezone(tz_name)
    except Exception as e:
        logger.error(f"Timezone detection failed: {e}")
        return pytz.timezone("Asia/Kolkata")

def ensure_timezone(dt, tz=None):
    """Ensure datetime has timezone, converting if needed"""
    if dt is None:
        return None
        
    if isinstance(dt, time):
        raise ValueError("Time objects not supported - use datetime")
    
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt, timezone=tz or pytz.UTC)
    return dt