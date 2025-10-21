import { Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AppLayout from './layouts/AppLayout';
import UsersView from './views/UsersView';
import LinesView from './views/LinesView';
import EquipmentsView from './views/EquipmentsView';
import AssignmentsView from './views/AssignmentsView';
import ReviewsView from './views/ReviewsView';
import ReportsView from './views/ReportsView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRole="Administrador">
              <AppLayout>
                <UsersView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lineas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <LinesView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EquipmentsView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/asignaciones"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AssignmentsView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/revisiones"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReviewsView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReportsView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
