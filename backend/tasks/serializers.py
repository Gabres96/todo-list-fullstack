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
        # O 'self.context' acessa os dados da requisição atual
        user = self.context['request'].user
        
        # Remove espaços extras e converte para minúsculo para comparação
        normalized_name = value.strip().lower()

        # Verifica se já existe uma categoria com esse nome para este usuário específico
        if Category.objects.filter(owner=user, name__iexact=normalized_name).exists():
            raise serializers.ValidationError("Você já possui uma categoria com este nome.")
            
        return value.strip() # Retorna o nome limpo


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 
            'title', 
            'description', 
            'completed',
            'owner', 
            'category', 
            'shared_with', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']