import React from 'react';

import type { Task } from '../../types';

interface TaskListProps {
    tasks: Task[];
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggle,
    onDelete,
    onEdit,
}) => {
    if (tasks.length === 0) {
        return (
            <div
                style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                Nenhuma tarefa encontrada.
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            {tasks.map((task) => (
                <div
                    key={task.id}
                    style={{
                        background: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #ddd',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                textDecoration: task.completed
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            {task.title}
                        </h3>

                        {task.description && (
                            <p
                                style={{
                                    marginTop: '0.5rem',
                                    color: '#666',
                                }}
                            >
                                {task.description}
                            </p>
                        )}

                        <small>
                            Status:{' '}
                            {task.completed
                                ? 'Concluída'
                                : 'Pendente'}
                        </small>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                        }}
                    >
                        <button
                            onClick={() => onToggle(task)}
                            style={{
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            {task.completed
                                ? 'Desmarcar'
                                : 'Concluir'}
                        </button>

                        <button
                            onClick={() => onEdit(task)}
                            style={{
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => onDelete(task.id)}
                            style={{
                                padding: '0.5rem',
                                background: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};