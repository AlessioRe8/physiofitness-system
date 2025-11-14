from django.db import models

class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    medical_notes = models.TextField(blank=True)
    clinic = models.ForeignKey("core.Clinic", on_delete=models.CASCADE, related_name="patients", null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
