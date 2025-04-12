from django.views import View
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404, redirect
from .models import Link
from django.db.models import Q
from .serializers import LinkSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
import random
import string
from django.db import models, transaction


# Vista para crear y listar enlaces
class LinkListCreateView(generics.ListCreateAPIView):
    serializer_class = LinkSerializer
    permission_classes = [AllowAny]  # ✅ Permitir acceso sin autenticar

    def get_queryset(self):
        # Si el usuario está autenticado, mostrar sus enlaces
        if self.request.user.is_authenticated:
            return Link.objects.filter(user=self.request.user)
        return Link.objects.none()  # 🔒 Los anónimos no ven enlaces

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def generate_unique_code(self):
        while True:
            code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
            if not Link.objects.filter(short_code=code).exists() and not Link.objects.filter(custom_alias=code).exists():
                return code


# Vista para eliminar enlaces
class LinkDeleteView(generics.DestroyAPIView):
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Vista para registrar un usuario
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


# Vista para redirigir a los enlaces
class RedirectView(View):
    def get(self, request, code):
        try:
            print(f"Intentando redirigir con código: {code}")  # Debug
            with transaction.atomic():
                # Buscar el enlace por short_code o custom_alias
                link = get_object_or_404(Link, Q(short_code=code) | Q(custom_alias=code))
                print(f"Enlace encontrado: {link.id}, clicks actuales: {link.clicks}")  # Debug
                
                # Incrementar los clicks usando el nuevo método
                link.increment_clicks()
                print(f"Clicks después de incrementar: {link.clicks}")  # Debug
                
                # Obtener la URL original
                original_url = link.original_url
                
                # Asegurarse de que la URL tenga el protocolo
                if not original_url.startswith(('http://', 'https://')):
                    original_url = 'https://' + original_url
                
                print(f"Redirigiendo a: {original_url}")  # Debug
                # Redirigir a la URL original sin cache
                response = redirect(original_url)
                response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                response['Pragma'] = 'no-cache'
                response['Expires'] = '0'
                return response
        except Exception as e:
            print(f"Error en redirección: {str(e)}")  # Para debugging
            return redirect('/')  # Redirigir a la página principal en caso de error
