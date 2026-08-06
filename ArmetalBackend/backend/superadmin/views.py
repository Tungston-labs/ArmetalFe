from calendar import month_name, monthrange

from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404, render
from django.template.loader import render_to_string
from django.utils.timezone import now

from rest_framework import filters, generics, permissions, serializers, status
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from employee.models import Employee_db

from user.permissions import IsSuperAdmin

from superadmin.models import (
    Company,
    CompanySubscription,
    SubscriptionPlan,SubscriptionFeature
)

from superadmin.serializers import (
    CompanyCreateSerializer,
    CompanyListSerializer,
    CompanySelfUpdateSerializer,
    CompanySubscriptionSerializer,
    CompanySubscriptionActionSerializer,
    SubscriptionPlanSerializer,
    SubscriptionReminderSerializer,
    SubscriptionReminderSimpleSerializer,SubscriptionFeatureSerializer
)

from superadmin.management.commands.subscriptions import (
    get_billable_employee_count,
)

from superadmin.management.commands.subscription_service import (
    SubscriptionService,
)

from superadmin.management.commands.subscription_email_service import (
    SubscriptionEmailService,
)


# permission class

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superadmin
    

#  create companies 

class CompanyCreateView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]



#  List all companies
class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'company_id', 'contact_number', 'address']  # Customize as needed


#  Retrieve, Update, Delete a company
class CompanyDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsSuperAdmin]


    
# create and list subscriptions for a company

class CompanySubscriptionListCreateView(APIView):

    def get(self, request, company_id, year=None):
        year = year or now().year

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=404
            )

        subs = []

        for m in range(1, 13):

            obj, created = CompanySubscription.objects.get_or_create(
                company=company,
                month=m,
                year=year,
                defaults={
                    "amount": 0,
                    "employee_count": 0,
                    "amount_per_employee": company.amount_per_employee,
                }
            )

            # Update only while subscription is unpaid
            if obj.status == "unpaid":

                employee_count = get_billable_employee_count(
                    company,
                    m,
                    year
                )

                obj.employee_count = employee_count
                obj.amount_per_employee = company.amount_per_employee
                obj.amount = employee_count * company.amount_per_employee
                obj.save()

            subs.append(obj)

        serializer = CompanySubscriptionSerializer(subs, many=True)

        return Response({
            "company": {
                "id": company.id,
                "company_id": company.company_id,
                "name": company.name,
                "address": company.address,
                "location": company.location,
                "country": company.country,
                "contact_number": company.contact_number,
                "email": company.email,
                "employee_count": Employee_db.objects.filter(
                    department__company=company,
                    is_deleted=False
                ).count(),                "amount_per_employee": company.amount_per_employee,
                "currency": subs[0].currency if subs else "AED",
                "today": now().date(),
            },
            "subscriptions": serializer.data
        })

class MarkSubscriptionPaidView(UpdateAPIView):
    queryset = CompanySubscription.objects.all()
    serializer_class = CompanySubscriptionSerializer
    permission_classes = [IsAuthenticated,IsSuperAdmin]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'paid'
        instance.paid_date = now().date()
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    



