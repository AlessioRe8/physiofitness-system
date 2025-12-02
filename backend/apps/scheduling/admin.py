from django.contrib import admin
from .models import Room, Service, Appointment
from django.contrib.auth import get_user_model
from django import forms

User = get_user_model()

class TherapistChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.last_name} {obj.first_name}"
        return obj.email

class AppointmentAdminForm(forms.ModelForm):
    therapist = TherapistChoiceField(
        queryset=User.objects.filter(role='PHYSIO'),
        required=False
    )

    class Meta:
        model = Appointment
        fields = '__all__'

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_minutes', 'price', 'is_active')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    form = AppointmentAdminForm

    list_display = ('start_time', 'get_patient_name', 'get_therapist_name', 'service', 'status')
    list_filter = ('status', 'start_time', 'therapist')
    search_fields = ('patient__last_name', 'patient__first_name', 'patient__fiscal_code')
    date_hierarchy = 'start_time'

    @admin.display(description='Therapist')
    def get_therapist_name(self, obj):
        if obj.therapist:
            return f"{obj.therapist.last_name} {obj.therapist.first_name}"
        return "-"

    @admin.display(description='Patient')
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.last_name} {obj.patient.first_name}"
        return "-"