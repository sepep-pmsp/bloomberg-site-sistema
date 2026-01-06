import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  // Enquanto valida sessão (cookie / token)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Carregando...</span>
      </div>
    );
  }

  // Não autenticado → login
  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Autenticado → libera rotas internas
  return <Outlet />;
}
