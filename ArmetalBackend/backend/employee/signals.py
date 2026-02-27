from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Employee_db

@receiver(post_delete, sender=Employee_db)
def auto_delete_empty_department(sender, instance, **kwargs):
    """
<<<<<<< HEAD
    Automatically delete department if the last employee is deleted.
    """
    department = instance.department
    if department and department.employees.count() == 0:
=======
    Automatically delete department if last employee is deleted.
    """
    department = instance.department
    if department and department.employee_db_set.count() == 0:
>>>>>>> d9c6bfea (leave count in dashboard)
        department.delete()
