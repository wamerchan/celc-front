import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

// Define the shape of the user object
export interface User {
  id: string;
  nombres: string;
  apellidos?: string;
  email: string;
  rol: string;
  nombre?: string; // Para compatibilidad con código anterior
}

// Define the shape of the context
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load token and user from localStorage on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Validar token con el backend
        const response = await authAPI.verify();
        if (response.data.valid) {
          setToken(storedToken);
          setUser(response.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          logout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      }
    }
    setIsInitialized(true);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, isInitialized, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
