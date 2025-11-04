from django.db import models

class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    medical_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
