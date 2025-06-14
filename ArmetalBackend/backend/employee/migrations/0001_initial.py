# Generated by Django 5.2.1 on 2025-06-11 05:09

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('departments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmpBankPaymentModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(max_length=100)),
                ('swift_code', models.CharField(blank=True, max_length=20, null=True)),
                ('payment_mode', models.CharField(choices=[('online', 'Online'), ('cod', 'Cash on Delivery'), ('cheque', 'Cheque')], max_length=10)),
                ('account_number', models.CharField(max_length=30)),
                ('uan_epf_number', models.CharField(blank=True, max_length=30, null=True)),
                ('pan_number', models.CharField(max_length=15)),
                ('tax_regime', models.CharField(choices=[('old', 'Old Regime'), ('new', 'New Regime')], max_length=10)),
                ('tds_deduction_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('declaration_80c', models.BooleanField(default=False)),
                ('basic_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('salary_increment', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('document', models.FileField(blank=True, null=True, upload_to='bank_documents/')),
            ],
        ),
        migrations.CreateModel(
            name='Employee_db',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee_id', models.CharField(editable=False, max_length=20, unique=True)),
                ('password', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('profile_pic', models.ImageField(blank=True, null=True, upload_to='profile_pics/')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('address', models.TextField()),
                ('dob', models.DateField()),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=10)),
                ('designation', models.CharField(max_length=100)),
                ('joining_date', models.DateField(default=django.utils.timezone.now)),
                ('employment_type', models.CharField(choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract')], max_length=20)),
                ('passport_number', models.CharField(max_length=50)),
                ('iqama_number', models.CharField(max_length=50)),
                ('insurance_number', models.CharField(max_length=50)),
                ('visa_expiry_date', models.DateField()),
                ('department', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='employees', to='departments.department')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
