from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, ServiceViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]