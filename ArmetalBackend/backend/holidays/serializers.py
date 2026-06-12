from rest_framework import serializers
from .models import PublicHoliday

class PublicHolidaySerializer(serializers.ModelSerializer):
    holiday_type_display = serializers.SerializerMethodField()
    off_day_weekday = serializers.IntegerField(
    required=False,
    allow_null=True
)

    class Meta:
        model = PublicHoliday
        fields = [
            'id',
            'description',
            'holiday_type',
            'holiday_type_display',
            'date',
            'day',  
            'off_day_weekday',
        ]

    def get_holiday_type_display(self, obj):
        return obj.get_holiday_type_display()
