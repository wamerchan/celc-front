
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { useUIStore } from '../../../store/useUIStore';
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineDevicePhoneMobile,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineChartBarSquare,
} from 'react-icons/hi2';
import logoLight from '../../../assets/celc-logo1.png';
import logoDark from '../../../assets/celc-logo.png';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard',    label: 'Dashboard',    icon: <HiOutlineSquares2X2 className="w-5 h-5" /> },
  { path: '/usuarios',     label: 'Usuarios',     icon: <HiOutlineUsers className="w-5 h-5" />, adminOnly: true },
  { path: '/lineas',       label: 'Líneas',       icon: <HiOutlineDevicePhoneMobile className="w-5 h-5" /> },
  { path: '/equipos',      label: 'Equipos',      icon: <HiOutlineWrenchScrewdriver className="w-5 h-5" /> },
  { path: '/asignaciones', label: 'Asignaciones', icon: <HiOutlineClipboardDocumentList className="w-5 h-5" /> },
  { path: '/revisiones',   label: 'Revisiones',   icon: <HiOutlineDocumentMagnifyingGlass className="w-5 h-5" /> },
  { path: '/reportes',     label: 'Reportes',     icon: <HiOutlineChartBarSquare className="w-5 h-5" /> },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sidebarOpen, theme, toggleSidebar } = useUIStore();

  const isDark = theme === 'dark';

  const handleNav = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={[
        'fixed top-0 left-0 h-full w-64 z-30 flex flex-col',
        'border-r border-[var(--color-border)]/80',
        isDark ? 'bg-slate-950/80' : 'bg-white/80',
        'backdrop-blur-lg shadow-xl',
        'transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--color-border)]/80 shrink-0">
        <img
          src={isDark ? logoDark : logoLight}
          alt="CELC"
          className="w-9 h-9 object-contain"
        />
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-transparent">
          CELC
        </span>
        <div className="ml-auto">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            v2.0
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          if (item.adminOnly && user?.rol !== 'Administrador') return null;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                active
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-text)] hover:translate-x-1 border border-transparent',
              ].join(' ')}
            >
              {/* Active indicator */}
              <span
                className={[
                  'absolute left-0 w-1 h-6 rounded-r-full transition-all duration-200',
                  active ? 'bg-emerald-500 opacity-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'opacity-0',
                ].join(' ')}
              />
              <span className={active ? 'text-emerald-500 dark:text-emerald-400' : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)]'}>
                {item.icon}
              </span>
              <span className="font-semibold">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="shrink-0 px-4 py-4 border-t border-[var(--color-border)]/80">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-surface-2)]/40 border border-[var(--color-border)]/55">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-emerald-500/10">
            {user?.nombres?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-[var(--color-text)] truncate leading-none">
              {user?.nombres} {user?.apellidos}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] truncate mt-1 leading-none">{user?.rol}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
