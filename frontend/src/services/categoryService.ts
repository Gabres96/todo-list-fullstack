import api from './api';
import type { Category } from '../types';

export const categoryService = {

    async getCategories(): Promise<Category[]> {
        const response = await api.get('/categories/');
        return response.data.results || response.data;
    },

    async createCategory(name: string): Promise<Category> {
        const response = await api.post('/categories/', {
            name,
        });
        return response.data;
    },

    async deleteCategory(id: number): Promise<void> {
        await api.delete(`/categories/${id}/`);
    },
};