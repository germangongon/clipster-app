from django.urls import path
from .views import LinkListCreateView, register_user, LinkDeleteView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # API endpoints
    path('auth/login/', obtain_auth_token, name='api-login'),
    path('auth/register/', register_user, name='api-register'),
    path('links/', LinkListCreateView.as_view(), name='links-list-create'),
    path('links/<int:id>/', LinkDeleteView.as_view(), name='link-delete'),
]