from django.urls import path
from .views import LinkListCreateView, RedirectView, register_user

urlpatterns = [
    # API (bajo /api/)
    path('links/', LinkListCreateView.as_view(), name='links-list-create'),
    
    # Redirección (en la raíz del dominio)
    path('<str:code>/', RedirectView.as_view(), name='redirect'),  # ✅ http://localhost:8000/google

    path('register/', register_user, name='register'), 
]