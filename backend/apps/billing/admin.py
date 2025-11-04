from django.contrib import admin
from .models import Invoice, Payment

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "patient", "service", "amount", "status", "issue_date")
    list_filter = ("status",)
    search_fields = ("patient__first_name", "patient__last_name")

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("invoice", "amount", "method", "payment_date")
    list_filter = ("method", "payment_date")