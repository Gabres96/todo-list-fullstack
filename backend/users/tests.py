import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from categories.models import Category
from tasks.models import Task

pytestmark = pytest.mark.django_db

@pytest.fixture
def authenticated_client():
    api_client = APIClient()
    user = User.objects.create_user(username="gabriel_dev", password="Senha123")
    
    login_url = reverse('token_obtain_pair')
    response = api_client.post(login_url, {"username": "gabriel_dev", "password": "Senha123"}, format='json')
    
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    api_client.user = user  
    return api_client

def test_create_task_with_category(authenticated_client):
    category = Category.objects.create(name="Trabalho", owner=authenticated_client.user)
    
    data = {
        "title": "Estutura para testes em python",
        "description": "Cenários para os testes unitários",
        "category": category.id,
        "completed": False
    }
    
    response = authenticated_client.post(reverse('tasks-list'), data, format='json')
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['title'] == "Estutura para testes em python"

def test_user_cannot_see_other_users_tasks(authenticated_client):
    other_user = User.objects.create_user(username="outro_usuario", password="Password123")
    other_category = Category.objects.create(name="Usuario_diferente", owner=other_user)
    
    Task.objects.create(
        title="Tarefa Secreta", 
        owner=other_user, 
        category=other_category
    )
    
    response = authenticated_client.get(reverse('tasks-list'))
    
    assert response.status_code == status.HTTP_200_OK
    assert not any(task['title'] == "Tarefa Secreta" for task in response.data['results'])