# Generated by Django 5.2.1 on 2025-06-11 05:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PublicHoliday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True)),
                ('description', models.CharField(max_length=255)),
                ('holiday_type', models.CharField(blank=True, choices=[('public', 'Public Holiday'), ('religious', 'Religious Holiday'), ('company', 'Company Holiday'), ('optional', 'Optional/Restricted Holiday'), ('bank', 'Bank Holiday'), ('regional', 'Cultural/Regional Holiday'), ('observance', 'Observance/Non-Leave Day')], max_length=20, null=True)),
            ],
        ),
    ]
