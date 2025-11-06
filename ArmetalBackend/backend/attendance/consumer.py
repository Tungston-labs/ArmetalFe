# attendance/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import AttendanceSession

class LiveLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close()
        else:
            await self.accept()
            print(f"📡 {user.username} connected for live location updates")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            session_id = data.get("session_id")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            timestamp = data.get("timestamp")

            if not session_id or latitude is None or longitude is None:
                await self.send(json.dumps({"error": "Invalid payload"}))
                return

            await self.update_location(session_id, latitude, longitude, timestamp)
            await self.send(json.dumps({"status": "ok"}))

        except Exception as e:
            await self.send(json.dumps({"error": str(e)}))

    @sync_to_async
    def update_location(self, session_id, lat, lon, ts):
        """Update the latest known coordinates for this attendance session"""
        try:
            session = AttendanceSession.objects.get(id=session_id)
            session.last_latitude = lat
            session.last_longitude = lon
            session.last_location_time = ts
            session.save(update_fields=["last_latitude", "last_longitude", "last_location_time"])
        except AttendanceSession.DoesNotExist:
            print(f"⚠️ Session {session_id} not found")
