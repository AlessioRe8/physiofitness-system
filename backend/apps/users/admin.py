from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import StaffProfile

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "phone")
    search_fields = ("user__username", "role")
    list_filter = ("role",)