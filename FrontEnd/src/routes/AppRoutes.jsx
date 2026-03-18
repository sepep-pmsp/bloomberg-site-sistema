import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import AuthPage from '@/modules/auth/AuthPage';
import AppLayout from '@/layouts/AppLayout';
import MetodologiaPage from '../modules/metodologia/pages/MetodologiaPage';
import DadosPage from '../modules/dados/pages/DadosPage';
import SimulaçoesPage from '../modules/simulacoes/pages/SimulaçoesPage';
import ArtigoCompleto from '../modules/metodologia/sections/ArtigoCompleto';

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
          <Route path="/sobre-o-projeto" element={<MetodologiaPage />} />
          <Route path="/cenario-atual" element={<DadosPage />} />
          <Route path="/simulacao" element={<SimulaçoesPage />} />
          <Route path='/artigo-completo' element={<ArtigoCompleto/>} />
        </Route>
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}