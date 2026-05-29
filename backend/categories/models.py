from django.db import models  # <--- ADICIONE ESTA LINHA!
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner', 'name')

    def __str__(self):
        return self.name