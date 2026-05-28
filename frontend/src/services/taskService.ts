import api from './api';
import type { Task } from '../types';

interface TaskResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Task[];
}

export interface TaskFilters {
    completed?: boolean;
    category?: number;
    page?: number;
}

export const taskService = {
    async getTasks(filters?: TaskFilters): Promise<TaskResponse> {
        const response = await api.get('/tasks/', {
            params: filters,
        });
        return response.data;
    },

    async createTask(data: Partial<Task>): Promise<Task> {
        const response = await api.post('/tasks/', data);
        return response.data;
    },

    async updateTask(id: number, data: Partial<Task>): Promise<Task> {
        const response = await api.put(`/tasks/${id}/`, data);
        return response.data;
    },

    async deleteTask(id: number): Promise<void> {
        await api.delete(`/tasks/${id}/`);
    },

    async toggleTask(task: Task): Promise<Task> {
        const response = await api.patch(`/tasks/${task.id}/`, {
            completed: !task.completed,
        });
        return response.data;
    },

    async shareTask(id: number, username: string): Promise<Task> {
        const response = await api.post(`/tasks/${id}/share/`, {
            username,
        });
        return response.data;
    },
};