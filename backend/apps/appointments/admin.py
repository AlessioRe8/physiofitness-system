from django.contrib import admin
from .models import Appointment, Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "duration_minutes")
    search_fields = ("name",)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "staff", "service", "start_time", "status")
    list_filter = ("status", "service")
    search_fields = ("patient__first_name", "patient__last_name", "staff__user__username")
