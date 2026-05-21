from rest_framework import serializers
from .models import Story, Verification


class VerificationSerializer(serializers.ModelSerializer):
    verifier = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Verification
        fields = [
            "id",
            "decision",
            "comments",
            "proof_url",
            "verifier",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class StorySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    # ✅ THIS IS THE KEY FIX (allows upload)
    storyteller_photo = serializers.ImageField(required=False, allow_null=True)

    verifications = VerificationSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = [
            "id",
            "title",
            "category",
            "content",
            "status",
            "author",
            "storyteller_photo",
            "created_at",
            "verifications",
        ]
        read_only_fields = ["id", "status", "created_at"]

    # ✅ THIS MAKES FRONTEND RECEIVE FULL IMAGE URL
    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")
        if request and instance.storyteller_photo:
            data["storyteller_photo"] = request.build_absolute_uri(
                instance.storyteller_photo.url
            )

        return data
