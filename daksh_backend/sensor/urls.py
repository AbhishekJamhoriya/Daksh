from django.urls import path, re_path
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from . import views

urlpatterns = [
    path('sensors/', views.SensorView.as_view(), name='sensors'),
]
