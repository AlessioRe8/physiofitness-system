from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StaffProfile
from .forms import CustomUserCreationForm, CustomUserChangeForm


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom Admin panel configuration for the User model.
    """
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'first_name',
                'last_name',
                'role',
                'is_staff',
                'is_active',
            ),
        }),
    )

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                    'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom Fields', {'fields': ('role',)}),
    )
    list_display = (
        'email',
        'first_name',
        'last_name',
        'role',
        'is_staff',
        'is_active',
    )

    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'is_active_staff')
    search_fields = ('user__email', 'user__first_name', 'specialization')
    list_filter = ('is_active_staff', 'specialization')