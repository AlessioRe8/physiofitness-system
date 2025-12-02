from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.scheduling.views import AuditLogMixin
from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(AuditLogMixin, viewsets.ModelViewSet):
    """
    API for managing Patient records.
    Supports searching by name and fiscal code.
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'fiscal_code', 'phone_number']
    filterset_fields = ['gender', 'is_active']
    ordering_fields = ['last_name', 'created_at']

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.role in ['ADMIN', 'PHYSIO', 'RECEPTION']:
            return Patient.objects.all()

        if hasattr(user, 'patient_profile'):
            return Patient.objects.filter(user=user)

        return Patient.objects.none()

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_action("CREATED", instance, "Patient record created")

    def perform_update(self, serializer):
        instance = serializer.save()
        self.log_action("UPDATED", instance, "Patient details updated")

    def perform_destroy(self, instance):
        self.log_action("DELETED", instance, f"Deleted patient {instance.fiscal_code}")
        instance.delete()