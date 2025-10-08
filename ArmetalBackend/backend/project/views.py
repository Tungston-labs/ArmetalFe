from rest_framework import generics,filters
from .models import Project
from project.serialzers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        # Return projects for the logged-in user's company
        return Project.objects.filter(company=self.request.user.company).prefetch_related('employees')

    def perform_create(self, serializer):
        # Automatically assign the logged-in user's company
        serializer.save(company=self.request.user.company)



# Retrieve, Update, Delete
class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
