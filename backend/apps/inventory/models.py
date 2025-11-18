from django.db import models
from django.conf import settings
from django.db.models import F
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel


class InventoryItem(TimeStampedModel):
    """
    Represents a stock item (consumable) in the clinic.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # Stock Management
    current_stock = models.IntegerField(default=0)
    reorder_threshold = models.IntegerField(
        default=5,
        help_text="Alert when stock falls below this number"
    )
    unit = models.CharField(max_length=20, help_text="e.g., bottles, boxes, pieces")

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.current_stock} {self.unit})"

    class Meta:
        ordering = ['name']


class InventoryTransaction(TimeStampedModel):
    """
    Records every change to the stock (In/Out).
    This serves as the Audit Log for inventory.
    """

    class Type(models.TextChoices):
        INBOUND = 'IN', 'Stock In (Purchase/Return)'
        OUTBOUND = 'OUT', 'Stock Out (Usage/Damage)'
        ADJUSTMENT = 'ADJ', 'Correction'

    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=3, choices=Type.choices)
    quantity = models.PositiveIntegerField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        help_text="Staff member who recorded this"
    )

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_transaction_type_display()}: {self.quantity} x {self.item.name}"

    def clean(self):
        """
        Validate the transaction before saving.
        Ensure we don't remove more stock than we have.
        """
        is_new = self._state.adding

        if is_new and self.transaction_type == self.Type.OUTBOUND:
            if not self.item_id:
                return
            current_item = InventoryItem.objects.get(pk=self.item.pk)

            if self.quantity > current_item.current_stock:
                raise ValidationError({
                    'quantity': f"Insufficient stock. You have {current_item.current_stock} {current_item.unit}, but tried to remove {self.quantity}."
                })

        super().clean()

    def save(self, *args, **kwargs):
        is_new = self._state.adding

        if is_new:
            if self.transaction_type == self.Type.INBOUND:
                InventoryItem.objects.filter(pk=self.item.pk).update(
                    current_stock=F('current_stock') + self.quantity
                )
            elif self.transaction_type == self.Type.OUTBOUND:
                InventoryItem.objects.filter(pk=self.item.pk).update(
                    current_stock=F('current_stock') - self.quantity
                )

        super().save(*args, **kwargs)