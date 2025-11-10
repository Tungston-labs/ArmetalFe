from django.urls import re_path
from attendance import consumer

websocket_urlpatterns = [
    # Employee sends location updates
    re_path(r"^ws/live-location/(?P<employee_id>\d+)/$", consumer.LiveLocationConsumer.as_asgi()),

    # Admin watches live location of specific employee
    re_path(
        r"^ws/dashboard/location/(?P<employee_id>\d+)/$",
        consumer.AdminLiveLocationConsumer.as_asgi()
    ),
]
