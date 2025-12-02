from rest_framework import serializers
from datetime import date
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'first_name', 'last_name',
            'date_of_birth', 'age', 'gender', 'fiscal_code',
            'email', 'phone_number', 'address',
            'insurance_provider', 'insurance_policy_number',
            'medical_history', 'allergies',
            'is_active', 'created_at'
        ]
        read_only_fields = ['created_at', 'age']

    def get_age(self, obj):
        if obj.date_of_birth:
            today = date.today()
            return today.year - obj.date_of_birth.year - (
                (today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day)
            )
        return None