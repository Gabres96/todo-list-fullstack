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
    category?: number | Category;
    owner: number;
    owner_username?: string;
    shared_with: number[];
    shared_with_details?: User[];
}