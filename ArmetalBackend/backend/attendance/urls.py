from django.urls import path
from .views import (
    AttendanceSwipeView,AttendanceAdminListView,AttendanceDetailByDateView,AttendanceAdminDetailView,AddPunchOutNoteView
)

urlpatterns = [
    path('attendance/swipe/', AttendanceSwipeView.as_view(), name='attendance-swipe'),
    path('admin/attendance/', AttendanceAdminListView.as_view(), name='admin-attendance-list'),
    path('attendance/today/', AttendanceDetailByDateView.as_view(), name='attendance-today-detail'),
    path('admin/attendance/<int:employee_id>/', AttendanceAdminDetailView.as_view()),
    path('attendance/add-note/', AddPunchOutNoteView.as_view(), name='attendance-add-note'),
]



