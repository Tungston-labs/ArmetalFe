from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import FinanceRecord
from .serializers import FinanceRecordSerializer
from shared.pagination import CustomPagination
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin



class FinanceRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = FinanceRecordSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "payment_type"]
    search_fields = ["note", "category", "payment_type"]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "is_superadmin", False):
            return FinanceRecord.objects.filter(
                company__isnull=True
            ).order_by("-created_at")

        if user.company:
            return FinanceRecord.objects.filter(
                company=user.company
            ).order_by("-created_at")

        return FinanceRecord.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if getattr(user, "is_superadmin", False):
            serializer.save(company=None)

        else:
            serializer.save(company=user.company)


class FinanceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FinanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "is_superadmin", False):
            return FinanceRecord.objects.all()

        return FinanceRecord.objects.filter(company=user.company)

