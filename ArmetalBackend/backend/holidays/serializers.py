from rest_framework import serializers
from .models import PublicHoliday

class PublicHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicHoliday
        fields = ['id', 'date', 'description']
