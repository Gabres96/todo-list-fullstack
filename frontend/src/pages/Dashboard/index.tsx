import React, {
    useEffect,
    useState,
} from 'react';

import { useAuth } from '../../context/AuthContext';

import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import { integrationService } from '../../services/integrationService';

import type {
    Task,
    Category,
} from '../../types';

import { Header } from '../../components/common/Header';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskList } from '../../components/tasks/TaskList';

export const Dashboard: React.FC = () => {

    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const [weather, setWeather] = useState<any>(null);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    async function loadDashboardData() {
        try {
            setLoading(true);


            const [
                tasksResponse,
                categoriesResponse,
                weatherResponse,
            ] = await Promise.all([
                taskService.getTasks(),
                categoryService.getCategories(),
                integrationService.getWeather(),
            ]);

            setTasks(tasksResponse.results);
            setCategories(categoriesResponse);
            setWeather(weatherResponse);

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);

        } finally {
            setLoading(false);
        }


    }

    async function handleCreateTask(
        title: string,
        description: string,
        category?: number
    ) {
        try {
            const newTask = await taskService.createTask({
                title,
                description,
                category,
                completed: false,
                shared_with: [],
            });


            setTasks((prev) => [newTask, ...prev]);

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
            console.error(
                'Erro ao atualizar tarefa:',
                error
            );
        }
    }

    async function handleToggleTask(task: Task) {
        try {
            const updatedTask =
                await taskService.toggleTask(task);


            setTasks((prev) =>
                prev.map((item) =>
                    item.id === updatedTask.id
                        ? updatedTask
                        : item
                )
            );

        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }


    }

    async function handleDeleteTask(id: number) {
        try {
            await taskService.deleteTask(id);


            setTasks((prev) =>
                prev.filter((task) => task.id !== id)
            );

        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }

    }

    const handleSelectEditTask = (task: Task) => {
        setEditingTask(task);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '2rem' }}>
                Carregando... </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'sans-serif',
            }}
        > <Header />

            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '2rem',
                }}
            >
                <h1>
                    Olá, {user?.username}
                </h1>

                {weather && (
                    <div
                        style={{
                            background: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                        }}
                    >
                        <h3>
                            Clima em {weather.city}
                        </h3>

                        <p>
                            Temperatura:
                            {' '}
                            {weather.temp}°C
                        </p>

                        <p>
                            {weather.description}
                        </p>
                    </div>
                )}

                <TaskForm
                    categories={categories}
                    onCreateTask={handleCreateTask}
                    onUpdateTask={handleUpdateTask}
                    editingTask={editingTask}
                />

                <TaskList
                    tasks={tasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleSelectEditTask}
                />
            </div>
        </div>


    );
};
