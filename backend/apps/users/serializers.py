from rest_framework import serializers
from .models import User
from apps.patients.models import Patient

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Used for retrieving and updating user information (e.g., /api/users/me/).
    """
    class Meta:
        model = User
        fields = (
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'role',
            'is_active'
        )
        read_only_fields = fields


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user (registration).
    Includes password validation.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = (
            'email', 
            'first_name', 
            'last_name', 
            'password', 
            'password2'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            role='PATIENT'
        )
        return user


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role='PATIENT'
        )

        try:
            existing_patient = Patient.objects.get(
                email=validated_data['email'],
                user__isnull=True
            )

            existing_patient.user = user
            existing_patient.save()
            print(f"--- SUCCESS: Linked User {user.email} to existing Patient Profile ---")

        except Patient.DoesNotExist:
            Patient.objects.create(
                user=user,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email
            )
            print(f"--- INFO: New Patient profile created for {user.email} ---")

        return user