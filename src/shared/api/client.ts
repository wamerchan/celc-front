import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instancia propia — NUNCA mutar axios.defaults globales
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// REQUEST: inyectar token desde el store (fuente única de verdad)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE: logout automático en 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido — limpiar sesión y redirigir
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
