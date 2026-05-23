// Contratos de API — CELC Frontend
// Sincronizados con los DTOs del backend (Prisma camelCase)

export type EquipoEstado = 'Disponible' | 'Asignado' | 'En_Mantenimiento' | 'Baja';
export type LineaEstado = 'Activa' | 'Inactiva' | 'Suspendida';
export type RevisionResultado = 'Aprobada' | 'Reparacion_Necesaria' | 'Rechazada';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;       // 'Administrador' | 'Técnico' | 'Empleado'
  rolId: number;
}

export interface Equipo {
  id: number;
  marca: string;
  modelo: string;
  numeroSerie: string;
  imei?: string;
  estado: EquipoEstado;
  fechaAdquisicion?: string;
  descripcion?: string;
}

export interface Linea {
  id: number;
  numeroTelefono: string;
  operador: string;
  planDatos?: string;
  estado: LineaEstado;
  fechaActivacion?: string;
  fechaVencimientoPlan?: string;
  descripcion?: string;
}

export interface Asignacion {
  id: number;
  usuarioId: number;
  equipoId?: number;
  lineaId?: number;
  fechaAsignacion: string;
  fechaDesasignacion?: string;
  observaciones?: string;
  usuario: Pick<Usuario, 'id' | 'nombres' | 'apellidos'>;
  equipo?: Pick<Equipo, 'id' | 'marca' | 'modelo'>;
  linea?: Pick<Linea, 'id' | 'numeroTelefono'>;
}

export interface Revision {
  id: number;
  equipoId: number;
  fechaProgramada: string;
  fechaRealizada?: string;
  resultado?: RevisionResultado;
  observaciones?: string;
  realizadaPorUsuario?: number;
  equipo: Pick<Equipo, 'id' | 'marca' | 'modelo'>;
  usuario?: Pick<Usuario, 'id' | 'nombres' | 'apellidos'>;
}

// DTOs para creación/edición
export interface CreateEquipoDto {
  marca: string;
  modelo: string;
  numeroSerie: string;
  imei?: string;
  estado?: EquipoEstado;
  fechaAdquisicion?: string;
  descripcion?: string;
}

export interface CreateLineaDto {
  numeroTelefono: string;
  operador: string;
  planDatos?: string;
  estado?: LineaEstado;
  fechaActivacion?: string;
  descripcion?: string;
}

export interface CreateAsignacionDto {
  usuarioId: number;
  equipoId?: number;
  lineaId?: number;
  observaciones?: string;
}

export interface CreateRevisionDto {
  equipoId: number;
  fechaProgramada: string;
  resultado?: RevisionResultado;
  observaciones?: string;
}

export interface CreateUsuarioDto {
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  cedula: string;
  contrasenaHash: string;
  rolId: number;
}

// Métricas del dashboard
export interface DashboardMetrics {
  totalEquipos: number;
  equiposDisponibles: number;
  equiposAsignados: number;
  equiposEnMantenimiento: number;
  totalLineas: number;
  lineasActivas: number;
  totalAsignaciones: number;
  revisionesProximas: number;
  equiposPorEstado: { estado: string; count: number }[];
  lineasPorOperador: { operador: string; count: number }[];
  revisionesPorMes: { mes: string; count: number }[];
  topMarcas: { marca: string; count: number }[];
}

// Respuesta paginada genérica
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
