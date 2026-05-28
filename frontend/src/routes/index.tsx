import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';

export const AppRoutes: React.FC = () => {
  return (<BrowserRouter> <AuthProvider>

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>

  </AuthProvider>
  </BrowserRouter>

  );
};
