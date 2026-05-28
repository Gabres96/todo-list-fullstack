export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    owner: number;
    owner_username?: string;
    category?: number;
    shared_with: number[];
    shared_with_details?: Array<{ id: number; username: string }>;
}