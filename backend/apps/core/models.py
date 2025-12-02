import uuid
from django.db import models

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings


class TimeStampedModel(models.Model):
    """
    Abstract base class model that provides self-updating
    'created' and 'modified' fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditLog(models.Model):
    """
    A generic audit log that can track changes to ANY model in the system.
    Fulfils the requirement in Scheduling and CRM modules.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )

    action = models.CharField(max_length=50)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255)
    content_object = GenericForeignKey('content_type', 'object_id')

    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    changes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.content_type} ({self.timestamp})"

    class Meta:
        ordering = ['-timestamp']