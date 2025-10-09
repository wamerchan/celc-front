import { useAuth } from './context/AuthContext';
import { useNavigation } from './context/NavigationContext';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';

import MainLayout from './layouts/MainLayout';
import UsersView from './views/UsersView';
import LinesView from './views/LinesView';
import EquipmentsView from './views/EquipmentsView';
import AssignmentsView from './views/AssignmentsView';
import ReviewsView from './views/ReviewsView';
import ReportsView from './views/ReportsView';

// A simple component to act as a router
const AppRouter = () => {
  const { route } = useNavigation();

  let currentView;
  switch (route) {
    case '/dashboard':
      currentView = <DashboardView />;
      break;
    case '/gestion-usuarios':
      currentView = <UsersView />;
      break;
    case '/gestion-lineas':
      currentView = <LinesView />;
      break;
    case '/gestion-equipos':
      currentView = <EquipmentsView />;
      break;
    case '/asignaciones':
      currentView = <AssignmentsView />;
      break;
    case '/revisiones':
      currentView = <ReviewsView />;
      break;
    case '/reportes':
      currentView = <ReportsView />;
      break;
    default:
      currentView = <DashboardView />; // Default to dashboard
      break;
  }

  return <MainLayout>{currentView}</MainLayout>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      {isAuthenticated ? <AppRouter /> : <LoginView />}
    </div>
  );
}

export default App;
