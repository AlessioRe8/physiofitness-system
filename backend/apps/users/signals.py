from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import User
from apps.patients.models import Patient


@receiver(pre_save, sender=User)
def handle_role_change(sender, instance, **kwargs):
    """
    If a user is being updated and their role changes FROM 'PATIENT' TO something else,
    delete their Patient profile to keep the patient list clean.
    """
    if instance.pk:
        try:
            old_user = User.objects.get(pk=instance.pk)

            if old_user.role == User.Role.PATIENT and instance.role != User.Role.PATIENT:
                try:
                    patient_profile = Patient.objects.get(user=old_user)
                    patient_profile.delete()
                    print(
                        f"--- CLEANUP: Deleted Patient profile for {instance.email} (Upgraded to {instance.role}) ---")
                except Patient.DoesNotExist:
                    pass

        except User.DoesNotExist:
            pass