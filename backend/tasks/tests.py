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

    user = User.objects.create_user(
        username="gabriel_dev",
        password="Senha123"
    )

    login_url = reverse('token_obtain_pair')

    response = api_client.post(
        login_url,
        {
            "username": "gabriel_dev",
            "password": "Senha123"
        },
        format='json'
    )

    api_client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
    )

    api_client.user = user

    return api_client


def test_create_task_with_category(authenticated_client):
    category = Category.objects.create(
        name="Trabalho",
        owner=authenticated_client.user
    )

    data = {
        "title": "Estrutura para testes em python",
        "description": "Cenários para os testes unitários",
        "category": category.id,
        "completed": False
    }

    response = authenticated_client.post(
        reverse('tasks-list'),
        data,
        format='json'
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['title'] == data['title']


def test_user_cannot_see_other_users_tasks(authenticated_client):
    other_user = User.objects.create_user(
        username="outro_usuario",
        password="Password123"
    )

    other_category = Category.objects.create(
        name="Usuario_diferente",
        owner=other_user
    )

    Task.objects.create(
        title="Tarefa Secreta",
        owner=other_user,
        category=other_category
    )

    response = authenticated_client.get(
        reverse('tasks-list')
    )

    assert response.status_code == status.HTTP_200_OK

    assert not any(
        task['title'] == "Tarefa Secreta"
        for task in response.data['results']
    )


def test_shared_user_can_see_task(authenticated_client):
    shared_user = User.objects.create_user(
        username="shared_user",
        password="Senha123"
    )

    category = Category.objects.create(
        name="Compartilhada",
        owner=authenticated_client.user
    )

    task = Task.objects.create(
        title="Tarefa Compartilhada",
        owner=authenticated_client.user,
        category=category
    )

    task.shared_with.add(shared_user)

    client = APIClient()

    response = client.post(
        reverse('token_obtain_pair'),
        {
            "username": "shared_user",
            "password": "Senha123"
        },
        format='json'
    )

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {response.data['access']}"
    )

    response = client.get(reverse('tasks-list'))

    assert response.status_code == status.HTTP_200_OK

    assert any(
        task['title'] == "Tarefa Compartilhada"
        for task in response.data['results']
    )


def test_user_cannot_use_category_from_another_user(authenticated_client):
    other_user = User.objects.create_user(
        username="other_user",
        password="Senha123"
    )

    other_category = Category.objects.create(
        name="Categoria Privada",
        owner=other_user
    )

    data = {
        "title": "Tentativa inválida",
        "description": "Teste",
        "category": other_category.id
    }

    response = authenticated_client.post(
        reverse('tasks-list'),
        data,
        format='json'
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_filter_tasks_by_completed(authenticated_client):
    Task.objects.create(
        title="Concluída",
        completed=True,
        owner=authenticated_client.user
    )

    Task.objects.create(
        title="Pendente",
        completed=False,
        owner=authenticated_client.user
    )

    response = authenticated_client.get(
        reverse('tasks-list'),
        {'completed': True}
    )

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data['results']) == 1

    assert response.data['results'][0]['title'] == "Concluída"


def test_filter_tasks_by_category(authenticated_client):
    category1 = Category.objects.create(
        name="Backend",
        owner=authenticated_client.user
    )

    category2 = Category.objects.create(
        name="Frontend",
        owner=authenticated_client.user
    )

    Task.objects.create(
        title="Task Backend",
        owner=authenticated_client.user,
        category=category1
    )

    Task.objects.create(
        title="Task Frontend",
        owner=authenticated_client.user,
        category=category2
    )

    response = authenticated_client.get(
        reverse('tasks-list'),
        {'category': category1.id}
    )

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data['results']) == 1

    assert response.data['results'][0]['title'] == "Task Backend"


def test_tasks_pagination(authenticated_client):
    for i in range(15):
        Task.objects.create(
            title=f"Tarefa {i}",
            owner=authenticated_client.user
        )

    response = authenticated_client.get(
        reverse('tasks-list')
    )

    assert response.status_code == status.HTTP_200_OK

    assert 'count' in response.data
    assert 'next' in response.data

    assert len(response.data['results']) == 10


def test_user_cannot_edit_other_users_task(authenticated_client):
    other_user = User.objects.create_user(
        username="other_user_edit",
        password="Senha123"
    )

    task = Task.objects.create(
        title="Tarefa protegida",
        owner=other_user
    )

    response = authenticated_client.patch(
        reverse('tasks-detail', args=[task.id]),
        {"title": "Hackeado"},
        format='json'
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_user_cannot_delete_other_users_task(authenticated_client):
    other_user = User.objects.create_user(
        username="other_user_delete",
        password="Senha123"
    )

    task = Task.objects.create(
        title="Não deletar",
        owner=other_user
    )

    response = authenticated_client.delete(
        reverse('tasks-detail', args=[task.id])
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND