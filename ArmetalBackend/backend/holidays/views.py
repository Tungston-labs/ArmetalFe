from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PublicHoliday
from .serializers import PublicHolidaySerializer
from user.permissions import IsHRAdmin, IsEmployee

# HR Admin Views


class PublicHolidayCreateListView(generics.ListCreateAPIView):
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]

    def get_queryset(self):
        return PublicHoliday.objects.filter(company=self.request.user.company).order_by('date')

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)


class PublicHolidayDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PublicHoliday.objects.all()
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

# Employee View
class PublicHolidayEmployeeListView(generics.ListAPIView):
    queryset = PublicHoliday.objects.all().order_by('date')
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsEmployee]




# list types
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PublicHoliday

class HolidayTypeListView(APIView):
    def get(self, request):
        types = [ {"key": key, "label": label} for key, label in PublicHoliday.HOLIDAY_TYPES ]
        return Response(types)
