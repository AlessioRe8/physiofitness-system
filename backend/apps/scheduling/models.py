from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel
from apps.patients.models import Patient
from django.core.exceptions import ValidationError

from clinic_backend.settings import AUTH_USER_MODEL


class Room(TimeStampedModel):
    """
    Represents a physical room or space in the clinic.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Service(TimeStampedModel):
    """
    Represents a type of treatment or service offered (e.g., 'Massage 30min').
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(help_text="Duration in minutes")
    price = models.DecimalField(max_digits=6, decimal_places=2, help_text="Price in EUR")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.duration_minutes} min) - €{self.price}"


class Appointment(TimeStampedModel):
    """
    The core appointment record linking Patient, Staff, Service, and Room.
    """

    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        NO_SHOW = 'NO_SHOW', 'No Show'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    therapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_appointments',
        limit_choices_to={'role': 'PHYSIO'}
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )

    notes = models.TextField(blank=True, help_text="Internal notes for the therapist")

    def __str__(self):
        return f"{self.patient} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"

    def clean(self):
        super().clean()

        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError({
                    'end_time': "End time must be after the start time."
                })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-start_time']