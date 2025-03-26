from django.contrib.auth.models import User
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    print("Received request data:",request.data)
    try:
        name=request.data.get("name")
        email=request.data.get("email")
        password=request.data.get("password")
        phone=request.data.get("phone")
        role=request.data.get("role")

        if not name or not email or not password or not phone or not role:
            print("Missing required fields:", name, email, password, phone,role)
            return Response({"error": "All fields are required"}, status=400)

        if role not in ["customer","owner"]:
            return Response({"error":"Invalid role"},status=400)

        if User.objects.filter(username=name).exists():
            return Response({"error":"name alredy taken"},status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        user=User.objects.create_user(username=name,email=email,password=password,is_active=False)

        if role=="owner":
            user.is_staff=True
            user.save()


        UserProfile.objects.create(user=user,role=role,phone=phone)

        return Response({"message": f"{role} registered successfully."})
    except Exception as e:
        print("Error:",str(e))
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    try:
        user=User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error":"Invalid credentials"},status=400)
    if user.check_password(password):
        user.is_active=True
        user.save()
        role = user.userprofile.role
        refresh=RefreshToken.for_user(user)
        return Response({
            "token":str(refresh.access_token),
            "message":"Login successful",
            "role": role
        })

    return Response({"error": "Invalid credentials"}, status=400)

