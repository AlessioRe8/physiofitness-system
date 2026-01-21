import json
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict

from apps.billing.models import Invoice
from apps.inventory.models import InventoryItem
from apps.patients.models import Patient
from apps.scheduling.models import Appointment, Service
from apps.users.models import User
from .models import AuditLog
from .middleware import get_current_user

TRACKED_MODELS = [Patient, Appointment, Service, User, InventoryItem, Invoice]


@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    if sender not in TRACKED_MODELS:
        return

    user = get_current_user()

    if not user and isinstance(instance, User):
        user = instance

    action = "CREATE" if created else "UPDATE"

    try:
        changes = json.dumps(model_to_dict(instance), cls=DjangoJSONEncoder)
    except Exception:
        changes = "Could not serialize data"

    AuditLog.objects.create(
        user=user,
        action=action,
        content_type=ContentType.objects.get_for_model(sender),
        object_id=str(instance.pk),
        changes=changes
    )


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if sender not in TRACKED_MODELS:
        return

    user = get_current_user()

    AuditLog.objects.create(
        user=user,
        action="DELETE",
        content_type=ContentType.objects.get_for_model(sender),
        object_id=str(instance.pk),
        changes="Object Deleted"
    )