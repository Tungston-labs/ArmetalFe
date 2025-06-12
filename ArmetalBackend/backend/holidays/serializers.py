from rest_framework import serializers
from .models import PublicHoliday

class PublicHolidaySerializer(serializers.ModelSerializer):
    holiday_type_display = serializers.SerializerMethodField()

    class Meta:
        model = PublicHoliday
        fields = ['id', 'description', 'holiday_type', 'holiday_type_display', 'date']

    def get_holiday_type_display(self, obj):
        return obj.get_holiday_type_display()
