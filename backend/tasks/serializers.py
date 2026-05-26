from rest_framework import serializers

from .models import Task
from django.contrib.auth.models import User

class UserMinifiedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class TaskSerializer(serializers.ModelSerializer):
    
    shared_with_detaisl = UserMinifiedSerializer(source='shared_with', many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

        read_only_fields = (
            'owner',
            'created_at',
            'updated_at'
        )