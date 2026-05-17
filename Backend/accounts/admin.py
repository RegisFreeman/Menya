from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    # ✅ columns shown in the user list
    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
    )

    # ✅ filters on the right
    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )

    # ✅ when viewing/editing a user
    fieldsets = UserAdmin.fieldsets + (
        (
            "Role",
            {
                "fields": ("role",),
            },
        ),
    )

    # ✅ when creating a new user
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Role",
            {
                "fields": ("role",),
            },
        ),
    )

    search_fields = ("username", "email")
    ordering = ("username",)