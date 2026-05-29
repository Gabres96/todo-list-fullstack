import api from './api';

export const authService = {
    async register(username: string, email: string, password: string): Promise<void> {
        await api.post('/users/register/', {
            username,
            email,
            password,
        });
    }
};