from rest_framework import serializers
from .models import Link
import random
import string


class LinkSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()

    class Meta:
        model = Link
        fields = ['id', 'original_url', 'short_code', 'custom_alias', 'short_url', 'clicks', 'created_at']
        read_only_fields = ['user', 'short_code', 'clicks', 'created_at']

    def validate_custom_alias(self, value):
        if value:
            # Verificar si el alias ya existe
            if Link.objects.filter(custom_alias=value).exists():
                raise serializers.ValidationError("Este alias ya está en uso.")
            # Verificar si el alias coincide con un short_code existente
            if Link.objects.filter(short_code=value).exists():
                raise serializers.ValidationError("Este alias coincide con un código corto existente.")
        return value

    def create(self, validated_data):
        # Si no hay custom_alias, generar un short_code único
        if not validated_data.get('custom_alias'):
            while True:
                short_code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
                if not Link.objects.filter(short_code=short_code).exists():
                    validated_data['short_code'] = short_code
                    break
        return super().create(validated_data)

    def get_short_url(self, obj):
        request = self.context.get('request')
        base_url = request.build_absolute_uri('/') if request else "http://localhost:8000"
        # Remover /api/ de la URL base si existe
        base_url = base_url.replace('/api/', '/')
        # Usar el custom_alias si existe, de lo contrario usar el short_code
        code = obj.custom_alias if obj.custom_alias else obj.short_code
        return f"{base_url}{code}"