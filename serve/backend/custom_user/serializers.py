from calendar import c
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from .models import User
from rest_framework import serializers


class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('email', 'username', 'password', 'is_root', 'is_admin', 'is_manager', 'is_staff')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'parent_name',
            'is_root', 'is_admin',
            'is_staff', 'is_manager', 'is_approved')


class RoleSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[])
    class Meta:
        model = User
        fields = ('username','is_admin','is_manager','is_staff')