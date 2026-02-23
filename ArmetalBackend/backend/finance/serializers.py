from rest_framework import serializers
from .models import FinanceRecord,FinanceCategory

class FinanceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceCategory
        fields = "__all__"
class FinanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceRecord
        fields = "__all__"
