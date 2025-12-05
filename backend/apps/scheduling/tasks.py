from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import Appointment


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


@shared_task
def send_appointment_reminders():
    """
    Periodic task: Checks for appointments starting in the next 24 hours
    that haven't received a reminder yet.
    """
    now = timezone.now()
    time_window = now + timedelta(days=1)

    upcoming_appointments = Appointment.objects.filter(
        start_time__lte=time_window,
        start_time__gt=now,
        reminder_sent=False,
        status__in=['SCHEDULED', 'CONFIRMED']
    )

    count = 0
    for appointment in upcoming_appointments:
        if appointment.patient.email:
            # 1. Send the email
            subject = "Reminder: Your appointment is tomorrow!"
            message = f"""
            Hello {appointment.patient.first_name},

            This is a friendly reminder for your appointment tomorrow.

            When: {appointment.start_time.strftime("%Y-%m-%d %H:%M")}
            Where: {appointment.room.name if appointment.room else "Clinic"}

            See you soon!
            PhysioFitness Clinic
            """

            send_mail(
                subject=subject,
                message=message,
                from_email='noreply@physiofitness.com',
                recipient_list=[appointment.patient.email],
                fail_silently=False,
            )

            appointment.reminder_sent = True
            appointment.save()
            count += 1

    return f"Sent {count} reminders."