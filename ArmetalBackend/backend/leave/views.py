from rest_framework import generics,status,filters
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from employee.models import Employee_db
from user.permissions import IsEmployee,IsHRAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from shared.pagination import CustomPagination

from django.core.mail import EmailMessage
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from leave.models import LeaveRequest
from leave.serializers import LeaveRequestSerializer
from shared.pagination import CustomPagination
from employee.models import Employee_db
from user.permissions import IsEmployee

from rest_framework.response import Response

class LeaveRequestCreateListView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id']
    pagination_class = CustomPagination

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Filter counts
        pending_count = queryset.filter(status='pending').count()
        lop_count = queryset.filter(leave_type='earned').count()  # or whatever leave type you count as LOP

        # Paginated list
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response({
            'leaves': serializer.data,
            'pending_leave_count': pending_count,
            'loss_of_pay_count': lop_count,
        })

    def perform_create(self, serializer):
        employee = Employee_db.objects.get(user=self.request.user)
        leave = serializer.save(employee=employee)

        subject = f"Leave Request from {employee.name}"
        message = (
            f"Dear Sir/Madam,\n\n"
            f"I am writing to formally request leave as per the following details:\n\n"
            f"Leave Type : {leave.leave_type.title()}\n"
            f"From       : {leave.from_date.strftime('%d-%m-%Y')}\n"
            f"To         : {leave.to_date.strftime('%d-%m-%Y')}\n"
            f"Reason     : {leave.reason}\n\n"
            f"Regards,\n"
            f"{employee.name}\n"
            f"{employee.designation}\n"
            f"{employee.email}"
        )

        to_email = [leave.to_email]
        cc_emails = [leave.cc_email] if leave.cc_email else []

        try:
            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=employee.email,
                to=to_email,
                cc=cc_emails,
            )
            email.send(fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {e}")


from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class LeaveRequestCancelView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee__user=self.request.user, status='pending')

    def delete(self, request, *args, **kwargs):
        try:
            leave = self.get_queryset().get(pk=kwargs['pk'])
            leave.delete()
            # ✅ Return 204 with no content (important)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except LeaveRequest.DoesNotExist:
            return Response({"detail": "Pending leave not found."}, status=status.HTTP_404_NOT_FOUND)

# HR:


from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from leave.models import LeaveRequest
from leave.serializers import LeaveRequestSerializer
from shared.pagination import CustomPagination
from user.permissions import IsHRAdmin

class LeaveRequestAdminListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['employee__name']
    ordering_fields = ['from_date', 'to_date']
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        company = user.company

        if not company:
            return LeaveRequest.objects.none()

        return LeaveRequest.objects.filter(
            employee__department__company=company
        ).order_by('-created_at')  # optional: sort newest first




class LeaveRequestAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsHRAdmin]
    lookup_field = 'pk'

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

class LeaveByStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status = request.query_params.get('status')  # ?status=pending

        if not status:
            return Response({"error": "Leave status is required as a query parameter."}, status=400)

        try:
            employee = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        leaves = LeaveRequest.objects.filter(employee=employee, status=status)
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from employee.models import Employee_db
from leave.models import LeaveRequest

class LeaveSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employee = Employee_db.objects.get(user=request.user)
        except Employee_db.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

        pending_count = LeaveRequest.objects.filter(employee=employee, status='pending').count()
        approved_count = LeaveRequest.objects.filter(employee=employee, status='approved').count()

        return Response({
            "employee_name": employee.name,
            "profile_pic": employee.profile_pic.url if employee.profile_pic else None,
            "pending_count": pending_count,
            "approved_count": approved_count
        })
class LeaveRequestEmpDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsEmployee]
    lookup_field = 'pk'