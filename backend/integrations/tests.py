import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


@pytest.fixture
def authenticated_client():
    api_client = APIClient()
    User.objects.create_user(username="gabriel_integrations", password="Senha123")
    
    login_url = reverse('token_obtain_pair')
    response = api_client.post(login_url, {"username": "gabriel_integrations", "password": "Senha123"}, format='json')
    
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return api_client


def test_get_daily_advice_success(authenticated_client, requests_mock):
    requests_mock.get("https://api.adviceslip.com/advice", json={"slip": {"advice": "Texto"}}, status_code=200)

    response = authenticated_client.get(reverse('daily-advice'))

    assert response.status_code == status.HTTP_200_OK
    assert "advice" in response.data


def test_get_daily_advice_external_error(authenticated_client, requests_mock):
    requests_mock.get("https://api.adviceslip.com/advice", status_code=500)

    response = authenticated_client.get(reverse('daily-advice'))

    assert response.status_code in [status.HTTP_502_BAD_GATEWAY, status.HTTP_500_INTERNAL_SERVER_ERROR]