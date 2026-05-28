from rest_framework import serializers

from .models import Task
from django.contrib.auth.models import User

class UserMinifiedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class TaskSerializer(serializers.ModelSerializer):
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    shared_with_details = UserMinifiedSerializer(source='shared_with', many=True, read_only=True)

    fields = ( 
        'id',
        'title',
        'description', 
        'completed', 
        'owner', 
        'category', 
        'category_name', 
        'shared_with', 
        'shared_with_details', 
        'created_at', 
        'updated_at', 
    )
    
    read_only_fields = (
        'owner', 
        'created_at', 
        'updated_at',
    )