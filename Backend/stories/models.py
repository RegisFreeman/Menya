from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Story(models.Model):
    STATUS_CHOICES = [
        ('unverified', 'Unverified'),
        ('verified', 'Verified'),
        ('disputed', 'Disputed'),
        ('removed', 'Removed'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    content = models.TextField()

    # ✅ NEW: Optional storyteller picture
    # Displayed only in Public Archive (Phase 11)
    storyteller_photo = models.ImageField(
        upload_to="storyteller_photos/",
        null=True,
        blank=True,
        help_text="Optional photo of the person telling the story"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='unverified'
    )

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stories'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Verification(models.Model):
    DECISION_CHOICES = [
        ('verified', 'Verified'),
        ('disputed', 'Disputed'),
    ]

    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='verifications'
    )

    verifier = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    decision = models.CharField(
        max_length=20,
        choices=DECISION_CHOICES
    )

    comments = models.TextField()
    proof_url = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.story.title} → {self.decision}"


class AuditLog(models.Model):
    action = models.CharField(max_length=100)
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='audits'
    )
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} @ {self.timestamp}"