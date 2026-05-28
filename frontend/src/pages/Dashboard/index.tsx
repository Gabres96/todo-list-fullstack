import React, { useEffect, useState } from 'react';

import { useAuth } from '../../context/AuthContext';

import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import { integrationService } from '../../services/integrationService';

import type { Task, Category } from '../../types';

import { Header } from '../../components/common/Header';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskList } from '../../components/tasks/TaskList';

interface TaskFilters {
    completed?: boolean;
    category?: number;
    page?: number;
}

export const Dashboard: React.FC = () => {

    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<any>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const PAGE_SIZE = 10;

    async function fetchTasks() {
        try {
            const filters: TaskFilters = {
                page: currentPage
            };

            if (statusFilter !== 'all') {
                filters.completed = statusFilter === 'completed';
            }

            if (categoryFilter !== 'all') {
                filters.category = Number(categoryFilter);
            }

            const tasksResponse = await taskService.getTasks(filters);

            setTasks(tasksResponse.results);
            setTotalPages(Math.ceil(tasksResponse.count / PAGE_SIZE) || 1);
        } catch (error) {
            console.error('Erro ao buscar tarefas filtradas:', error);
        }
    }

    async function loadDashboardData() {
        try {
            setLoading(true);

            const [
                categoriesResponse,
                weatherResponse,
            ] = await Promise.all([
                categoryService.getCategories(),
                integrationService.getWeather(),
            ]);

            setCategories(categoriesResponse);
            setWeather(weatherResponse);

        } catch (error) {
            console.error('Erro ao carregar dados fixos do dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [currentPage, statusFilter, categoryFilter]);


    async function handleCreateTask(
        title: string,
        description: string,
        category?: number
    ) {
        try {
            await taskService.createTask({
                title,
                description,
                category,
                completed: false,
                shared_with: [],
            });

            setCurrentPage(1);
            fetchTasks();
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
        }
    }

    async function handleUpdateTask(
        id: number,
        title: string,
        description: string,
        category?: number
    ) {
        try {
            const updatedTask =
                await taskService.updateTask(id, {
                    title,
                    description,
                    category,
                });

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                )
            );

            setEditingTask(null);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    async function handleToggleTask(task: Task) {
        try {
            await taskService.toggleTask(task);
            fetchTasks();
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
        }
    }

    async function handleDeleteTask(id: number) {
        try {
            await taskService.deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    }

    const handleSelectEditTask = (task: Task) => {
        setEditingTask(task);
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem' }}> Carregando... </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'sans-serif',
            }}
        >
            <Header />

            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '2rem',
                }}
            >
                <h1>Olá, {user?.username}</h1>

                {weather && (
                    <div
                        style={{
                            background: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                        }}
                    >
                        <h3>Clima em {weather.city}</h3>
                        <p>Temperatura: {weather.temp}°C</p>
                        <p>{weather.description}</p>
                    </div>
                )}

                <TaskForm
                    categories={categories}
                    onCreateTask={handleCreateTask}
                    onUpdateTask={handleUpdateTask}
                    editingTask={editingTask}
                />

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    margin: '2rem 0',
                    background: '#fff',
                    padding: '1.2rem',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Filtrar por Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="all">Todas as tarefas</option>
                            <option value="pending">Pendentes</option>
                            <option value="completed">Concluídas</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Filtrar por Categoria</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="all">Todas as categorias</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <TaskList
                    tasks={tasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleSelectEditTask}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginTop: '2.5rem'
                }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        style={{
                            padding: '0.5rem 1.2rem',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === 1 ? '#ddd' : '#007bff',
                            color: currentPage === 1 ? '#777' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        Anterior
                    </button>

                    <span style={{ fontWeight: '500', color: '#444' }}>
                        Página <strong>{currentPage}</strong> de {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        style={{
                            padding: '0.5rem 1.2rem',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === totalPages ? '#ddd' : '#007bff',
                            color: currentPage === totalPages ? '#777' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        Próxima
                    </button>
                </div>

            </div>
        </div>
    );
};