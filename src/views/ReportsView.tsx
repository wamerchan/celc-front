import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { reportesEndpoints } from '../shared/api/endpoints';

const ReportsView = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'lineas',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const params = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      switch (filters.type) {
        case 'lineas':
          response = await reportesEndpoints.getLineas(params);
          break;
        case 'equipos':
          response = await reportesEndpoints.getEquipos(params);
          break;
        case 'asignaciones':
          response = await reportesEndpoints.getAsignaciones(params);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      setReportData(response.data);
    } catch (err) {
      setError('Error al generar el reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    switch (filters.type) {
      case 'lineas':
        return [
          { key: 'numero', header: 'Número', sortable: true },
          {
            key: 'estado',
            header: 'Estado',
            sortable: true,
            render: (item: any) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                item.estado === 'Activa' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {item.estado}
              </span>
            )
          },
          { key: 'plan', header: 'Plan', sortable: true },
          { key: 'usuario', header: 'Usuario Relacionado', sortable: true },
        ];
      case 'equipos':
        return [
          { key: 'modelo', header: 'Modelo', sortable: true },
          { key: 'marca', header: 'Marca', sortable: true },
          {
            key: 'estado',
            header: 'Estado',
            sortable: true,
            render: (item: any) => {
              const stateColors: Record<string, string> = {
                Disponible: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                Asignado: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
                En_Mantenimiento: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                Baja: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
              };
              return (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${stateColors[item.estado] || 'bg-slate-500/10 text-slate-500'}`}>
                  {item.estado}
                </span>
              );
            }
          },
          {
            key: 'fechaReparacion',
            header: 'Fecha Última Reparación',
            sortable: true,
            render: (item: any) => {
              if (!item.fechaReparacion) return '-';
              const dateObj = new Date(item.fechaReparacion);
              return isNaN(dateObj.getTime()) ? item.fechaReparacion : dateObj.toLocaleDateString();
            }
          },
        ];
      case 'asignaciones':
        return [
          { key: 'usuario', header: 'Usuario', sortable: true },
          { key: 'linea', header: 'Línea de Teléfono', sortable: true },
          { key: 'equipo', header: 'Equipo Asignado', sortable: true },
          {
            key: 'fechaAsignacion',
            header: 'Fecha de Asignación',
            sortable: true,
            render: (item: any) => {
              if (!item.fechaAsignacion) return '-';
              const dateObj = new Date(item.fechaAsignacion);
              return isNaN(dateObj.getTime()) ? item.fechaAsignacion : dateObj.toLocaleDateString();
            }
          },
        ];
      default:
        return [];
    }
  };

  const reportTypeOptions = [
    { value: 'lineas', label: 'Reporte de Líneas' },
    { value: 'equipos', label: 'Reporte de Equipos' },
    { value: 'asignaciones', label: 'Reporte de Asignaciones' },
  ];

  return (
    <div className="space-y-6 animate-slide-up text-left">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-transparent">
          Reportes de Auditoría
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Genera y exporta reportes detallados sobre el uso de líneas, inventario de equipos y asignaciones activas.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Parámetros de Búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            id="type"
            name="type"
            label="Tipo de Reporte"
            options={reportTypeOptions}
            value={filters.type}
            onChange={handleFilterChange}
          />
          <Input
            id="startDate"
            name="startDate"
            label="Fecha de Inicio"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <Input
            id="endDate"
            name="endDate"
            label="Fecha de Fin"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <div className="flex">
            <Button onClick={handleGenerateReport} loading={loading} fullWidth>
              Generar Reporte
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      {reportData.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              Vista previa del reporte generado
            </span>
          </div>
          <DataTable
            columns={getColumns() as any[]}
            data={reportData as any[]}
            rowKey={(item: any) => item.id || Math.random()}
            searchable={true}
            searchPlaceholder="Buscar en reporte..."
          />
        </div>
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--color-border)]/60 rounded-xl bg-[var(--color-surface)]/30">
            <svg className="w-12 h-12 text-[var(--color-text-subtle)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold text-[var(--color-text)]">Ningún reporte generado</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Selecciona los filtros y haz clic en Generar Reporte.</p>
          </div>
        )
      )}
    </div>
  );
};

export default ReportsView;