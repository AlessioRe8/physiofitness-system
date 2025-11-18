from django.contrib import admin
from .models import Invoice, InvoiceItem, Payment

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1
    fields = ('service', 'description', 'quantity', 'unit_price', 'total_price')
    readonly_fields = ('total_price',)


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    fields = ('payment_date', 'amount', 'method', 'transaction_id')


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'issue_date', 'patient_name', 'status', 'total_amount')
    list_filter = ('status', 'issue_date')
    search_fields = ('patient__last_name', 'patient__fiscal_code')
    readonly_fields = ('total_amount',)

    inlines = [InvoiceItemInline, PaymentInline]

    @admin.display(description='Patient')
    def patient_name(self, obj):
        return f"{obj.patient.last_name} {obj.patient.first_name}"


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_date', 'invoice', 'amount', 'method')
    list_filter = ('payment_date', 'method')