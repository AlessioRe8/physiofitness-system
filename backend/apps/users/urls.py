from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    UserProfileView,
    MyTokenObtainPairView,
    UserViewSet
)

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('', include(router.urls)),
]