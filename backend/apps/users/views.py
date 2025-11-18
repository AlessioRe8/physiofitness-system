from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer, UserRegisterSerializer

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