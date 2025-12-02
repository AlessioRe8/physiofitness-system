from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager  # <-- 1. ADD THIS IMPORT
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimeStampedModel


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, TimeStampedModel):
    """
    Custom User model. Uses email as the primary identifier.
    Username field is removed.
    """
    username = None

    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrator'
        PHYSIO = 'PHYSIO', 'Physiotherapist'
        RECEPTIONIST = 'RECEPTION', 'Receptionist'
        PATIENT = 'PATIENT', 'Patient'

    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.PATIENT,
        db_index=True
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class StaffProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    license_number = models.CharField(max_length=100, blank=True, help_text="Medical Board License ID")
    specialization = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    is_active_staff = models.BooleanField(default=True)

    def __str__(self):
        return f"Staff: {self.user.get_full_name()} - {self.specialization}"