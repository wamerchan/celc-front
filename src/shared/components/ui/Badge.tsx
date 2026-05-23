import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:   'bg-slate-800/40 text-slate-300 border border-slate-700/30 backdrop-blur-sm',
  success:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm',
  warning:   'bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-sm',
  danger:    'bg-rose-500/10 text-rose-400 border border-rose-500/20 backdrop-blur-sm',
  info:      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-sm',
  secondary: 'bg-violet-500/10 text-violet-400 border border-violet-500/20 backdrop-blur-sm',
};

const dotClasses: Record<BadgeVariant, string> = {
  default:   'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]',
  success:   'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
  warning:   'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
  danger:    'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]',
  info:      'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
  secondary: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]',
};

export function Badge({ variant = 'default', children, className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
}

// StatusBadge — mapea automáticamente los enums del backend a variantes semánticas
type EquipoEstado = 'Disponible' | 'Asignado' | 'En_Mantenimiento' | 'Baja';
type LineaEstado  = 'Activa' | 'Inactiva' | 'Suspendida';
type RevisionRes  = 'Aprobada' | 'Reparacion_Necesaria' | 'Rechazada';

type StatusValue = EquipoEstado | LineaEstado | RevisionRes | string;

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  // Equipos
  Disponible:       { variant: 'success',   label: 'Disponible' },
  Asignado:         { variant: 'info',      label: 'Asignado' },
  En_Mantenimiento: { variant: 'warning',   label: 'En Mantenimiento' },
  Baja:             { variant: 'danger',    label: 'Baja' },
  // Líneas
  Activa:           { variant: 'success',   label: 'Activa' },
  Inactiva:         { variant: 'default',   label: 'Inactiva' },
  Suspendida:       { variant: 'danger',    label: 'Suspendida' },
  // Revisiones
  Aprobada:              { variant: 'success',   label: 'Aprobada' },
  Reparacion_Necesaria:  { variant: 'warning',   label: 'Reparación Necesaria' },
  Rechazada:             { variant: 'danger',    label: 'Rechazada' },
};

interface StatusBadgeProps {
  status: StatusValue;
  dot?: boolean;
}

export function StatusBadge({ status, dot = true }: StatusBadgeProps) {
  const mapped = STATUS_MAP[status] ?? { variant: 'default' as BadgeVariant, label: status };
  return (
    <Badge variant={mapped.variant} dot={dot}>
      {mapped.label}
    </Badge>
  );
}

export default Badge;
