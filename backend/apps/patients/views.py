from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    API for managing Patient records.
    Supports searching by name and fiscal code.
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'tax_id', 'phone_number', 'email']
    filterset_fields = ['gender', 'is_active']
    ordering_fields = ['last_name', 'created_at']

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.role in ['ADMIN', 'PHYSIO', 'RECEPTION']:
            return Patient.objects.all()

        if hasattr(user, 'patient_profile'):
            return Patient.objects.filter(user=user)

        return Patient.objects.none()
