import pytest

from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_user_can_register(api_client):
    response = api_client.post(
        reverse('register'),
        {
            "username": "gabriel",
            "email": "gabriel@email.com",
            "password": "Senha123"
        },
        format='json'
    )

    assert response.status_code == status.HTTP_201_CREATED

    assert response.data["username"] == "gabriel"

    assert User.objects.filter(username="gabriel").exists()


def test_user_can_login(api_client):
    User.objects.create_user(
        username="gabriel",
        password="Senha123"
    )

    response = api_client.post(
        reverse('token_obtain_pair'),
        {
            "username": "gabriel",
            "password": "Senha123"
        },
        format='json'
    )

    assert response.status_code == status.HTTP_200_OK

    assert "access" in response.data
    assert "refresh" in response.data


def test_user_cannot_login_with_invalid_credentials(api_client):
    User.objects.create_user(
        username="gabriel",
        password="Senha123"
    )

    response = api_client.post(
        reverse('token_obtain_pair'),
        {
            "username": "gabriel",
            "password": "senha_errada"
        },
        format='json'
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_user_cannot_access_protected_route_without_token(api_client):
    response = api_client.get(
        reverse('tasks-list')
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED