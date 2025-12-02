from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.patients.models import Patient
from apps.scheduling.models import Appointment, Room, Service
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class AppointmentPermissionTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@test.com', password='password123', role='ADMIN'
        )
        self.physio_user = User.objects.create_user(
            email='physio@test.com', password='password123', role='PHYSIO'
        )
        self.patient_user = User.objects.create_user(
            email='patient@test.com', password='password123', role='PATIENT'
        )

        self.patient_profile = Patient.objects.create(
            user=self.patient_user,
            first_name="John", last_name="Doe",
            date_of_birth="1990-01-01", gender="M", fiscal_code="TEST123456"
        )

        self.room = Room.objects.create(name="Room A")
        self.service = Service.objects.create(name="Physio", duration_minutes=30, price=50)

        self.appt_physio = Appointment.objects.create(
            patient=self.patient_profile,
            therapist=self.physio_user,
            service=self.service, room=self.room,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(minutes=30)
        )

        self.appt_other = Appointment.objects.create(
            patient=self.patient_profile,
            therapist=None,  # Unassigned
            service=self.service, room=self.room,
            start_time=timezone.now() + timedelta(hours=1),
            end_time=timezone.now() + timedelta(hours=1, minutes=30)
        )

        self.list_url = reverse('appointment-list')

    def test_admin_can_see_all_appointments(self):
        """Admin should see BOTH appointments."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_physio_sees_only_assigned_appointments(self):
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(self.appt_physio.id))

    def test_unauthenticated_user_is_blocked(self):
        self.client.logout()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)