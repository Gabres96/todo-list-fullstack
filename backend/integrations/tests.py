import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from integrations.services import WeatherService

pytestmark = pytest.mark.django_db


@pytest.fixture
def authenticated_client():
    api_client = APIClient()
    User.objects.create_user(username="gabriel_integrations", password="Senha123")
    
    login_url = reverse('token_obtain_pair')
    response = api_client.post(login_url, {"username": "gabriel_integrations", "password": "Senha123"}, format='json')
    
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return api_client


def test_get_current_weather_success(authenticated_client, requests_mock):
    """Testa o sucesso da integração filtrando os dados do clima de uma cidade"""
    mock_payload = {
        "results": {
            "temp": 25,
            "description": "Ensolarado",
            "currently": "dia",
            "city": "Curitiba, PR",
            "humidity": 60,
            "wind_speedy": "12 km/h"
        }
    }
    requests_mock.get(WeatherService.BASE_URL, json=mock_payload, status_code=200)

    response = authenticated_client.get(reverse('current-weather'), {'city': 'Curitiba'})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"
    assert response.data["weather"]["city"] == "Curitiba, PR"
    assert response.data["weather"]["temp"] == 25


def test_get_current_weather_external_error(authenticated_client, requests_mock):
    """Testa o comportamento do sistema quando a API de clima retorna erro 500"""
    requests_mock.get(WeatherService.BASE_URL, status_code=500)

    response = authenticated_client.get(reverse('current-weather'), {'city': 'Curitiba'})

    assert response.status_code == status.HTTP_502_BAD_GATEWAY
    assert response.data["status"] == "error"