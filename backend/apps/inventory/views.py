from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import InventoryItem
from .serializers import InventoryItemSerializer
from ..core.utils import log_action


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        item = serializer.save()
        log_action(
            user=self.request.user,
            action='created',
            entity='InventoryItem',
            entity_id=item.id
        )

    def perform_update(self, serializer):
        item = serializer.save()
        log_action(
            user=self.request.user,
            action='updated',
            entity='InventoryItem',
            entity_id=item.id
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action='deleted',
            entity='InventoryItem',
            entity_id=instance.id
        )
        instance.delete()