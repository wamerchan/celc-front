import axios from 'axios';

// Types
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_creacion: string;
}

export interface Line {
  id: number;
  numero: string;
  estado: string;
  plan: string;
  fecha_creacion: string;
}

export interface Equipment {
  id: number;
  modelo: string;
  marca: string;
  estado: string;
  fecha_adquisicion: string;
}

export interface Assignment {
  id: number;
  id_usuario: number;
  id_equipo: number;
  id_linea: number;
  fecha_asignacion: string;
}

export interface Review {
  id: number;
  equipment: string;
  date: string;
  result: string;
  equipoId: string;
  fecha: string;
  resultado: string;
}

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    axios.post('/auth/login', { email, password }),
};

// Users API
export const usersAPI = {
  getUsers: () => axios.get('/usuarios'),
  createUser: (user: { nombre: string; email: string; rol: string }) =>
    axios.post('/usuarios', user),
  updateUser: (id: string, user: { nombre: string; email: string; rol: string }) =>
    axios.put(`/usuarios/${id}`, user),
  deleteUser: (id: string) => axios.delete(`/usuarios/${id}`),
};

// Lines API
export const linesAPI = {
  getLines: () => axios.get('/lineas'),
  createLine: (line: { numero: string; estado: string; plan: string }) =>
    axios.post('/lineas', line),
  updateLine: (id: string, line: { numero: string; estado: string; plan: string }) =>
    axios.put(`/lineas/${id}`, line),
  deleteLine: (id: string) => axios.delete(`/lineas/${id}`),
  toggleStatus: (id: string) => axios.put(`/lineas/${id}/toggle`),
};

// Equipments API
export const equipmentsAPI = {
  getEquipments: () => axios.get('/equipos'),
  createEquipment: (equipment: { modelo: string; marca: string; estado: string }) =>
    axios.post('/equipos', equipment),
  updateEquipment: (id: string, equipment: { modelo: string; marca: string; estado: string }) =>
    axios.put(`/equipos/${id}`, equipment),
  deleteEquipment: (id: string) => axios.delete(`/equipos/${id}`),
  repairEquipment: (id: string, repairData: { descripcion: string }) =>
    axios.put(`/equipos/${id}/repair`, repairData),
};

// Assignments API
export const assignmentsAPI = {
  getAssignments: () => axios.get('/asignaciones'),
  createAssignment: (assignment: { usuarioId: string; lineaId: string; equipoId: string }) =>
    axios.post('/asignaciones', assignment),
  updateAssignment: (id: string, assignment: { usuarioId: string; lineaId: string; equipoId: string }) =>
    axios.put(`/asignaciones/${id}`, assignment),
  deleteAssignment: (id: string) => axios.delete(`/asignaciones/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getReviews: () => axios.get('/revisiones'),
  createReview: (review: { equipoId: string; fecha: string; resultado: string }) =>
    axios.post('/revisiones', review),
  updateReview: (id: string, review: { equipoId: string; fecha: string; resultado: string }) =>
    axios.put(`/revisiones/${id}`, review),
  deleteReview: (id: string) => axios.delete(`/revisiones/${id}`),
};

// Reports API
export const reportsAPI = {
  getLinesReport: (params: { startDate?: string; endDate?: string }) =>
    axios.get('/reportes/lineas', { params }),
  getEquipmentsReport: (params: { startDate?: string; endDate?: string }) =>
    axios.get('/reportes/equipos', { params }),
  getAssignmentsReport: (params: { startDate?: string; endDate?: string }) =>
    axios.get('/reportes/asignaciones', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => axios.get('/dashboard/stats'),
};

// Metrics API
export const metricsAPI = {
  getTotalActiveLines: () => axios.get('/metricas/lineas-activas'),
  getEquipmentsInRepair: () => axios.get('/metricas/equipos-reparacion'),
  getUpcomingReviews: () => axios.get('/metricas/revisiones-proximas'),
};
