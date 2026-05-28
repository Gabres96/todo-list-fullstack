from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task

class UserMinifiedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    shared_with_details = UserMinifiedSerializer(
        source='shared_with',
        many=True,
        read_only=True
    )

    class Meta:
        model = Task
        fields = '__all__' 

        read_only_fields = (
            'owner',
            'created_at',
            'updated_at',
        )