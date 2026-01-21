import random
from datetime import timedelta, date
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.patients.models import Patient
from apps.scheduling.models import Appointment, Service, Room
from apps.inventory.models import InventoryItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Populates the database with demo data for testing.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Deleting old data...'))

        Appointment.objects.all().delete()
        Patient.objects.all().delete()
        Service.objects.all().delete()
        InventoryItem.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write(self.style.SUCCESS('Creating Staff Users...'))

        if not User.objects.filter(email='admin@test.com').exists():
            User.objects.create_superuser('admin@test.com', 'password123', first_name='Admin', last_name='User',
                                          role='ADMIN')

        physio = User.objects.create_user('physio@test.com', 'password123', first_name='Mario', last_name='Rossi',
                                          role='PHYSIO')
        reception = User.objects.create_user('reception@test.com', 'password123', first_name='Anna', last_name='Verdi',
                                             role='RECEPTIONIST')

        self.stdout.write(self.style.SUCCESS('Creating Services & Inventory...'))

        s1 = Service.objects.create(name="Manual Therapy", duration_minutes=30, price=50.00)
        s2 = Service.objects.create(name="Sports Massage", duration_minutes=45, price=70.00)
        s3 = Service.objects.create(name="Post-Op Rehab", duration_minutes=60, price=90.00)

        InventoryItem.objects.create(name="Kinesio Tape", current_stock=50, unit_price=12.50, supplier="MedSupply",
                                     unit="roll")
        InventoryItem.objects.create(name="Ultrasound Gel", current_stock=5, unit_price=8.00, supplier="PharmaFix",
                                     reorder_threshold=10, unit="bottle")

        self.stdout.write(self.style.SUCCESS('Creating Patients & User Accounts...'))

        patients = []
        patient_data = [
            ("Luigi", "Bianchi", "patient1@test.com"),
            ("Giulia", "Romano", "patient2@test.com"),
            ("Marco", "Ricci", "patient3@test.com"),
            ("Sofia", "Esposito", "patient4@test.com"),
            ("Luca", "Marino", "patient5@test.com")
        ]

        for i, (first, last, email) in enumerate(patient_data):
            user_account = User.objects.create_user(
                email=email,
                password='password123',
                first_name=first,
                last_name=last,
                role='PATIENT'
            )

            p = Patient.objects.create(
                first_name=first,
                last_name=last,
                email=email,
                phone_number=f"+39 333 123456{i}",
                tax_id=f"TAXID{i}ABC",
                gender="M" if i % 2 == 0 else "F",
                date_of_birth=date(1990 + i, 1, 1),
                is_active=True,
                user=user_account
            )
            patients.append(p)

        self.stdout.write(self.style.SUCCESS('Creating Appointments (Past & Future)...'))

        today = timezone.now()

        for i in range(1, 6):
            start = today - timedelta(days=i, hours=random.randint(1, 5))
            Appointment.objects.create(
                patient=random.choice(patients),
                therapist=physio,
                service=random.choice([s1, s2, s3]),
                start_time=start,
                end_time=start + timedelta(minutes=30),
                status='COMPLETED'
            )

        for i in range(1, 6):
            start = today + timedelta(days=i, hours=random.randint(1, 5))
            Appointment.objects.create(
                patient=random.choice(patients),
                therapist=physio,
                service=random.choice([s1, s2, s3]),
                start_time=start,
                end_time=start + timedelta(minutes=30),
                status='CONFIRMED'
            )

        self.stdout.write(self.style.SUCCESS('--------------------------------------'))
        self.stdout.write(self.style.SUCCESS('DEMO DATA GENERATED SUCCESSFULLY'))
        self.stdout.write(self.style.SUCCESS('--------------------------------------'))
        self.stdout.write(self.style.SUCCESS('Login Credentials:'))
        self.stdout.write(self.style.SUCCESS(' - Admin: admin@test.com / password123'))
        self.stdout.write(self.style.SUCCESS(' - Physiotherapist: physio@test.com / password123'))
        self.stdout.write(self.style.SUCCESS(' - Receptionist: reception@test.com / password123'))
        self.stdout.write(self.style.SUCCESS(' - Patient: patient1@test.com / password123'))
        self.stdout.write(self.style.SUCCESS('--------------------------------------'))