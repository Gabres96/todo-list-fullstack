import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            setLoading(true);
            await authService.register(username, email, password);
            
            alert('Conta criada com sucesso! Redirecionando para o login...');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.username?.[0] || err.response?.data?.error || 'Erro ao criar conta. Tente outro username.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333', margin: 0 }}>Criar Conta</h2>

                {error && (
                    <div style={{ color: '#721c24', background: '#f8d7da', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Confirme a Senha</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.7rem',
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? 'Cadastrando...' : 'Registrar'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Já tem uma conta?{' '}
                    <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                        Faça Login
                    </Link>
                </div>
            </div>
        </div>
    );
};