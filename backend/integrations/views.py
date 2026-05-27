import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .services import WeatherService

class WeatherAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        city_name = request.query_params.get('city', 'Brasil')
        
        try:
            response = WeatherService.get_current_weather(city_name=city_name)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", {})
                
                weather_data = {
                    "temp": results.get("temp"),
                    "description": results.get("description"),
                    "currently": results.get("currently"),
                    "city": results.get("city"),
                    "humidity": results.get("humidity"),
                    "wind_speedy": results.get("wind_speedy")
                }
                
                return Response({
                    "status": "success",
                    "integration": "HG Brasil Weather API",
                    "weather": weather_data
                }, status=status.HTTP_200_OK)
                
            return Response({
                "status": "error",
                "message": f"A API externa retornou um erro HTTP. Código de status: {response.status_code}."
            }, status=status.HTTP_502_BAD_GATEWAY)

        except requests.exceptions.Timeout:
            return Response({
                "status": "error",
                "message": "Erro de Timeout: A API externa demorou demais para responder (limite de 5 segundos excedido)."
            }, status=status.HTTP_504_GATEWAY_TIMEOUT)
            
        except requests.exceptions.ConnectionError:
            return Response({
                "status": "error",
                "message": "Erro de Conexão: Não foi possível estabelecer comunicação com o servidor da API externa. Verifique a internet."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        except requests.exceptions.RequestException as e:
            return Response({
                "status": "error",
                "message": f"Erro inesperado na integração: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)