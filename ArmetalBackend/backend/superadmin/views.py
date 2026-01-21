from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Company
from .serializers import CompanyCreateSerializer,CompanyListSerializer
from .permissions import IsSuperAdmin
from rest_framework import generics, filters
from rest_framework import serializers
from .models import CompanySubscription
from calendar import month_name



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


    
# subscriptions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.timezone import now
from superadmin.serializers import CompanySubscriptionSerializer
from calendar import monthrange
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from .models import Company, CompanySubscription
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

class CompanySubscriptionListCreateView(APIView):
    """
    GET: Return all 12 months for a company/year (generate missing).
    POST: Not used (autogenerate on GET).
    """

    def get(self, request, company_id, year=None):
        year = year or now().year
        company = Company.objects.get(id=company_id)

        subs = []
        for m in range(1, 13):
            obj, created = CompanySubscription.objects.get_or_create(
                company=company,
                month=m,
                year=year
            )

            # Always recalc and update amount/currency
            rate, currency = obj.get_rate_per_employee_and_currency()
            obj.amount = round(company.number_of_employees * rate, 2)
            obj.currency = currency

            if obj.status == 'paid' and not obj.paid_date:
                obj.paid_date = now().date()

            obj.save()

            subs.append(obj)


        serializer = CompanySubscriptionSerializer(subs, many=True)
        return Response(serializer.data)



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

# views/company_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Company
from .serializers import CompanySelfUpdateSerializer

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
