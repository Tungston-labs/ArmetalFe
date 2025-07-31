from django.urls import path
from .views import (
    AttendanceSwipeView,AttendanceAdminListView,TodayAttendanceDetailView,AttendanceAdminDetailView,AddPunchOutNoteView
)

urlpatterns = [
    path('attendance/swipe/', AttendanceSwipeView.as_view(), name='attendance-swipe'),
    path('admin/attendance/', AttendanceAdminListView.as_view(), name='admin-attendance-list'),
    path('attendance/today/', TodayAttendanceDetailView.as_view(), name='attendance-today-detail'),
    path('admin/attendance/<int:id>/', AttendanceAdminDetailView.as_view(), name='attendance-detail'),
    path('attendance/add-note/', AddPunchOutNoteView.as_view(), name='attendance-add-note'),
]



