from rest_framework import generics, permissions, status, viewsets
from .models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from .serializers import UserSerializer, UserRegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for new user registration.
    POST: /api/users/register/
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for retrieving and updating the authenticated user's profile.
    GET, PUT, PATCH: /api/users/me/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserListView(generics.ListCreateAPIView):
        """
        GET: List all users (Admin only)
        POST: Create a new user (Admin only)
        """
        queryset = User.objects.all().order_by('-date_joined')
        serializer_class = UserSerializer
        permission_classes = [permissions.IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
        """
        GET, PUT, PATCH, DELETE a specific user by ID.
        """
        queryset = User.objects.all()
        serializer_class = UserSerializer
        permission_classes = [permissions.IsAdminUser]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]

        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        user = self.get_object()

        new_password = get_random_string(length=12)

        user.set_password(new_password)
        user.save()

        subject = f'Password Reset for {settings.SITE_NAME}'
        message = (
            f"Hello {user.first_name},\n\n"
            f"An administrator has reset your password.\n"
            f"Your new password is: {new_password}\n\n"
            f"Please log in and change it immediately."
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({'status': 'New password sent to user email.'})
        except Exception as e:
            print("Email Error:", e)
            return Response(
                {'warning': 'Password changed, but email failed.', 'temp_password': new_password},
                status=status.HTTP_200_OK
            )