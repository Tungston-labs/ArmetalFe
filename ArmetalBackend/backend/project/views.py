from rest_framework import generics,filters
from .models import Project
from project.serialzers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name']

    def get_queryset(self):
        user_company = self.request.user.company
        # Filter projects where any employee belongs to the same company
        return Project.objects.filter(
            employees__department__company=user_company
        ).prefetch_related('employees').distinct()


# Retrieve, Update, Delete
class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
