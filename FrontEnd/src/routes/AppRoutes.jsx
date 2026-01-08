import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import AuthPage from '@/modules/auth/AuthPage';
import AppLayout from '@/layouts/AppLayout';
import MetodologiaPage from '../modules/metodologia/pages/MetodologiaPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>

      {/* Protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/metodologia" element={<MetodologiaPage />} />
        </Route>
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}