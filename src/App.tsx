import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore';
import AppLayout from './layouts/AppLayout';
import { Spinner } from './shared/components/ui/Spinner';

// Views (lazy no requerido aún — se agrega cuando haya más páginas)
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import UsersView from './views/UsersView';
import LinesView from './views/LinesView';
import EquipmentsView from './views/EquipmentsView';
import AssignmentsView from './views/AssignmentsView';
import ReviewsView from './views/ReviewsView';
import ReportsView from './views/ReportsView';

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'Administrador' | 'Técnico' | 'Empleado';
}) {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.rol !== requiredRole) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function App() {
  const { checkSession, isInitialized } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[var(--color-text-muted)]">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><DashboardView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/usuarios" element={
        <ProtectedRoute requiredRole="Administrador">
          <AppLayout><UsersView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/lineas" element={
        <ProtectedRoute>
          <AppLayout><LinesView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/equipos" element={
        <ProtectedRoute>
          <AppLayout><EquipmentsView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/asignaciones" element={
        <ProtectedRoute>
          <AppLayout><AssignmentsView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/revisiones" element={
        <ProtectedRoute>
          <AppLayout><ReviewsView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/reportes" element={
        <ProtectedRoute>
          <AppLayout><ReportsView /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
