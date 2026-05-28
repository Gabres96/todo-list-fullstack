from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User
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

    @action(detail=True, methods=['post'], url_path='share')
    def share_task(self, request, pk=None):
        
        task = self.get_object()

        if task.owner != request.user:
            return Response(
                {"error": "Apenas o criador da tarefa pode compartilhá-la."},
                status=status.HTTP_403_FORBIDDEN
            )

        username_to_share = request.data.get('username')
        if not username_to_share:
            return Response(
                {"error": "O campo 'username' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if username_to_share == request.user.username:
            return Response(
                {"error": "Você não pode compartilhar uma tarefa com você mesmo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_share = User.objects.get(username=username_to_share)
        except User.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        task.shared_with.add(user_to_share)
        
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)