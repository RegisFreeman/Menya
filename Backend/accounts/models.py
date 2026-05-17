from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("citizen", "Citizen"),
        ("verifier", "Verifier"),
        ("moderator", "Moderator"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="citizen",
    )

    # ✅ FIX GROUP CLASHES
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="accounts_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="accounts_user_permissions_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return f"{self.username} ({self.role})"