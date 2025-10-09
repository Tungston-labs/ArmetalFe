from django.urls import path
from .views import ProjectListCreateView, ProjectRetrieveUpdateDestroyView,EmployeesNotInProjectView

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'),
    path('<int:project_id>/employees-not-in-project/', EmployeesNotInProjectView.as_view(), name='employees-not-in-project'),
]
