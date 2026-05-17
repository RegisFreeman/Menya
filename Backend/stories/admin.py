from django.contrib import admin
from .models import Story, Verification, AuditLog


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "created_at")
    list_filter = ("status", "category")
    search_fields = ("title", "content")


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ("story", "decision", "verifier", "created_at")
    readonly_fields = ("created_at",)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "story", "performed_by", "timestamp")
    readonly_fields = ("timestamp",)