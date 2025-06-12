from django.urls import path
from superadmin import views

urlpatterns = [
    path('create-company/', views.CompanyCreateView.as_view(), name='create-company'),
    path('companies/list/', views.CompanyListView.as_view(), name='company-list'),           # GET (list)
    path('companies/<int:pk>/', views.CompanyDetailUpdateDeleteView.as_view(), name='company-detail'),   # GET, PUT, DELETE (detail)
]
