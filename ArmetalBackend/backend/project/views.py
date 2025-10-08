from rest_framework import generics
from .models import Project
from project.serialzers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated

# List & Create
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

# Retrieve, Update, Delete
class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('employees')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