class SendInvoiceEmailView(APIView):
    def post(self, request):
        entry = request.data.get("entry")
        company_id = request.data.get("company_id")  # <-- change here

        if not entry or not company_id:
            return Response({"error": "Missing required fields"}, status=400)

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"error": "Company not found"}, status=404)

        html_content = render_to_string("invoice_template.html", {
            "entry": entry,
            "company": company.name
        })

        email = EmailMessage(
            subject=f"Invoice for {entry['month_display']} {entry['year']}",
            body=html_content,
            from_email=None,
            to=[company.email]
        )
        email.content_subtype = "html"

        try:
            email.send()
            return Response({"message": "Email sent successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)




class CompanyOverviewView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanyListSerializer(companies, many=True, context={'request': request})

        # Find unpaid companies based on their latest subscription
        unpaid_companies = []
        for company in companies:
            latest_sub = company.subscriptions.order_by('-year', '-month').first()
            if latest_sub and latest_sub.status == "unpaid":
                unpaid_companies.append(company)

        unpaid_serializer = CompanyListSerializer(unpaid_companies, many=True, context={'request': request})

        data = {
            "total_companies": companies.count(),
            "unpaid_companies_count": len(unpaid_companies),
            "companies": serializer.data,
            "unpaid_companies": unpaid_serializer.data,
        }
        return Response(data)



class CompanySelfView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = request.user.company
        serializer = CompanySelfUpdateSerializer(company)
        return Response(serializer.data)

    def put(self, request):
        company = request.user.company
        serializer = CompanySelfUpdateSerializer(
            company,
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        company = request.user.company
        serializer = CompanySelfUpdateSerializer(
            company,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class CompanySubscriptionStatusAPIView(APIView):

    permission_classes = [
        IsSuperAdmin
    ]


    def post(self, request):


        serializer = (
            CompanySubscriptionActionSerializer(
                data=request.data
            )
        )


        serializer.is_valid(
            raise_exception=True
        )


        company_id = (
            serializer.validated_data[
                "company_id"
            ]
        )


        action = (
            serializer.validated_data[
                "action"
            ]
        )


        company = Company.objects.get(
            id=company_id
        )


        if action == "freeze":


            users = (
                SubscriptionService
                .freeze_company(company)
            )


            return Response(
                {
                    "message":
                    "Company frozen successfully",

                    "users_frozen":
                    users
                }
            )



        if action == "unfreeze":


            users = (
                SubscriptionService
                .unfreeze_company(company)
            )


            return Response(
                {
                    "message":
                    "Company unfreezed successfully",

                    "users_activated":
                    users
                }
            )
        



class SendSubscriptionReminderAPIView(APIView):

    permission_classes = [IsSuperAdmin]

    def post(self, request):

        serializer = SubscriptionReminderSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        company = get_object_or_404(
            Company,
            id=serializer.validated_data["company_id"]
        )

        SubscriptionEmailService.send_subscription_email(company)

        return Response(
            {
                "message": "Subscription reminder email sent successfully."
            },
            status=status.HTTP_200_OK
        )
    




class SendSubscriptionReminderMailAPIView(APIView):

    permission_classes = [IsSuperAdmin]

    def post(self, request):
        serializer = SubscriptionReminderSimpleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = get_object_or_404(
            Company,
            id=serializer.validated_data["company_id"]
        )

        SubscriptionEmailService.send_reminder_email(
            company=company,
            extra_email=serializer.validated_data.get("email")
        )

        return Response(
            {
                "message": "Reminder email sent successfully."
            },
            status=status.HTTP_200_OK
        )
    


#  plan module




class SubscriptionFeatureCreateListAPIView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        queryset = SubscriptionFeature.objects.all()

        serializer = SubscriptionFeatureSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = SubscriptionFeatureSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Feature created successfully.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class SubscriptionFeatureRetrieveUpdateDeleteAPIView(APIView):
    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        return get_object_or_404(
            SubscriptionFeature,
            pk=pk
        )

    def get(self, request, pk):
        serializer = SubscriptionFeatureSerializer(
            self.get_object(pk)
        )

        return Response(serializer.data)

    def put(self, request, pk):
        feature = self.get_object(pk)

        serializer = SubscriptionFeatureSerializer(
            feature,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Feature updated successfully.",
                "data": serializer.data
            }
        )

    def delete(self, request, pk):
        self.get_object(pk).delete()

        return Response(
            {
                "message": "Feature deleted successfully."
            }
        )


from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer


class SubscriptionPlanCreateListAPIView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        queryset = SubscriptionPlan.objects.prefetch_related(
            "features"
        )

        serializer = SubscriptionPlanSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = SubscriptionPlanSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Subscription plan created successfully.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class SubscriptionPlanRetrieveUpdateDeleteAPIView(APIView):
    permission_classes = [IsSuperAdmin]

    def get_object(self, pk):
        return get_object_or_404(
            SubscriptionPlan,
            pk=pk
        )

    def get(self, request, pk):
        serializer = SubscriptionPlanSerializer(
            self.get_object(pk)
        )

        return Response(serializer.data)

    def put(self, request, pk):
        plan = self.get_object(pk)

        serializer = SubscriptionPlanSerializer(
            plan,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Subscription plan updated successfully.",
                "data": serializer.data
            }
        )

    def delete(self, request, pk):
        self.get_object(pk).delete()

        return Response(
            {
                "message": "Subscription plan deleted successfully."
            }
        )