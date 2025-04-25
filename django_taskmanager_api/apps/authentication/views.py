from django.shortcuts import render
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, UserSerializer

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)
        
        # Add success message
        messages.success(request, "Registration successful. Please log in.")
        
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key,
            "message": "User created successfully",
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = User.objects.filter(username=username).first()
        
        if user is None or not user.check_password(password):
            messages.error(request, "Invalid username or password")
            return Response(
                {"error": "Invalid username or password"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)
        
        login(request, user)
        messages.success(request, f"Welcome back, {user.first_name}!")
        
        return Response({
            "token": token.key,
            "user": UserSerializer(user).data,
            "message": "Login successful"
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        # Delete the user's token
        Token.objects.filter(user=request.user).delete()
        
        logout(request)
        messages.info(request, "You have been logged out successfully.")
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
