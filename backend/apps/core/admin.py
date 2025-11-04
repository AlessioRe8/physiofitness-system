from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "user", "action", "entity", "entity_id")
    search_fields = ("user__username", "action", "entity")
    list_filter = ("entity",)