# backend/firebase.py
import firebase_admin
from firebase_admin import credentials, messaging

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body):
    if not token:
        return
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token
    )
    return messaging.send(message)
