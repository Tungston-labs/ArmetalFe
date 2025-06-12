from django.urls import path
from .views import (
    LeaveRequestCreateListView,
    LeaveRequestCancelView,
    LeaveRequestAdminListView,
    LeaveRequestAdminDetailView
)

urlpatterns = [
    path('leave/', LeaveRequestCreateListView.as_view(), name='leave-create-list'),  # Employee
    path('leave/<int:pk>/cancel/', LeaveRequestCancelView.as_view(), name='leave-cancel'),  # Employee cancel
    path('leave/admin/', LeaveRequestAdminListView.as_view(), name='leave-admin-list'),  # HR Admin list
    path('leave/admin/<int:pk>/', LeaveRequestAdminDetailView.as_view(), name='leave-admin-detail'),  # HR Admin actions
]
