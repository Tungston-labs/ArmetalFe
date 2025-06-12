from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PublicHoliday
from .serializers import PublicHolidaySerializer
from user.permissions import IsHRAdmin, IsEmployee

# HR Admin Views
class PublicHolidayCreateListView(generics.ListCreateAPIView):
    queryset = PublicHoliday.objects.all().order_by('date')
    serializer_class = PublicHolidaySerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]

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
