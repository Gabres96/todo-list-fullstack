from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user).order_by('name')

    def perform_create(self, serializer):
        name = self.request.data.get('name', '').strip()
        
        if Category.objects.filter(owner=self.request.user, name__iexact=name).exists():
            raise serializers.ValidationError({"name": "Você já possui uma categoria com este nome."})
            
        serializer.save(owner=self.request.user)