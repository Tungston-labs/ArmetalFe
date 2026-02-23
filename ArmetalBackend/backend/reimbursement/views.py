from rest_framework import generics, permissions
from .models import Reimbursement
from .serializers import ReimbursementListSerializer, ReimbursementDetailSerializer
from user.permissions import IsHRorIsEmployee
from shared.pagination import CustomPagination
from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import send_reimbursement_email
from finance.models import FinanceRecord

# --- List & Create for Employee ---

class ReimbursementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsHRorIsEmployee]
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user

        if user.is_hr or user.is_admin:   #  check HR/Admin role properly
            return Reimbursement.objects.filter(
                employee__department__company=user.company
            ).order_by("-created_at")

        # Employee case: only their reimbursements
        return Reimbursement.objects.filter(
            employee__user=user
        ).order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReimbursementListSerializer
        return ReimbursementDetailSerializer

    def perform_create(self, serializer):
        reimbursement = serializer.save(
            employee=self.request.user.employee_db
        )

       



# --- Retrieve, Update, Delete single reimbursement ---
from rest_framework import generics
from rest_framework.response import Response
from django.db import transaction
from .models import Reimbursement
from finance.models import FinanceRecord,FinanceCategory
from .serializers import ReimbursementDetailSerializer


class ReimbursementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsHRorIsEmployee]
    serializer_class = ReimbursementDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "is_hr_admin", False) or getattr(user, "is_superadmin", False):
            return Reimbursement.objects.all()
        return Reimbursement.objects.filter(employee__user=user)

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status

        response = self.partial_update(request, *args, **kwargs)

        instance.refresh_from_db()
        new_status = instance.status

        #  Create finance record ONLY when status changes to Approved
        if old_status != "Approve" and new_status == "Approve":
            employee = instance.employee
            company = employee.department.company

            employee_name = getattr(employee, "name", str(employee))
            employee_id = getattr(employee, "employee_id", employee.id)

            # Prevent duplicate finance records (company-wise)
            reimbursement_category, _ = FinanceCategory.objects.get(
                name="reimbursement",
                payment_type="OUT",
                company=company
            )

            exists = FinanceRecord.objects.filter(
                company=company,
                date=instance.date,
                amount=instance.amount,
                category=reimbursement_category,
                note__icontains=str(employee_id)
            ).exists()

            if not exists:
                FinanceRecord.objects.create(
                    company=company,
                    date=instance.date,
                    amount=instance.amount,
                    payment_type="OUT",
                    category=reimbursement_category,
                    note=f"Reimbursement approved for {employee_name} ({employee_id})"
                )


        return response



# --- Retrieve, Update, Delete single reimbursement for logged-in employee ---

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




class ReimbursementGroupedByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ✅ HR/Admin: reimbursements of all employees in their company
        if hasattr(user, "company"):  
            reimbursements = Reimbursement.objects.filter(
                employee__department__company=user.company
            ).order_by("date")
        else:
            # ✅ Employee: only their own reimbursements
            reimbursements = Reimbursement.objects.filter(
                employee__user=user
            ).order_by("date")

        grouped_data = defaultdict(list)
        for r in reimbursements:
            grouped_data[str(r.date)].append(r)

        result = []
        for date, items in grouped_data.items():
            result.append({
                "date": date,
                "reimbursements": ReimbursementListSerializer(
                    items, many=True, context={"request": request}  # 👈 FIXED
                ).data
            })

        return Response(result)


# --- List reimbursements for logged-in employee ---


class MyReimbursementListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users
    pagination_class = CustomPagination
    serializer_class = ReimbursementListSerializer

    def get_queryset(self):
        # Filter reimbursements for the logged-in employee
        return Reimbursement.objects.filter(employee__user=self.request.user).order_by("-created_at")
