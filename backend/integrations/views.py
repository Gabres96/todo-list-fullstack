import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class DailyAdviceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = "https://api.adviceslip.com/advice"
        
        try:
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                advice = data.get('slip', {}).get('advice', 'Erro: Resposta da API externa veio vazia ou em formato inesperado.')
                
                return Response({
                    "status": "success",
                    "integration": "Advice Slip API",
                    "advice": advice
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
                "message": "Erro de Conexão: Não foi possível estabelecer comunicação com o servidor da API externa. Verifique a internet ou o endereço da URL."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        except requests.exceptions.RequestException as e:
            return Response({
                "status": "error",
                "message": f"Erro inesperado na integração: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)