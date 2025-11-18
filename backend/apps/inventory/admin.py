from django import forms
from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import InventoryItem, InventoryTransaction

User = get_user_model()

class StaffChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.last_name} {obj.first_name}"
        return obj.email


class InventoryTransactionForm(forms.ModelForm):
    created_by = StaffChoiceField(
        queryset=User.objects.filter(is_staff=True),
        required=False
    )

    class Meta:
        model = InventoryTransaction
        fields = '__all__'

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'current_stock', 'unit', 'reorder_threshold', 'is_active')
    search_fields = ('name',)
    list_filter = ('is_active',)


@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    form = InventoryTransactionForm

    list_display = ('created_at', 'item', 'transaction_type', 'quantity', 'get_staff_name')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('item__name', 'notes')

    def get_readonly_fields(self, request, obj=None):
        """
        Dynamic read-only fields.
        - If obj is None (Creating): Allow editing everything.
        - If obj exists (Editing): Lock the critical fields.
        """
        if obj:
            return ('item', 'transaction_type', 'quantity', 'created_by')

        return ()

    @admin.display(description='Staff Member')
    def get_staff_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.last_name} {obj.created_by.first_name}"
        return "-"

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)