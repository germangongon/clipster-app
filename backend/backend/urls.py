from django.contrib import admin
from django.urls import path, include
from shortener.views import RedirectView

urlpatterns = [
    # Redirection endpoint - debe estar primero para capturar las URLs cortas
    path('<str:code>/', RedirectView.as_view(), name='redirect'),
    
    # Admin y API endpoints
    path('admin/', admin.site.urls),
    path('api/', include('shortener.urls')),
]    