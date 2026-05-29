from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task
from categories.models import Category

from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'owner')
        read_only_fields = ('owner',)

    def validate_name(self, value):
        user = self.context['request'].user
        normalized_name = value.strip().lower()

        if Category.objects.filter(owner=user, name__iexact=normalized_name).exists():
            raise serializers.ValidationError("Você já possui uma categoria com este nome.")
            
        return value.strip()

class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'completed', 
            'owner', 'owner_username', 'category',
            'shared_with', 'created_at', 'updated_at'
        ]