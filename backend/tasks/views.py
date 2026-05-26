from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(
            Q(owner=self.request.user) | Q(shared_with=self.request.user)).distinct()

        completed = self.request.query_params.get('completed')

        if completed is not None:
            queryset = queryset.filter(
                completed=completed.lower() == 'true'
            )
            
        category_id = self.request.query_params.get('category')
        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)