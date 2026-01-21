from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Room, Service, Appointment
from .serializers import RoomSerializer, ServiceSerializer, AppointmentSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AppointmentViewSet(viewsets.ModelViewSet):
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
            return Appointment.objects.filter(patient__user=user)

        return Appointment.objects.none()
