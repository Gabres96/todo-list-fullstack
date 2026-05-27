from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['completed', 'category']

    def get_queryset(self):
        return Task.objects.filter(
            Q(owner=self.request.user) | Q(shared_with=self.request.user)
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)