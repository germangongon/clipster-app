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


# Vista para crear y listar enlaces
class LinkListCreateView(generics.ListCreateAPIView):
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        custom_alias = serializer.validated_data.get('custom_alias', '').strip()

        if custom_alias:  # Si se proporcionó un alias personalizado
            # Verificar si el alias ya existe (usamos custom_alias tanto para el campo custom_alias como para short_code)
            if Link.objects.filter(custom_alias=custom_alias).exists():
                raise serializer.ValidationError({"custom_alias": "This alias is already taken."})
            # Guardar usando el custom_alias también como short_code para evitar conflictos
            serializer.save(user=self.request.user, short_code=custom_alias)
        else:
            # Si no se proporcionó custom_alias, se genera un short_code único
            short_code = self.generate_unique_code()
            serializer.save(user=self.request.user, short_code=short_code)

    # Función para generar un short_code único
    def generate_unique_code(self):
        while True:
            # Generar un código aleatorio de 6 caracteres
            code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
            # Verificar que el código no exista ya en la base de datos
            if not Link.objects.filter(short_code=code).exists():
                return code


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
        link = get_object_or_404(Link, Q(short_code=code) | Q(custom_alias=code))
        link.clicks += 1
        link.save()
        return redirect(link.original_url)
