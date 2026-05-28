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
shared_with: number[];
}
