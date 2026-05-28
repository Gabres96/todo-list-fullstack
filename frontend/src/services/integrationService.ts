import api from './api';

export interface WeatherData {
    temp: number;
    description: string;
    city: string;
    humidity: number;
    wind_speedy: string;
}

export const integrationService = {

    async getWeather(city = 'Curitiba') {
        const response = await api.get('/integrations/weather/', {
            params: {
                city,
            },
        });

        return response.data.weather as WeatherData;

    },
};
