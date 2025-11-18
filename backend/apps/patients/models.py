from django.db import models
from apps.core.models import TimeStampedModel


class Patient(TimeStampedModel):
    """
    Represents a patient in the clinic.
    Acts as a simple Electronic Health Record (EHR).
    """
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    fiscal_code = models.CharField(max_length=16, unique=True, help_text="Tax ID")

    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)

    insurance_provider = models.CharField(max_length=100, blank=True, help_text="Insurance company name")
    insurance_policy_number = models.CharField(max_length=100, blank=True)

    medical_history = models.TextField(blank=True, help_text="Past surgeries, chronic conditions, etc.")
    allergies = models.TextField(blank=True, help_text="List of known allergies")

    is_active = models.BooleanField(default=True, help_text="Uncheck if patient is archived")

    def __str__(self):
        return f"{self.last_name}, {self.first_name} ({self.fiscal_code})"

    class Meta:
        ordering = ['last_name', 'first_name']