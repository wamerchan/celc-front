import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { useUIStore } from '../../../store/useUIStore';
import { HiOutlineSun, HiOutlineMoon, HiOutlineBars3, HiOutlineArrowRightOnRectangle, HiOutlineChevronDown } from 'react-icons/hi2';

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme, toggleSidebar } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = [user?.nombres?.charAt(0), user?.apellidos?.charAt(0)]
    .filter(Boolean).join('').toUpperCase() || 'U';

  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-border)]/80 bg-[var(--color-surface)]/85 backdrop-blur-md sticky top-0 z-20 shrink-0">
      {/* Left: Mobile menu toggle */}
      <button
        onClick={() => toggleSidebar()}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-text)] transition-all border border-transparent hover:border-[var(--color-border)]/50"
        aria-label="Abrir menú"
      >
        <HiOutlineBars3 className="w-5 h-5" />
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={handleToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-text)] transition-all border border-transparent hover:border-[var(--color-border)]/50"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label="Cambiar tema"
        >
          {isDark
            ? <HiOutlineSun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            : <HiOutlineMoon className="w-5 h-5 text-indigo-400" />
          }
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[var(--color-surface-2)]/60 transition-all border border-transparent hover:border-[var(--color-border)]/40"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/10">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[var(--color-text)] leading-none">
                {user?.nombres}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] leading-none mt-1">{user?.rol}</p>
            </div>
            <HiOutlineChevronDown
              className={`w-4 h-4 text-[var(--color-text-subtle)] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/95 backdrop-blur-lg shadow-xl py-1 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-[var(--color-border)]/80">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                  {user?.nombres} {user?.apellidos}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate mt-1">{user?.email}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-500/10 transition-colors rounded-b-xl"
              >
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
