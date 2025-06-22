from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Company
from .serializers import CompanyCreateSerializer
from .permissions import IsSuperAdmin
from rest_framework import generics, filters
from rest_framework import serializers
from .models import CompanySubscription
from calendar import month_name



class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superadmin
    

#  create companies 

class CompanyCreateView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]



#  List all companies
class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'company_id', 'contact_number', 'address']  # Customize as needed


#  Retrieve, Update, Delete a company
class CompanyDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]


    
# subscriptions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.timezone import now
from .models import CompanySubscription
from superadmin.serializers import CompanySubscriptionSerializer
from calendar import monthrange
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView

class CompanySubscriptionListCreateView(APIView):
    """
    GET: Return all 12 months for a company/year (generate missing).
    POST: Not used (autogenerate on GET).
    """
    def get(self, request, company_id, year=None):
        year = year or now().year
        company = Company.objects.get(id=company_id)

        subs = []
        for m in range(1, 13):
            obj, created = CompanySubscription.objects.get_or_create(
                company=company,
                month=m,
                year=year,
                defaults={}
            )
            subs.append(obj)

        serializer = CompanySubscriptionSerializer(subs, many=True)
        return Response(serializer.data)


class MarkSubscriptionPaidView(UpdateAPIView):
    queryset = CompanySubscription.objects.all()
    serializer_class = CompanySubscriptionSerializer
    permission_classes = [IsAuthenticated,IsSuperAdmin]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'paid'
        instance.paid_date = now().date()
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)



    

