from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    login(request, user)

    return Response({
        "username": user.username,
        "role": user.role
    })


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"status": "Logged out"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response({
        "username": request.user.username,
        "role": request.user.role
    })