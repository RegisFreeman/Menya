from rest_framework import serializers
from .models import Story, Verification


class VerificationSerializer(serializers.ModelSerializer):
    verifier = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Verification
        fields = [
            'id',
            'decision',
            'comments',
            'proof_url',
            'verifier',
            'created_at'
        ]


class StorySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    verifications = VerificationSerializer(many=True, read_only=True)

    # NEW (safe, read‑only for now)
    storyteller_photo = serializers.ImageField(read_only=True)

    class Meta:
        model = Story
        fields = [
            'id',
            'title',
            'category',
            'content',
            'status',
            'author',
            'storyteller_photo',
            'created_at',
            'verifications'
        ]