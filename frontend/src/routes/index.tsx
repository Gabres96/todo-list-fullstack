import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

const LoginMock = () => <div style={{ padding: 20 }}><h2>Tela de Login (Em breve)</h2></div>;
const DashboardMock = () => <div style={{ padding: 20 }}><h2>Dashboard de Tarefas (Protegido)</h2></div>;

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginMock />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardMock />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};