import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  notifications: ToastNotification[];
  toggleSidebar: (open?: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: (localStorage.getItem('celc-theme') as 'dark' | 'light') || 'dark',
  notifications: [],

  toggleSidebar: (open) =>
    set((state) => ({
      sidebarOpen: open !== undefined ? open : !state.sidebarOpen,
    })),

  setTheme: (theme) => {
    localStorage.setItem('celc-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  addNotification: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
