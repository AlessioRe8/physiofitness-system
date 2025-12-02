from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.patients.models import Patient
from .models import Room, Service, Appointment


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'is_active']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'duration_minutes', 'price', 'is_active']


class AppointmentSerializer(serializers.ModelSerializer):
    therapist_detail = UserSerializer(source='therapist', read_only=True)
    service_detail = ServiceSerializer(source='service', read_only=True)
    room_detail = RoomSerializer(source='room', read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient', 'patient_name',
            'therapist', 'therapist_detail',
            'service', 'service_detail',
            'room', 'room_detail',
            'start_time', 'end_time',
            'status', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.last_name} {obj.patient.first_name}"

    def validate(self, data):
        """
        Global validation for the appointment.
        Example: Check that start_time is before end_time.
        """
        start = data.get('start_time')
        end = data.get('end_time')

        if start and end and start >= end:
            raise serializers.ValidationError("End time must be after start time.")

        return data