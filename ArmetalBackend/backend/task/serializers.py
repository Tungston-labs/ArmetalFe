# tasks/serializers.py
from rest_framework import serializers
from .models import DailyTask

class DailyTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTask
        fields = '__all__'
        read_only_fields = ['employee', 'created', 'modified']
