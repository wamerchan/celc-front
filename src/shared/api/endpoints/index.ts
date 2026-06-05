import { apiClient } from '../client';
import type {
  Equipo,
  Linea,
  Asignacion,
  Revision,
  Usuario,
  CreateEquipoDto,
  CreateLineaDto,
  CreateAsignacionDto,
  CreateRevisionDto,
  CreateUsuarioDto,
  DashboardMetrics,
} from '../../types/api.types';

// Auth
export const authEndpoints = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: Omit<Usuario, 'rolId'> }>('/auth/login', { email, password }),
  verify: () =>
    apiClient.get<{ valid: boolean; user: Omit<Usuario, 'rolId'> }>('/auth/verify'),
};

// Usuarios
export const usuariosEndpoints = {
  getAll: () => apiClient.get<Usuario[]>('/usuarios'),
  getById: (id: number) => apiClient.get<Usuario>(`/usuarios/${id}`),
  create: (data: CreateUsuarioDto) => apiClient.post<Usuario>('/usuarios', data),
  update: (id: number, data: Partial<CreateUsuarioDto>) => apiClient.put<Usuario>(`/usuarios/${id}`, data),
  delete: (id: number) => apiClient.delete(`/usuarios/${id}`),
};

// Equipos
export const equiposEndpoints = {
  getAll: () => apiClient.get<Equipo[]>('/equipos'),
  getById: (id: number) => apiClient.get<Equipo>(`/equipos/${id}`),
  create: (data: CreateEquipoDto) => apiClient.post<Equipo>('/equipos', data),
  update: (id: number, data: Partial<CreateEquipoDto>) => apiClient.put<Equipo>(`/equipos/${id}`, data),
  delete: (id: number) => apiClient.delete(`/equipos/${id}`),
};

// Líneas
export const lineasEndpoints = {
  getAll: () => apiClient.get<Linea[]>('/lineas'),
  getById: (id: number) => apiClient.get<Linea>(`/lineas/${id}`),
  create: (data: CreateLineaDto) => apiClient.post<Linea>('/lineas', data),
  update: (id: number, data: Partial<CreateLineaDto>) => apiClient.put<Linea>(`/lineas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/lineas/${id}`),
  toggleStatus: (id: number) => apiClient.put<Linea>(`/lineas/${id}/toggle`),
};

// Asignaciones
export const asignacionesEndpoints = {
  getAll: () => apiClient.get<Asignacion[]>('/asignaciones'),
  getById: (id: number) => apiClient.get<Asignacion>(`/asignaciones/${id}`),
  create: (data: CreateAsignacionDto) => apiClient.post<Asignacion>('/asignaciones', data),
  update: (id: number, data: Partial<CreateAsignacionDto>) => apiClient.put<Asignacion>(`/asignaciones/${id}`, data),
  delete: (id: number) => apiClient.delete(`/asignaciones/${id}`),
};

// Revisiones
export const revisionesEndpoints = {
  getAll: () => apiClient.get<Revision[]>('/revisiones'),
  getById: (id: number) => apiClient.get<Revision>(`/revisiones/${id}`),
  create: (data: CreateRevisionDto) => apiClient.post<Revision>('/revisiones', data),
  update: (id: number, data: Partial<CreateRevisionDto>) => apiClient.put<Revision>(`/revisiones/${id}`, data),
};

// Métricas / Dashboard
export const metricasEndpoints = {
  getDashboard: () => apiClient.get<DashboardMetrics>('/metricas/dashboard'),
  getLineasActivas: () => apiClient.get<{ count: number }>('/metricas/lineas-activas'),
  getEquiposEnReparacion: () => apiClient.get<{ count: number }>('/metricas/equipos-reparacion'),
  getRevisionesProximas: () => apiClient.get<{ count: number }>('/metricas/revisiones-proximas'),
};

// Reportes
export const reportesEndpoints = {
  getLineas: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/reportes/lineas', { params }),
  getEquipos: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/reportes/equipos', { params }),
  getAsignaciones: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/reportes/asignaciones', { params }),
};
