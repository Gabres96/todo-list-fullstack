import React, { useState } from 'react';
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext'; 

interface TaskListProps {
    tasks: Task[];
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
    onShare: (id: number, username: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggle,
    onDelete,
    onEdit,
    onShare,
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
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShare={onShare}
                />
            ))}
        </div>
    );
};

interface TaskItemProps {
    task: Task;
    onToggle: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onShare: (id: number, username: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete, onShare }) => {
    const { user } = useAuth();
    const [usernameToShare, setUsernameToShare] = useState('');

    const isSharedWithMe = user && task.owner !== user.id;

    const handleShareSubmit = () => {
        if (!usernameToShare.trim()) return;
        onShare(task.id, usernameToShare.trim());
        setUsernameToShare('');
    };

    return (
        <div
            style={{
                background: '#fff',
                padding: '1.2rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: isSharedWithMe ? '1px dashed #17a2b8' : '1px solid #ddd',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                backgroundColor: isSharedWithMe ? '#fafdfd' : '#fff'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3
                        style={{
                            margin: 0,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#888' : '#000'
                        }}
                    >
                        {task.title}
                    </h3>

                    {task.description && (
                        <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.95rem' }}>
                            {task.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                        <small style={{ color: '#555' }}>
                            <strong>Status:</strong> {task.completed ? 'Concluída' : 'Pendente'}
                        </small>

                        {isSharedWithMe ? (
                            <span style={{
                                backgroundColor: '#e3f2fd',
                                color: '#0d47a1',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                width: 'fit-content',
                                marginTop: '0.2rem'
                            }}>
                                👥 Compartilhada por: @{task.owner_username || `Usuário #${task.owner}`}
                            </span>
                        ) : (
                            task.shared_with_details && task.shared_with_details.length > 0 && (
                                <small style={{ color: '#17a2b8' }}>
                                    <strong>Compartilhada com:</strong> {task.shared_with_details.map(u => `@${u.username}`).join(', ')}
                                </small>
                            )
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onToggle(task)}
                        style={{ padding: '0.5rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#f8f9fa' }}
                    >
                        {task.completed ? 'Desmarcar' : 'Concluir'}
                    </button>

                    {!isSharedWithMe && (
                        <>
                            <button
                                onClick={() => onEdit(task)}
                                style={{ padding: '0.5rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#f8f9fa' }}
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => onDelete(task.id)}
                                style={{ padding: '0.5rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Excluir
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!isSharedWithMe && (
                <div
                    style={{
                        borderTop: '1px solid #eee',
                        paddingTop: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Username do amigo..."
                        value={usernameToShare}
                        onChange={(e) => setUsernameToShare(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleShareSubmit()}
                        style={{
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '0.85rem',
                            width: '200px'
                        }}
                    />
                    <button
                        onClick={handleShareSubmit}
                        style={{
                            padding: '0.4rem 1rem',
                            background: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Compartilhar
                    </button>
                </div>
            )}
        </div>
    );
};