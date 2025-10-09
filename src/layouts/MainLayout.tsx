import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  const { navigate } = useNavigation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`bg-gray-800 text-white w-64 fixed h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
      <div className="p-4 font-bold text-lg">CELC</div>
      <nav>
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/dashboard')}>Dashboard</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/gestion-usuarios')}>Usuarios</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/gestion-lineas')}>Líneas</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/gestion-equipos')}>Equipos</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/asignaciones')}>Asignaciones</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/revisiones')}>Revisiones</li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate('/reportes')}>Reportes</li>
        </ul>
      </nav>
    </aside>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow p-4 md:ml-64">
      <div className="flex justify-between items-center">
        <button className="md:hidden" onClick={toggleSidebar}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div className="flex items-center">
          <div className="text-gray-800 dark:text-white">{user?.name}</div>
          <button onClick={logout} className="ml-4 text-sm text-gray-500 hover:text-gray-700">Logout</button>
        </div>
      </div>
    </header>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default MainLayout;