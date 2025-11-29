from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PublicHoliday
from .serializers import PublicHolidaySerializer
from user.permissions import IsHRAdmin, IsEmployee
from shared.pagination import CustomPagination
from rest_framework.views import APIView
from rest_framework.response import Response


class PublicHolidayCreateListView(generics.ListCreateAPIView):
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    pagination_class = CustomPagination

    def get_queryset(self):
        return PublicHoliday.objects.filter(
            company=self.request.user.company
        ).order_by("date")

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)


class PublicHolidayDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = "pk"

    def get_queryset(self):
        return PublicHoliday.objects.filter(company=self.request.user.company)


class PublicHolidayEmployeeListView(generics.ListAPIView):
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return (
            PublicHoliday.objects
            .filter(company=self.request.user.company)
            .exclude(holiday_type="company_off_day")
            .order_by("date")
        )


class HolidayTypeListView(APIView):
    def get(self, request):
        types = [
            {"key": key, "label": label}
            for key, label in PublicHoliday.HOLIDAY_TYPES
        ]
        return Response(types)
