import json
from channels.generic.websocket import AsyncWebsocketConsumer


# -----------------------------
# EMPLOYEE SIDE
# -----------------------------
class LiveLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.employee_id = self.scope['url_route']['kwargs'].get('employee_id')
        self.group_name = f"employee_{self.employee_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"📡 Employee {self.employee_id} connected to LiveLocationConsumer")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """Employee sends location updates"""
        data = json.loads(text_data)
        print(f"📨 Received from employee {self.employee_id}: {data}")

        latitude = data.get("latitude")
        longitude = data.get("longitude")
        timestamp = data.get("timestamp")

        # Broadcast location to admin(s) watching this employee
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_location",
                "latitude": latitude,
                "longitude": longitude,
                "timestamp": timestamp,
            },
        )

    async def send_location(self, event):
        """If any message comes back to employee socket, send it"""
        await self.send(json.dumps({
            "latitude": event["latitude"],
            "longitude": event["longitude"],
            "timestamp": event["timestamp"],
        }))


# -----------------------------
# ADMIN SIDE
# -----------------------------
class AdminLiveLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.employee_id = self.scope['url_route']['kwargs'].get('employee_id')
        self.group_name = f"employee_{self.employee_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"🧭 Admin connected to {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_location(self, event):
        """Receive broadcast from employee group"""
        await self.send(json.dumps({
            "latitude": event["latitude"],
            "longitude": event["longitude"],
            "timestamp": event["timestamp"],
        }))
