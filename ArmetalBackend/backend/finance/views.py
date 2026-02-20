from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import FinanceRecord
from .serializers import FinanceRecordSerializer
from shared.pagination import CustomPagination
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsHRAdmin
from django.db.models import Sum
from rest_framework.response import Response



from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import FinanceRecord
from .serializers import FinanceRecordSerializer
from shared.pagination import CustomPagination




class FinanceRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = FinanceRecordSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "payment_type"]
    search_fields = ["note", "category", "payment_type"]

    # ---------------------------------------------------
    # QUERYSET (Company Based)
    # ---------------------------------------------------
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

    # ---------------------------------------------------
    # CREATE (Auto assign company)
    # ---------------------------------------------------
    def perform_create(self, serializer):
        user = self.request.user

        if getattr(user, "is_superadmin", False):
            serializer.save(company=None)
        else:
            serializer.save(company=user.company)

    # ---------------------------------------------------
    # LIST WITH FINANCIAL SUMMARY
    # ---------------------------------------------------
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        user = request.user

        # ---------- Summary Query ----------
        if getattr(user, "is_superadmin", False):
            summary_qs = FinanceRecord.objects.filter(company__isnull=True)
        else:
            summary_qs = FinanceRecord.objects.filter(company=user.company)

        # ---------- Calculations ----------
        total_income = summary_qs.filter(payment_type="IN").aggregate(
            total=Sum("amount")
        )["total"] or 0

        total_expense = summary_qs.filter(payment_type="OUT").aggregate(
            total=Sum("amount")
        )["total"] or 0

        cash_balance = total_income - total_expense

        # ---------- Pagination ----------
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)

            # Inject summary fields (no structure change)
            response.data["total_income"] = total_income
            response.data["total_expense"] = total_expense
            response.data["cash_balance"] = cash_balance

            return response

        serializer = self.get_serializer(queryset, many=True)

        return Response({
            "results": serializer.data,
            "total_income": total_income,
            "total_expense": total_expense,
            "cash_balance": cash_balance,
        })

class FinanceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FinanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "is_superadmin", False):
            return FinanceRecord.objects.all()

        return FinanceRecord.objects.filter(company=user.company)

