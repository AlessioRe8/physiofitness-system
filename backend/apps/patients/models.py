from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel
from datetime import date


class Patient(TimeStampedModel):
    """
    Represents a patient in the clinic.
    Acts as a simple Electronic Health Record (EHR).
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patient_profile'
    )

    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    tax_id = models.CharField(max_length=50, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

    email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)

    insurance_provider = models.CharField(max_length=100, blank=True, help_text="Insurance company name")
    insurance_policy_number = models.CharField(max_length=100, blank=True)

    medical_history = models.TextField(blank=True, help_text="Past surgeries, chronic conditions, etc.")
    allergies = models.TextField(blank=True, help_text="List of known allergies")

    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text="Uncheck if patient is archived")

    distance_from_clinic = models.FloatField(default=5.0, help_text="Distance in KM")
    no_show_history = models.IntegerField(default=0, help_text="Number of past missed appointments")

    @property
    def age(self):
        if not self.date_of_birth:
            return 30
        today = date.today()
        return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"

    class Meta:
        ordering = ['last_name', 'first_name']