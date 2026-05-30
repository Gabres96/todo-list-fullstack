import React from 'react';

interface MessageProps {
    text: string;
    type?: 'success' | 'error';
}

export const Message: React.FC<MessageProps> = ({
    text,
    type = 'success',
}) => {
    if (!text) return null;

    return (
        <div
            style={{
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                backgroundColor:
                    type === 'success'
                        ? '#d4edda'
                        : '#f8d7da',
                color:
                    type === 'success'
                        ? '#155724'
                        : '#721c24',
                border:
                    type === 'success'
                        ? '1px solid #c3e6cb'
                        : '1px solid #f5c6cb',
            }}
        >
            {text}
        </div>
    );
};