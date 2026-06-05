import { create } from 'zustand';
import { authEndpoints } from '../../../shared/api/endpoints';

export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('celc-token'),
  user: JSON.parse(localStorage.getItem('celc-user') || 'null'),
  isAuthenticated: !!localStorage.getItem('celc-token'),
  loading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await authEndpoints.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('celc-token', token);
      localStorage.setItem('celc-user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('celc-token');
    localStorage.removeItem('celc-user');
    set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
    // Redirect limpio sin history stack contaminado
    window.location.replace('/login');
  },

  checkSession: async () => {
    const { token } = get();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const response = await authEndpoints.verify();
      if (response.data?.valid && response.data?.user) {
        const user = response.data.user;
        localStorage.setItem('celc-user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isInitialized: true });
      } else {
        get().logout();
      }
    } catch {
      get().logout();
      set({ isInitialized: true });
    }
  },
}));
