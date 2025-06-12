from rest_framework import generics,status
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class LeaveRequestCreateListView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user)

    def perform_create(self, serializer):
        employee = Employee_db.objects.get(user=self.request.user)
        serializer.save(employee=employee)

class LeaveRequestCancelView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user, status='pending')

    def delete(self, request, *args, **kwargs):
        try:
            leave = self.get_queryset().get(pk=kwargs['pk'])
            leave.delete()
            return Response({"detail": "Leave request canceled."}, status=status.HTTP_204_NO_CONTENT)
        except LeaveRequest.DoesNotExist:
            return Response({"detail": "Pending leave not found."}, status=status.HTTP_404_NOT_FOUND)


# HR:


from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class LeaveRequestAdminListView(generics.ListAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']  # filter by status using ?status=pending
    search_fields = ['employee__name']  # allow name search if needed
    ordering_fields = ['from_date', 'to_date']



class LeaveRequestAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

