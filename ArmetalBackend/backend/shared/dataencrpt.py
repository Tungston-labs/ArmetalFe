from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings

fernet = Fernet(settings.FERNET_KEY)


class EncryptedMixin:
    """
    Mixin for encrypted fields.
    Handles encryption before saving and decryption after fetching.
    """

    def get_prep_value(self, value):
        if value is not None:
            return fernet.encrypt(str(value).encode()).decode()
        return value

    def from_db_value(self, value, expression, connection):
        if value is not None:
            return fernet.decrypt(value.encode()).decode()
        return value

    def to_python(self, value):
        # Called when assigning value to model instance
        if value is not None and isinstance(value, str):
            try:
                # Try decrypting in case the value comes from DB
                return fernet.decrypt(value.encode()).decode()
            except Exception:
                # If already decrypted (or plain string), return as is
                return value
        return value


class EncryptedCharField(EncryptedMixin, models.CharField):
    pass


class EncryptedTextField(EncryptedMixin, models.TextField):
    pass


class EncryptedEmailField(EncryptedMixin, models.EmailField):
    pass


class EncryptedIntegerField(EncryptedMixin, models.PositiveIntegerField):
    def get_prep_value(self, value):
        if value is not None:
            return fernet.encrypt(str(int(value)).encode()).decode()
        return value

    def from_db_value(self, value, expression, connection):
        if value is not None:
            return int(fernet.decrypt(value.encode()).decode())
        return value

    def to_python(self, value):
        if value is not None:
            try:
                return int(fernet.decrypt(value.encode()).decode())
            except Exception:
                return int(value) if value != "" else None
        return value
