import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import AuthPage from '@/modules/auth/AuthPage';

function Metodologia() {
  return <h1>Metodologia</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>

      {/* Protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/metodologia" element={<Metodologia />} />
        </Route>
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}