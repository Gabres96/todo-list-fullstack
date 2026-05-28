import React, {
    useEffect,
    useState,
} from 'react';

import type {
    Category,
    Task,
} from '../../types';

interface TaskFormProps {

    categories: Category[];

    editingTask: Task | null;

    onCreateTask: (
        title: string,
        description: string,
        category?: number
    ) => void;

    onUpdateTask: (
        id: number,
        title: string,
        description: string,
        category?: number
    ) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    categories,
    editingTask,
    onCreateTask,
    onUpdateTask,
}) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {

        if (editingTask) {

            setTitle(editingTask.title);

            setDescription(
                editingTask.description || ''
            );

            setCategory(
                editingTask.category
                    ? String(editingTask.category)
                    : ''
            );
        }

    }, [editingTask]);

    function clearForm() {
        setTitle('');
        setDescription('');
        setCategory('');
    }

    function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        if (editingTask) {

            onUpdateTask(
                editingTask.id,
                title,
                description,
                category
                    ? Number(category)
                    : undefined
            );

        } else {

            onCreateTask(
                title,
                description,
                category
                    ? Number(category)
                    : undefined
            );
        }

        clearForm();
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >

            <h2>
                {editingTask
                    ? 'Editar Tarefa'
                    : 'Criar Nova Tarefa'}
            </h2>

            <input
                type="text"
                placeholder="Título da tarefa"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                }}
            />

            <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) =>
                    setDescription(e.target.value)
                }
                rows={4}
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    resize: 'vertical',
                }}
            />

            <select
                value={category}
                onChange={(e) =>
                    setCategory(e.target.value)
                }
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                }}
            >

                <option value="">
                    Sem categoria
                </option>

                {categories.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {item.name}
                    </option>
                ))}

            </select>

            <button
                type="submit"
                style={{
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                {editingTask
                    ? 'Atualizar Tarefa'
                    : 'Criar Tarefa'}
            </button>

        </form>
    );
};