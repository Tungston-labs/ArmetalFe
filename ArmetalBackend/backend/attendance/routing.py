from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/live-location/", consumers.LiveLocationConsumer.as_asgi()),
]
