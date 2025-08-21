from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet, InvalidToken

fernet = Fernet(settings.ENCRYPTION_KEY)

class EncryptedCharField(models.CharField):
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        try:
            return fernet.decrypt(value.encode()).decode()
        except (InvalidToken, AttributeError):
            return value  # fallback if old plaintext data

    def get_prep_value(self, value):
        if value is None:
            return value
        return fernet.encrypt(value.encode()).decode()
