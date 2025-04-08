from rest_framework import serializers
from .models import Link

class LinkSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()

    class Meta:
        model = Link
        fields = ['id', 'original_url', 'short_code', 'custom_alias', 'short_url', 'clicks', 'created_at']
        read_only_fields = ['user', 'short_code', 'clicks', 'created_at']

    def get_short_url(self, obj):
        request = self.context.get('request')
        base_url = request.build_absolute_uri('/') if request else "http://localhost:8000"
        return f"{base_url}{obj.custom_alias or obj.short_code}"