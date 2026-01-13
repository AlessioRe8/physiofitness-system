from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    fiscal_code = serializers.CharField(source='tax_id')

    class Meta:
        model = Patient
        fields = [
            'id',
            'first_name', 'last_name',
            'date_of_birth', 'age', 'gender',
            'fiscal_code',
            'email', 'phone_number', 'address',
            'insurance_provider', 'insurance_policy_number',
            'medical_history', 'allergies',
            'is_active', 'created_at',
            'distance_from_clinic', 'no_show_history'
        ]
        read_only_fields = ['created_at', 'age']