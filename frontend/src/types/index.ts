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
  is_completed: boolean;
  category?: Category;
  owner: number;
  shared_with: number[];
}