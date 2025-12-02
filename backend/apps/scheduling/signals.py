from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from .tasks import send_appointment_confirmation_email

@receiver(post_save, sender=Appointment)
def trigger_appointment_confirmation(sender, instance, created, **kwargs):
    """
    Listens for any Appointment being saved.
    If it's new (created) and has a patient email, trigger the Celery task.
    """
    if created and instance.patient.email:
        send_appointment_confirmation_email.delay(
            patient_email=instance.patient.email,
            patient_name=instance.patient.first_name,
            date_time=instance.start_time.strftime("%Y-%m-%d %H:%M"),
            room_name=instance.room.name if instance.room else "TBD"
        )
        print(f"--- Signal: Email task queued for {instance.patient.email} ---")