from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.conf import settings

class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display() if hasattr(self, 'get_role_display') else 'User'})"

    @property
    def role(self):
        if self.groups.exists():
            return self.groups.first().name
        return "No role"

    @property
    def staff_role(self):
        if hasattr(self, "profile"):
            return self.profile.role
        return None

class StaffProfile(models.Model):
        ROLE_CHOICES = [
            ("Admin", "Administrator"),
            ("Physiotherapist", "Physiotherapist"),
            ("Trainer", "Trainer"),
            ("Receptionist", "Receptionist"),
        ]

        user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
        role = models.CharField(max_length=50, choices=ROLE_CHOICES)
        phone = models.CharField(max_length=20, blank=True, null=True)

        def __str__(self):
            return f"{self.user.username} - {self.role}"