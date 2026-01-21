from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from apps.patients.models import Patient

class UserSerializer(serializers.ModelSerializer):
    """
    Used for retrieving and updating user information.
    We allow editing names, role, and is_active status.
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active')
        read_only_fields = ('id', 'email')

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})

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
            existing_patient = Patient.objects.get(email=validated_data['email'], user__isnull=True)
            existing_patient.user = user
            existing_patient.save()
        except Patient.DoesNotExist:
            Patient.objects.create(
                user=user,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email
            )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token