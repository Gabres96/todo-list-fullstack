import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('@TodoApp:token');

    const publicRoutes = [
      '/users/register/',
      '/users/login/',
    ];

    const isPublicRoute = publicRoutes.some(
      route => config.url?.includes(route)
    );

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;