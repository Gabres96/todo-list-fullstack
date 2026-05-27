import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(username: string, pass: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedToken = localStorage.getItem('@TodoApp:token');
    const storagedUser = localStorage.getItem('@TodoApp:user');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  async function signIn(username: string, pass: string) {
    try {
      const response = await api.post('/users/token/', { username, password: pass });
    
      const { access, user: userData } = response.data;

      localStorage.setItem('@TodoApp:token', access);
      localStorage.setItem('@TodoApp:user', JSON.stringify(userData || { username }));

      setUser(userData || { id: 0, username, email: '' });
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Usuário ou senha inválidos');
    }
  }

  function signOut() {
    localStorage.removeItem('@TodoApp:token');
    localStorage.removeItem('@TodoApp:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}