from django.db import models
from django.contrib.auth.models import User
import string, random

def generate_unique_short_code(length=6):
    characters = string.ascii_letters + string.digits
    while True:
        short_code = ''.join(random.choices(characters, k=length))
        if not Link.objects.filter(short_code=short_code).exists():
            return short_code

class Link(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    original_url = models.URLField()
    short_code = models.CharField(max_length=15, unique=True, blank=True)
    custom_alias = models.CharField(max_length=50, unique=True, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    clicks = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if self.custom_alias == '':
            self.custom_alias = None
        if self.custom_alias:
            self.short_code = self.custom_alias
        elif not self.short_code:
            self.short_code = generate_unique_short_code()
        super().save(*args, **kwargs)

    def increment_clicks(self):
        """Método para incrementar los clicks de manera atómica"""
        self.clicks = models.F('clicks') + 1
        self.save(update_fields=['clicks'])
        self.refresh_from_db()

    def __str__(self):
        return f"{self.original_url} -> {self.custom_alias or self.short_code}"
