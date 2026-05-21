from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Story, Verification, AuditLog
from .serializers import StorySerializer


class StoryViewSet(ModelViewSet):
    queryset = Story.objects.all().order_by('-created_at')
    serializer_class = StorySerializer
    parser_classes = (MultiPartParser, FormParser)

    parser_classes = (MultiPartParser, FormParser)


    # ✅ Allow public submission (MVP requirement)
    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    # ✅ THIS MAKES CREATE WORK RELIABLY
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(author=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def verify(self, request, pk=None):
        story = self.get_object()

        decision = request.data.get('decision')
        comments = request.data.get('comments')
        proof_url = request.data.get('proof_url')

        if decision not in ['verified', 'disputed']:
            return Response({'error': 'Invalid decision'}, status=400)

        if not comments or not proof_url:
            return Response(
                {'error': 'Verification requires comments and a proof URL'},
                status=400
            )

        Verification.objects.create(
            story=story,
            verifier=request.user,
            decision=decision,
            comments=comments,
            proof_url=proof_url
        )

        story.status = decision
        story.save()

        AuditLog.objects.create(
            action=f"story_{decision}",
            story=story,
            performed_by=request.user,
            details=f"{comments} | Proof: {proof_url}"
        )

        return Response({'status': f'Story {decision} with proof recorded'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove(self, request, pk=None):
        story = self.get_object()
        story.status = 'removed'
        story.save()

        AuditLog.objects.create(
            action='story_removed',
            story=story,
            performed_by=request.user
        )

        return Response({'status': 'Story removed'})
