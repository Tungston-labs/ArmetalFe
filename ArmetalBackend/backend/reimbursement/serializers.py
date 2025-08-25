# reimbursements/serializers.py
from rest_framework import serializers
from .models import Reimbursement, ReimbursementImage
from employee.models import Employee_db, Department

# --- Image Serializer ---
class ReimbursementImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReimbursementImage
        fields = ["id", "image"]


# --- LIST Serializer (for grouped API) ---
class ReimbursementListSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.name", read_only=True)
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
    designation = serializers.CharField(source="employee.designation", read_only=True)
    department = serializers.SerializerMethodField()

    class Meta:
        model = Reimbursement
        fields = [
            "id",
            "employee_name",
            "employee_id",
            "designation",
            "department",
            "amount",
            "status",
        ]

    def get_department(self, obj):
        dept = obj.employee.department
        if dept:
            return {
                "id": dept.id,
                "name": dept.name,
                "hr_name": dept.department_head.name if dept.department_head else None,
            }
        return None



# --- DETAIL Serializer (for single reimbursement details) ---
class ReimbursementDetailSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.name", read_only=True)
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
    job_position = serializers.CharField(source="employee.job_position", read_only=True)
    department = serializers.SerializerMethodField()
    images = ReimbursementImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Reimbursement
        fields = [
            "id",
            "employee_name",
            "employee_id",
            "job_position",
            "department",
            "expense_category",
            "to_mail",
            "note",
            "date",
            "amount",
            "status",
            "images",
            "uploaded_images",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["employee"]

    def get_department(self, obj):
        dept = obj.employee.department
        if dept:
            return {
                "id": dept.id,
                "name": dept.name,
                "hr_name": dept.department_head.name if dept.department_head else None,
            }
        return None

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        reimbursement = Reimbursement.objects.create(**validated_data)
        for img in uploaded_images:
            ReimbursementImage.objects.create(reimbursement=reimbursement, image=img)
        return reimbursement

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        instance = super().update(instance, validated_data)
        for img in uploaded_images:
            ReimbursementImage.objects.create(reimbursement=instance, image=img)
        return instance
    
class ReimbursementGroupedSerializer(serializers.Serializer):
    date = serializers.DateField()
    reimbursements = ReimbursementListSerializer(many=True)