from django.urls import path
from .views import (
    AttendanceSwipeView,AttendanceAdminListView,AttendanceDetailByDateView,AttendanceAdminDetailView,AddPunchOutNoteView,AttendanceLocationUpdateView,BackgroundLocationUpdateView,EmployeeAttendanceSummaryView
)

urlpatterns = [
    path('attendance/swipe/', AttendanceSwipeView.as_view(), name='attendance-swipe'),
    path('admin/attendance/', AttendanceAdminListView.as_view(), name='admin-attendance-list'),
    path('attendance/today/', AttendanceDetailByDateView.as_view(), name='attendance-today-detail'),
    path('admin/attendance/<int:id>/', AttendanceAdminDetailView.as_view(), name='attendance-detail'),
    path('attendance/add-note/', AddPunchOutNoteView.as_view(), name='attendance-add-note'),
    path('attendance/update-location/', AttendanceLocationUpdateView.as_view(), name='attendance-update-location'),
    path('background-location/<int:employee_id>/', BackgroundLocationUpdateView.as_view(), name='background-location'),
    path('summary/', EmployeeAttendanceSummaryView.as_view()),


]



