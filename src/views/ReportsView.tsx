import { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { reportsAPI } from '../services/api';

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
          response = await reportsAPI.getLinesReport(params);
          break;
        case 'equipos':
          response = await reportsAPI.getEquipmentsReport(params);
          break;
        case 'asignaciones':
          response = await reportsAPI.getAssignmentsReport(params);
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

  const getHeaders = () => {
    switch (filters.type) {
      case 'lineas':
        return ['Número', 'Estado', 'Plan', 'Usuario'];
      case 'equipos':
        return ['Modelo', 'Marca', 'Estado', 'Fecha Reparación'];
      case 'asignaciones':
        return ['Usuario', 'Línea', 'Equipo', 'Fecha Asignación'];
      default:
        return [];
    }
  };

  const renderRow = (item: any) => {
    switch (filters.type) {
      case 'lineas':
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.numero}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.estado}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.plan}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.usuario}</td>
          </tr>
        );
      case 'equipos':
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.modelo}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.marca}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.estado}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.fechaReparacion}</td>
          </tr>
        );
      case 'asignaciones':
        return (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.usuario}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.linea}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.equipo}</td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.fechaAsignacion}</td>
          </tr>
        );
      default:
        return <tr key={item.id || Math.random()}></tr>;
    }
  };

  const reportTypeOptions = [
    { value: 'lineas', label: 'Líneas' },
    { value: 'equipos', label: 'Equipos' },
    { value: 'asignaciones', label: 'Asignaciones' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reportes</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            label="Fecha Inicio"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <Input
            id="endDate"
            name="endDate"
            label="Fecha Fin"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <div className="flex items-end">
            <Button onClick={handleGenerateReport} isLoading={loading}>
              Generar Reporte
            </Button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {reportData.length > 0 && (
        <DataTable
          headers={getHeaders()}
          data={reportData}
          renderRow={renderRow}
          searchable={true}
          searchPlaceholder="Buscar en reporte..."
        />
      )}
    </div>
  );
};

export default ReportsView;