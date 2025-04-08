from django.contrib import admin
from django.urls import path, include
from shortener import views
from shortener.views import LinkListCreateView, RedirectView, register_user
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
        path('api/auth/', include([
        path('login/', obtain_auth_token, name='api-login'), # Ruta para login
        path('register/', register_user, name='api-register'),  # Ruta para registro
    ])),

    path('api/links/', LinkListCreateView.as_view(), name='links-list-create'),
    path('<str:code>/', RedirectView.as_view(), name='redirect'),
]    