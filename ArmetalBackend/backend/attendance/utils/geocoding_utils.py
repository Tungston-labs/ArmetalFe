from asgiref.sync import sync_to_async
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

@sync_to_async
def get_location_name(latitude, longitude):
    """Reverse geocode coordinates into a human-readable address with diagnostics."""
    geolocator = Nominatim(user_agent="armetal-tracker-app")


    try:
        print(f"🛰️ Attempting reverse geocode for {latitude}, {longitude}")
        location = geolocator.reverse(
            (latitude, longitude),
            exactly_one=True,
            timeout=10
        )
        if location and location.address:
            print(f"✅ Geocoding success: {location.address}")
            return location.address
        else:
            print("⚠️ No address returned, fallback to lat/lon")
            return f"Lat: {latitude}, Lon: {longitude}"

    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"🌐 Geocoder service error: {e}")
        return f"Lat: {latitude}, Lon: {longitude}"

    except Exception as e:
        print(f"❌ Unexpected Geocoding Error: {e}")
        return f"Lat: {latitude}, Lon: {longitude}"
