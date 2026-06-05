import { create } from 'zustand';
import {
  usuariosEndpoints,
  equiposEndpoints,
  lineasEndpoints,
  asignacionesEndpoints,
  revisionesEndpoints,
} from '../shared/api/endpoints';
import type {
  Usuario,
  Equipo,
  Linea,
  Asignacion,
  Revision,
} from '../shared/types/api.types';

interface DataState {
  users: Usuario[];
  equipos: Equipo[];
  lineas: Linea[];
  asignaciones: Asignacion[];
  revisiones: Revision[];
  
  loading: {
    users: boolean;
    equipos: boolean;
    lineas: boolean;
    asignaciones: boolean;
    revisiones: boolean;
  };
  
  error: {
    users: string | null;
    equipos: string | null;
    lineas: string | null;
    asignaciones: string | null;
    revisiones: string | null;
  };

  // Cache duration / timestamp of last fetch
  lastFetched: {
    users: number | null;
    equipos: number | null;
    lineas: number | null;
    asignaciones: number | null;
    revisiones: number | null;
  };

  fetchUsers: (force?: boolean) => Promise<void>;
  fetchEquipos: (force?: boolean) => Promise<void>;
  fetchLineas: (force?: boolean) => Promise<void>;
  fetchAsignaciones: (force?: boolean) => Promise<void>;
  fetchRevisiones: (force?: boolean) => Promise<void>;
  
  invalidateCache: (domain: 'users' | 'equipos' | 'lineas' | 'asignaciones' | 'revisiones') => void;
}

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache by default

const isCacheValid = (lastFetched: number | null) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < CACHE_DURATION_MS;
};

export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  equipos: [],
  lineas: [],
  asignaciones: [],
  revisiones: [],

  loading: {
    users: false,
    equipos: false,
    lineas: false,
    asignaciones: false,
    revisiones: false,
  },

  error: {
    users: null,
    equipos: null,
    lineas: null,
    asignaciones: null,
    revisiones: null,
  },

  lastFetched: {
    users: null,
    equipos: null,
    lineas: null,
    asignaciones: null,
    revisiones: null,
  },

  fetchUsers: async (force = false) => {
    if (!force && isCacheValid(get().lastFetched.users) && get().users.length > 0) {
      return;
    }
    set((state) => ({
      loading: { ...state.loading, users: true },
      error: { ...state.error, users: null },
    }));
    try {
      const response = await usuariosEndpoints.getAll();
      set((state) => ({
        users: response.data,
        lastFetched: { ...state.lastFetched, users: Date.now() },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, users: err.message || 'Error al cargar usuarios' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, users: false },
      }));
    }
  },

  fetchEquipos: async (force = false) => {
    if (!force && isCacheValid(get().lastFetched.equipos) && get().equipos.length > 0) {
      return;
    }
    set((state) => ({
      loading: { ...state.loading, equipos: true },
      error: { ...state.error, equipos: null },
    }));
    try {
      const response = await equiposEndpoints.getAll();
      set((state) => ({
        equipos: response.data,
        lastFetched: { ...state.lastFetched, equipos: Date.now() },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, equipos: err.message || 'Error al cargar equipos' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, equipos: false },
      }));
    }
  },

  fetchLineas: async (force = false) => {
    if (!force && isCacheValid(get().lastFetched.lineas) && get().lineas.length > 0) {
      return;
    }
    set((state) => ({
      loading: { ...state.loading, lineas: true },
      error: { ...state.error, lineas: null },
    }));
    try {
      const response = await lineasEndpoints.getAll();
      set((state) => ({
        lineas: response.data,
        lastFetched: { ...state.lastFetched, lineas: Date.now() },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, lineas: err.message || 'Error al cargar líneas' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, lineas: false },
      }));
    }
  },

  fetchAsignaciones: async (force = false) => {
    if (!force && isCacheValid(get().lastFetched.asignaciones) && get().asignaciones.length > 0) {
      return;
    }
    set((state) => ({
      loading: { ...state.loading, asignaciones: true },
      error: { ...state.error, asignaciones: null },
    }));
    try {
      const response = await asignacionesEndpoints.getAll();
      set((state) => ({
        asignaciones: response.data,
        lastFetched: { ...state.lastFetched, asignaciones: Date.now() },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, asignaciones: err.message || 'Error al cargar asignaciones' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, asignaciones: false },
      }));
    }
  },

  fetchRevisiones: async (force = false) => {
    if (!force && isCacheValid(get().lastFetched.revisiones) && get().revisiones.length > 0) {
      return;
    }
    set((state) => ({
      loading: { ...state.loading, revisiones: true },
      error: { ...state.error, revisiones: null },
    }));
    try {
      const response = await revisionesEndpoints.getAll();
      set((state) => ({
        revisiones: response.data,
        lastFetched: { ...state.lastFetched, revisiones: Date.now() },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, revisiones: err.message || 'Error al cargar revisiones' },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, revisiones: false },
      }));
    }
  },

  invalidateCache: (domain) => {
    set((state) => ({
      lastFetched: { ...state.lastFetched, [domain]: null },
    }));
  },
}));
