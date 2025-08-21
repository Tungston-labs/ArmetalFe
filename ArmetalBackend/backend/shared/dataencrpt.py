from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings

fernet = Fernet(settings.FERNET_KEY)

class EncryptedCharField(models.CharField):
    def get_prep_value(self, value):
        if value is not None:
            return fernet.encrypt(value.encode()).decode()
        return value

    def from_db_value(self, value, expression, connection):
        if value is not None:
            return fernet.decrypt(value.encode()).decode()
        return value
