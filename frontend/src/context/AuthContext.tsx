import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import type { User } from '../types';

interface TokenPayload {
  user_id: number;
  username?: string;
  exp: number;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(username: string, pass: string): Promise<void>;
  signOut(): void;
  logout(): void;
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
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
    setLoading(false);
  }, []);

  async function signIn(username: string, pass: string) {
    try {
      const response = await api.post('/users/token/', { username, password: pass });
      const { access } = response.data;
      
      const decoded = jwtDecode<TokenPayload>(access);
      const realUserId = decoded.user_id;

      const realUser = {
        id: realUserId,
        username,
        email: '',
      };
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      localStorage.setItem('@TodoApp:token', access);
      localStorage.setItem('@TodoApp:user', JSON.stringify(realUser));

      setUser(realUser);
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Usuário ou senha inválidos');
    }
  }  

  function signOut() {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('@TodoApp:token');
    localStorage.removeItem('@TodoApp:user');
    setUser(null);
  }

  const logout = signOut; 

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}