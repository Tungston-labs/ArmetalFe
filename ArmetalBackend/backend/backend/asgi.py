import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup() 

from channels.routing import ProtocolTypeRouter, URLRouter


from django.core.asgi import get_asgi_application
import attendance.routing 

from shared.middleware.middleware import JWTAuthMiddlewareStack 

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(  # <-- Replaced AuthMiddlewareStack
        URLRouter(
            attendance.routing.websocket_urlpatterns
        )
    ),
})