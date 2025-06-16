from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Company
from .serializers import CompanyCreateSerializer
from .permissions import IsSuperAdmin
from rest_framework import generics, filters



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

    

