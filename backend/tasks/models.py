from django.db import models
from django.contrib.auth.models import User

from categories.models import Category


class Task(models.Model):
    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    completed = models.BooleanField(default=False)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    
    shared_with = models.ManyToManyField(
        User, 
        blank=True, 
        related_name='shared_tasks'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title