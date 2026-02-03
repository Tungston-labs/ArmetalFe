
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import FinanceRecord
from .serializers import FinanceRecordSerializer
from shared.pagination import CustomPagination
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin



# ✅ CREATE + LIST
class FinanceRecordListCreateView(generics.ListCreateAPIView):
    queryset = FinanceRecord.objects.all().order_by("-created_at")
    serializer_class = FinanceRecordSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    pagination_class = CustomPagination

    # 🔍 Filters & Search
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ["category", "payment_type"]
    search_fields = ["note", "category", "payment_type"]


# ✅ RETRIEVE + UPDATE + DELETE
class FinanceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FinanceRecord.objects.all()
    serializer_class = FinanceRecordSerializer



