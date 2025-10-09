import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000/api';

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
