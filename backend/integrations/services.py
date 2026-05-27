import requests

class WeatherService:
    BASE_URL = "https://api.hgbrasil.com/weather"

    @classmethod
    def get_current_weather(cls, city_name="Brasil"):
       
        params = {
            "format": "json",
            "city_name": city_name
        }
        
        # Faz a requisição HTTP com limite de 5 segundos
        response = requests.get(cls.BASE_URL, params=params, timeout=5)
        return response