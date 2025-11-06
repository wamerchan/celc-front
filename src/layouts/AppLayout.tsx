import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMoon, HiSun, HiMenu, HiLogout, HiUser } from 'react-icons/hi';
import logoLight from '../assets/celc-logo1.png';
import logoDark from '../assets/celc-logo.png';

const Sidebar = ({ isOpen, toggleSidebar, isDark }: { isOpen: boolean; toggleSidebar: () => void; isDark: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/usuarios', label: 'Usuarios', icon: '👥', adminOnly: true },
    { path: '/lineas', label: 'Líneas', icon: '📞' },
    { path: '/equipos', label: 'Equipos', icon: '🔧' },
    { path: '/asignaciones', label: 'Asignaciones', icon: '📋' },
    { path: '/revisiones', label: 'Revisiones', icon: '🔍' },
    { path: '/reportes', label: 'Reportes', icon: '📈' },
  ];

  return (
    <aside className={`sidebar fixed h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 slide-in`}>
      <div className="sidebar-header">
        <div className="flex items-center space-x-2">
          {/* Logo CELC que cambia según el modo - 23 de octubre de 2025 - WM Developer */}
          <img 
            src={isDark ? logoDark : logoLight} 
            alt="CELC Logo" 
            className="size-12 object-contain"
          />
          <span className="font-extrabold text-3xl">CELC</span>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if (item.adminOnly && user?.rol !== 'Administrador') return null;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="sidebar-nav-item w-full text-left"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

const Header = ({ toggleSidebar, isDark, setIsDark }: { toggleSidebar: () => void; isDark: boolean; setIsDark: (value: boolean) => void }) => {
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="header">
      <div className="flex justify-between items-center">
        <button className="md:hidden btn btn-ghost p-2" onClick={toggleSidebar}>
          <HiMenu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <HiUser className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{user?.nombre || user?.nombres}</div>
                <div className="text-xs text-muted-foreground">{user?.rol}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-ghost p-2 text-muted-foreground hover:text-foreground"
              title="Cerrar sesión"
            >
              <HiLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isDark={isDark} />
      <div className="md:ml-64">
        <Header toggleSidebar={toggleSidebar} isDark={isDark} setIsDark={setIsDark} />
        <main className="page-container fade-in">
          {children}
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-10 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;