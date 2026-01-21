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

    def validate(self, data):
        """
        Check if a patient with the same First Name, Last Name, and Email already exists.
        """
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        if email and first_name and last_name:
            exists_query = Patient.objects.filter(
                email=email,
                first_name__iexact=first_name,
                last_name__iexact=last_name
            )

            if self.instance:
                exists_query = exists_query.exclude(pk=self.instance.pk)

            if exists_query.exists():
                raise serializers.ValidationError({
                    "non_field_errors": [f"A patient named {first_name} {last_name} with email {email} already exists."]
                })

        return data