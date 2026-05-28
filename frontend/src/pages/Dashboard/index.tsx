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

    const { user, logout } = useAuth();

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

    async function handleShareTask(id: number, username: string) {
        try {
            const updatedTask = await taskService.shareTask(id, username);

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );

            alert(`Tarefa compartilhada com @${username} com sucesso!`);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Erro ao compartilhar tarefa.';
            alert(errorMsg);
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e0e0'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>
                        Olá, <span style={{ color: '#007bff' }}>@{user?.username}</span> 👋
                    </h2>
                    
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.5rem 1.2rem',
                            backgroundColor: '#fff',
                            color: '#dc3545',
                            border: '1px solid #dc3545',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc3545';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = '#dc3545';
                        }}
                    >
                        Sair da Conta
                    </button>
                </div>

                {weather && (
                    <div
                        style={{
                            background: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>Clima em {weather.city}</h3>
                        <p style={{ margin: '0.2rem 0' }}>Temperatura: {weather.temp}°C</p>
                        <p style={{ margin: '0.2rem 0', color: '#666' }}>{weather.description}</p>
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
                    onShare={handleShareTask}
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