from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_appointment_confirmation_email(patient_email, patient_name, date_time, room_name):
    """
    Task to send an email notification when an appointment is created.
    This runs in the background (Celery worker), not in the user's browser.
    """
    subject = f"Appointment Confirmation - {date_time}"
    message = f"""
    Dear {patient_name},

    Your appointment has been successfully booked.

    When: {date_time}
    Where: {room_name}

    Please arrive 10 minutes early.

    Regards,
    PhysioFitness Clinic
    """

    # Send the email (In dev, this prints to console)
    send_mail(
        subject=subject,
        message=message,
        from_email='noreply@physiofitness.com',
        recipient_list=[patient_email],
        fail_silently=False,
    )

    return "Email Sent"