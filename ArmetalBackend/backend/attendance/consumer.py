import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import timedelta
from django.utils import timezone

from .models import HourlyLocationLog
from .utils.geocoding_utils import get_location_name
from employee.models import Employee_db


# ------------------------------------------------------------
# 🕒 Function to log hourly location
# ------------------------------------------------------------
@sync_to_async
def log_hourly_location(employee_id, latitude, longitude, location_name):
    """Checks if 1 hour has passed since the last log and saves a new entry."""
    print(f"DIAGNOSTIC: Attempting to find Employee with ID: {employee_id}")

    try:
        employee = Employee_db.objects.get(id=employee_id)
    except Employee_db.DoesNotExist:
        print(f"❌ Employee {employee_id} not found in DB.")
        return False
    except Exception as e:
        print(f"CRITICAL DB ERROR: {e}")
        return False

    try:
        last_log = (
            HourlyLocationLog.objects.filter(employee=employee)
            .order_by("-logged_at")
            .first()
        )
        one_hour_ago = timezone.now() - timedelta(hours=1)

        if not last_log or last_log.logged_at < one_hour_ago:
            HourlyLocationLog.objects.create(
                employee=employee,
                latitude=latitude,
                longitude=longitude,
                location_name=location_name,
            )
            print(f"✅ Logged hourly location for Employee {employee_id} at {location_name}")
            return True

        print(f"⏳ Skipped logging — last entry < 1 hour old.")
        return False

    except Exception as e:
        print(f"CRITICAL ERROR during hourly logging: {e}")
        return False


# ------------------------------------------------------------
# 👷 EMPLOYEE SIDE - Sends location updates to the server
# ------------------------------------------------------------
class LiveLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.employee_id = self.scope["url_route"]["kwargs"].get("employee_id")
        self.group_name = f"employee_{self.employee_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"📡 Employee {self.employee_id} connected to LiveLocationConsumer")

    async def disconnect(self, close_code):
        print(f"🔌 Employee {self.employee_id} disconnected.")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """Receives coordinates from employee device and broadcasts to admins."""
        try:
            data = json.loads(text_data)
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            timestamp = data.get("timestamp")

            if latitude is None or longitude is None:
                print("⚠️ Missing coordinates in employee data.")
                return

            try:
                employee_id = int(self.employee_id)
            except (ValueError, TypeError):
                print("⚠️ Invalid employee_id in scope.")
                return

            # ✅ Get readable location name
            location_name = await get_location_name(latitude, longitude)

            # ✅ Log hourly location
            await log_hourly_location(employee_id, latitude, longitude, location_name)

            # ✅ Broadcast update to admins in same group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "send_location_to_admin",
                    "latitude": latitude,
                    "longitude": longitude,
                    "timestamp": timestamp or timezone.now().isoformat(),
                    "location_name": location_name,
                },
            )

        except json.JSONDecodeError:
            print("❌ Failed to decode JSON from employee.")
        except Exception as e:
            print(f"CRITICAL ERROR in LiveLocationConsumer.receive: {e}")

    async def send_location_to_admin(self, event):
        """Forward the same event to all connections in this group (admins included)."""
        await self.send(json.dumps(event))


# ------------------------------------------------------------
# 🧭 ADMIN SIDE - Listens for updates from employees
# ------------------------------------------------------------
class AdminLiveLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.employee_id = self.scope["url_route"]["kwargs"].get("employee_id")
        self.group_name = f"employee_{self.employee_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"🧭 Admin connected to {self.group_name}")

    async def disconnect(self, close_code):
        print(f"🔌 Admin disconnected from {self.group_name}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_location_to_admin(self, event):
        """Receives broadcast from employee consumer and forwards to frontend."""
        await self.send(json.dumps({
            "latitude": event["latitude"],
            "longitude": event["longitude"],
            "timestamp": event["timestamp"],
            "location_name": event["location_name"],
        }))
