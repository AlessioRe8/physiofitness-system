from django.db import models
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel
from apps.patients.models import Patient
from apps.scheduling.models import Appointment, Service


class Invoice(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ISSUED = 'ISSUED', 'Issued (Unpaid)'
        PAID = 'PAID', 'Paid'
        PARTIAL = 'PARTIAL', 'Partially Paid'
        CANCELLED = 'CANCELLED', 'Cancelled'

    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='invoices')
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices',
        help_text="Link this invoice to a specific appointment"
    )

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    issue_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"INV-{self.id} ({self.patient.last_name})"

    def update_total(self):
        total = sum(item.total_price for item in self.items.all())
        self.total_amount = total
        self.save()


class InvoiceItem(TimeStampedModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')

    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)

    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        if self.service and not self.description:
            self.description = self.service.name
        if self.service and not self.unit_price:
            self.unit_price = self.service.price

        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

        self.invoice.update_total()

    def __str__(self):
        return f"{self.description} x{self.quantity}"


class Payment(TimeStampedModel):
    class Method(models.TextChoices):
        CASH = 'CASH', 'Cash'
        CARD = 'CARD', 'Credit/Debit Card'
        TRANSFER = 'TRANSFER', 'Bank Transfer'
        INSURANCE = 'INSURANCE', 'Insurance Claim'

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.CARD)
    transaction_id = models.CharField(max_length=100, blank=True, help_text="Stripe ID or Check #")

    note = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.amount} EUR - {self.invoice}"