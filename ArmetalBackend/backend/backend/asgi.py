import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from attendance.middleware import JWTAuthMiddleware  # ✅ custom JWT middleware
import attendance.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(  # ✅ use JWT instead of session-based auth
        URLRouter(attendance.routing.websocket_urlpatterns)
    ),
})
