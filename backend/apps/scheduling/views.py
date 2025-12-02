from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from .tasks import send_appointment_confirmation_email

from .models import Room, Service, Appointment
from .serializers import RoomSerializer, ServiceSerializer, AppointmentSerializer

from apps.core.models import AuditLog


class AuditLogMixin:
    """
    A helper class to handle audit logging automatically.
    Views can inherit from this to get logging powers.
    """

    def log_action(self, action, instance, changes=""):
        if not self.request.user.is_authenticated:
            return

        AuditLog.objects.create(
            user=self.request.user,
            action=action,
            content_object=instance,
            ip_address=self.request.META.get('REMOTE_ADDR'),
            changes=changes
        )


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AppointmentViewSet(AuditLogMixin, viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'start_time', 'patient', 'therapist']
    ordering_fields = ['start_time']
    ordering = ['start_time']

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.is_staff or user.role in ['ADMIN', 'RECEPTION']:
            return Appointment.objects.all()

        if user.role == 'PHYSIO':
            return Appointment.objects.filter(therapist=user)
        if hasattr(user, 'patient_profile'):
            pass

        return Appointment.objects.none()  # Fallback for safety

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_action("CREATED", instance, "Appointment created via API")

    def perform_update(self, serializer):
        instance = serializer.save()
        self.log_action("UPDATED", instance, "Appointment updated via API")

    def perform_destroy(self, instance):
        self.log_action("DELETED", instance, f"Deleted appointment {instance.id}")
        instance.delete()