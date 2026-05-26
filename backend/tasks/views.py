from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(
            owner=self.request.user
        )

        completed = self.request.query_params.get('completed')

        if completed is not None:
            queryset = queryset.filter(
                completed=completed.lower() == 'true'
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)