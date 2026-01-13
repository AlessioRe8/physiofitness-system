from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import InventoryItem, InventoryTransaction

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'description', 'current_stock',
                  'reorder_threshold', 'unit', 'is_active', 'updated_at',
                  'unit_price', 'supplier']
        read_only_fields = ['updated_at']

class InventoryTransactionSerializer(serializers.ModelSerializer):
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = InventoryTransaction
        fields = [
            'id', 'item', 'item_name',
            'transaction_type', 'quantity',
            'created_by', 'created_by_detail',
            'notes', 'created_at'
        ]
        read_only_fields = ['created_at', 'created_by']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive.")
        return value