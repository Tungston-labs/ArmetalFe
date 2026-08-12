from django.urls import path
from .views import DashboardCountsView, ReimbursementCountsView,RecentEmployeesView,ContractExpiry30DaysView,SimpleNotificationsAPI,TodayEmployeeStatsAPI,HolidaySummaryAPI,ReimbursementMonthWiseAmountView,DepartmentDashboardSummaryView,ProjectEmployeeCountView
urlpatterns = [
 
    path('counts/', DashboardCountsView.as_view(), name='dashboard-counts'),
    path("today-employee-stats/", TodayEmployeeStatsAPI.as_view(), name="today-employee-stats"),

    path('reimbursement/counts/', ReimbursementCountsView.as_view(), name='reimbursement-counts'),
    path('reimbursement/monthwise/', ReimbursementMonthWiseAmountView.as_view(), name='reimbursement-monthwise'),
    path('department/',DepartmentDashboardSummaryView.as_view(),name='department-dashboard'),
    path('recentemployees/',RecentEmployeesView.as_view(),name='recent-employees'),
    path("contract-expiry/30-days/", ContractExpiry30DaysView.as_view(),name="contract-expiry-30-days"),
    path("simple-notifications/", SimpleNotificationsAPI.as_view(), name="simple-notifications"),
    path("holiday-summary/", HolidaySummaryAPI.as_view(), name="holiday-summary"),
    path('project/employee-count/',ProjectEmployeeCountView.as_view(),name='project-employee-count'),

]
