from django.urls import path
from .views import (
    PublicHolidayCreateListView,
    PublicHolidayDetailUpdateDeleteView,
    PublicHolidayEmployeeListView
)

urlpatterns = [
    # HR Admin
    path('holidays/', PublicHolidayCreateListView.as_view(), name='holiday-create-list'),
    path('holidays/<int:pk>/', PublicHolidayDetailUpdateDeleteView.as_view(), name='holiday-detail'),

    # Employee
    path('holidays/employee/', PublicHolidayEmployeeListView.as_view(), name='holiday-employee-list'),
]
