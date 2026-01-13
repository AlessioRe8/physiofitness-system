from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'date_of_birth', 'phone_number', 'tax_id', 'is_active')
    search_fields = ('last_name', 'first_name', 'tax_id')
    list_filter = ('gender', 'is_active')