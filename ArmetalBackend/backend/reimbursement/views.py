# reimbursements/views.py
from rest_framework import generics, permissions
from .models import Reimbursement
from .serializers import ReimbursementListSerializer, ReimbursementDetailSerializer
from user.permissions import IsHRorIsEmployee
from shared.pagination import CustomPagination

# --- List & Create for Employee ---
class ReimbursementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsHRorIsEmployee]
    pagination_class = CustomPagination

    def get_queryset(self):
        return Reimbursement.objects.filter(employee__user=self.request.user).order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReimbursementListSerializer
        return ReimbursementDetailSerializer

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee_db)

# --- Retrieve, Update, Delete single reimbursement ---
class ReimbursementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsHRorIsEmployee]
    serializer_class = ReimbursementDetailSerializer

    def get_queryset(self):
        user = self.request.user
        # Adjust these checks to match your actual User model fields
        if getattr(user, "is_hr_admin", False) or getattr(user, "is_superadmin", False):
            return Reimbursement.objects.all()
        return Reimbursement.objects.filter(employee__user=user)




# --- List reimbursements by department ---
class DepartmentReimbursementListView(generics.ListAPIView):
    permission_classes = [IsHRorIsEmployee]
    pagination_class = CustomPagination
    serializer_class = ReimbursementListSerializer

    def get_queryset(self):
        department_id = self.kwargs.get("department_id")
        return Reimbursement.objects.filter(employee__department_id=department_id).order_by("-created_at")
