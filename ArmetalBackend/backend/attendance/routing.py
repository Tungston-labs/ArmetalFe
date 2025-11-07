# attendance/routing.py
from django.urls import re_path
from attendance import consumer
websocket_urlpatterns = [
    # Employee connecting to send location (Current)
    re_path(r"ws/live-location/$", consumers.LiveLocationConsumer.as_asgi()), 
    # Admin connecting to view location for a specific employee ID
    re_path(r"ws/dashboard/location/(?P<employee_id>\d+)/$", consumers.LiveLocationConsumer.as_asgi()), 
]
