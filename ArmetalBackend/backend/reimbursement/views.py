# reimbursements/views.py
from rest_framework import generics, permissions
from .models import Reimbursement
from .serializers import ReimbursementListSerializer, ReimbursementDetailSerializer
from user.permissions import IsHRorIsEmployee
from shared.pagination import CustomPagination

# --- List & Create for Employee ---
from .utils import send_reimbursement_email

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
        reimbursement = serializer.save(employee=self.request.user.employee_db)
        # 🚀 Send email after creating reimbursement
        send_reimbursement_email(reimbursement)


# --- Retrieve, Update, Delete single reimbursement ---
class ReimbursementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsHRorIsEmployee]
    serializer_class = ReimbursementDetailSerializer

    def get_queryset(self):
        # HR/Admins should see all reimbursements
        user = self.request.user
        if getattr(user, "is_hr_admin", False) or getattr(user, "is_superadmin", False):
            return Reimbursement.objects.all()
        return Reimbursement.objects.filter(employee__user=user)

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True  # allow partial update
        return self.update(request, *args, **kwargs)
# --- Retrieve, Update, Delete single reimbursement for logged-in employee ---
from rest_framework import generics, permissions
from .models import Reimbursement
from .serializers import ReimbursementDetailSerializer

class MyReimbursementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users
    serializer_class = ReimbursementDetailSerializer

    def get_queryset(self):
        # Only reimbursements belonging to the logged-in employee
        return Reimbursement.objects.filter(employee__user=self.request.user)

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True  # allow partial update
        return self.update(request, *args, **kwargs)





# --- List reimbursements by department ---
class DepartmentReimbursementListView(generics.ListAPIView):
    permission_classes = [IsHRorIsEmployee]
    pagination_class = CustomPagination
    serializer_class = ReimbursementListSerializer

    def get_queryset(self):
        department_id = self.kwargs.get("department_id")
        return Reimbursement.objects.filter(employee__department_id=department_id).order_by("-created_at")


from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reimbursement
from .serializers import ReimbursementListSerializer


class ReimbursementGroupedByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reimbursements = Reimbursement.objects.all().order_by("date")

        grouped_data = defaultdict(list)
        for r in reimbursements:
            grouped_data[str(r.date)].append(r)  # str() makes it JSON serializable

        result = []
        for date, items in grouped_data.items():
            result.append({
                "date": date,
                "reimbursements": ReimbursementListSerializer(items, many=True).data
            })

        return Response(result)
    


# --- List reimbursements for logged-in employee ---
from rest_framework import generics, permissions
from .models import Reimbursement
from .serializers import ReimbursementListSerializer
from shared.pagination import CustomPagination

class MyReimbursementListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users
    pagination_class = CustomPagination
    serializer_class = ReimbursementListSerializer

    def get_queryset(self):
        # Filter reimbursements for the logged-in employee
        return Reimbursement.objects.filter(employee__user=self.request.user).order_by("-created_at")
