import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { reportesEndpoints } from '../shared/api/endpoints';
import { HiOutlineDocumentText, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import XLSX from 'xlsx-js-style';

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
      let mappedData = [];
      const params = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      switch (filters.type) {
        case 'lineas':
          response = await reportesEndpoints.getLineas(params);
          mappedData = response.data.map((l: any) => {
            const activeAsg = l.asignaciones?.find((a: any) => !a.fechaDesasignacion);
            return {
              id: l.id,
              numero: l.numeroTelefono,
              estado: l.estado,
              plan: l.planDatos || 'Sin Plan',
              usuario: activeAsg ? `${activeAsg.usuario.nombres} ${activeAsg.usuario.apellidos || ''}`.trim() : 'Sin Asignar',
            };
          });
          break;
        case 'equipos':
          response = await reportesEndpoints.getEquipos(params);
          mappedData = response.data.map((e: any) => {
            const lastRevision = e.revisiones?.[0];
            return {
              id: e.id,
              modelo: e.modelo,
              marca: e.marca,
              estado: e.estado,
              fechaReparacion: lastRevision ? lastRevision.fechaRealizada || lastRevision.fechaProgramada : null,
            };
          });
          break;
        case 'asignaciones':
          response = await reportesEndpoints.getAsignaciones(params);
          mappedData = response.data.map((a: any) => ({
            id: a.id,
            usuario: `${a.usuario.nombres} ${a.usuario.apellidos || ''}`.trim(),
            linea: a.linea ? `${a.linea.numeroTelefono} (${a.linea.operador})` : 'Sin Línea',
            equipo: a.equipo ? `${a.equipo.marca} ${a.equipo.modelo}` : 'Sin Equipo',
            fechaAsignacion: a.fechaAsignacion,
          }));
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      setReportData(mappedData);
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

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const typeLabel = filters.type === 'lineas' ? 'Líneas' : filters.type === 'equipos' ? 'Equipos' : 'Asignaciones';
      const titleText = `Reporte de ${typeLabel}`;
      const dateText = `Generado el: ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`;

      // Decoración de encabezado (Verde esmeralda de la UI de CELC)
      doc.setFillColor(16, 185, 129); // Emerald-500
      doc.rect(0, 0, 210, 8, 'F');

      // Título Principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text('CELC - Centro de Excelencia en Logística y Calidad', 14, 22);

      // Subtítulo
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // Slate-600
      doc.text(titleText, 14, 29);
      doc.setFontSize(9);
      doc.text(dateText, 14, 34);

      // Línea divisora
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 38, 196, 38);

      // Cabeceras y filas de la tabla
      let headers: string[] = [];
      let rows: any[][] = [];

      if (filters.type === 'lineas') {
        headers = ['Número de Teléfono', 'Estado', 'Plan de Datos', 'Usuario Asignado'];
        rows = reportData.map(item => [
          item.numero,
          item.estado,
          item.plan,
          item.usuario
        ]);
      } else if (filters.type === 'equipos') {
        headers = ['Marca', 'Modelo', 'Estado', 'Última Reparación'];
        rows = reportData.map(item => [
          item.marca,
          item.modelo,
          item.estado,
          item.fechaReparacion ? new Date(item.fechaReparacion).toLocaleDateString() : 'Ninguna'
        ]);
      } else { // asignaciones
        headers = ['Usuario Responsable', 'Línea de Teléfono', 'Equipo Asignado', 'Fecha de Asignación'];
        rows = reportData.map(item => [
          item.usuario,
          item.linea,
          item.equipo,
          item.fechaAsignacion ? new Date(item.fechaAsignacion).toLocaleDateString() : 'N/A'
        ]);
      }

      // Dibujar tabla con estilo moderno y consistente
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 44,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42], // Slate-900
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [51, 65, 85] // Slate-700
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Slate-50
        },
        margin: { left: 14, right: 14 },
        styles: {
          overflow: 'linebreak',
          cellPadding: 3.5
        },
        didDrawPage: () => {
          const str = `Página ${doc.internal.getNumberOfPages()}`;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // Slate-400
          doc.text(str, 196 - doc.getTextWidth(str), 285);
        }
      });

      doc.save(`CELC_Reporte_${filters.type}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF', err);
      alert('Error al exportar reporte a PDF');
    }
  };

  const handleExportExcel = () => {
    try {
      const formatted = reportData.map(item => {
        if (filters.type === 'lineas') {
          return {
            'Número de Teléfono': item.numero,
            'Estado': item.estado,
            'Plan de Datos': item.plan,
            'Usuario Asignado': item.usuario
          };
        } else if (filters.type === 'equipos') {
          return {
            'Marca': item.marca,
            'Modelo': item.modelo,
            'Estado': item.estado,
            'Última Reparación': item.fechaReparacion ? new Date(item.fechaReparacion).toLocaleDateString() : 'Ninguna'
          };
        } else { // asignaciones
          return {
            'Usuario Responsable': item.usuario,
            'Línea de Teléfono': item.linea,
            'Equipo Asignado': item.equipo,
            'Fecha de Asignación': item.fechaAsignacion ? new Date(item.fechaAsignacion).toLocaleDateString() : 'N/A'
          };
        }
      });

      const ws = XLSX.utils.json_to_sheet(formatted);

      // Paleta de Colores CELC: Slate-900 (#0F172A) para cabeceras, Esmeralda (#10B981) para éxitos
      const headerStyle = {
        font: {
          name: 'Helvetica',
          sz: 11,
          bold: true,
          color: { rgb: 'FFFFFF' }
        },
        fill: {
          fgColor: { rgb: '0F172A' } // Slate-900
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        border: {
          top: { style: 'thin', color: { rgb: 'E2E8F0' } },
          bottom: { style: 'medium', color: { rgb: '1E293B' } },
          left: { style: 'thin', color: { rgb: 'E2E8F0' } },
          right: { style: 'thin', color: { rgb: 'E2E8F0' } }
        }
      };

      const oddRowStyle = {
        font: { name: 'Helvetica', sz: 10, color: { rgb: '334155' } }, // Slate-700
        fill: { fgColor: { rgb: 'FFFFFF' } },
        alignment: { vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: 'F1F5F9' } },
          bottom: { style: 'thin', color: { rgb: 'F1F5F9' } },
          left: { style: 'thin', color: { rgb: 'F1F5F9' } },
          right: { style: 'thin', color: { rgb: 'F1F5F9' } }
        }
      };

      const evenRowStyle = {
        font: { name: 'Helvetica', sz: 10, color: { rgb: '334155' } },
        fill: { fgColor: { rgb: 'F8FAFC' } }, // Slate-50 (zebra-stripe)
        alignment: { vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: 'F1F5F9' } },
          bottom: { style: 'thin', color: { rgb: 'F1F5F9' } },
          left: { style: 'thin', color: { rgb: 'F1F5F9' } },
          right: { style: 'thin', color: { rgb: 'F1F5F9' } }
        }
      };

      // Colores de acento según estado
      const getStatusStyle = (status: string, isEven: boolean) => {
        const baseColor = isEven ? 'F8FAFC' : 'FFFFFF';
        let textColor = '334155'; // Slate-700
        if (status === 'Activa' || status === 'Disponible' || status === 'Aprobada') {
          textColor = '10B981'; // Emerald-500
        } else if (status === 'Inactiva' || status === 'Baja' || status === 'Rechazada') {
          textColor = 'EF4444'; // Red-500
        } else if (status === 'Suspendida' || status === 'En_Mantenimiento' || status === 'Reparacion_Necesaria') {
          textColor = 'F59E0B'; // Amber-500
        } else if (status === 'Asignado') {
          textColor = '3B82F6'; // Blue-500
        }
        return {
          font: { name: 'Helvetica', sz: 10, bold: true, color: { rgb: textColor } },
          fill: { fgColor: { rgb: baseColor } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'F1F5F9' } },
            bottom: { style: 'thin', color: { rgb: 'F1F5F9' } },
            left: { style: 'thin', color: { rgb: 'F1F5F9' } },
            right: { style: 'thin', color: { rgb: 'F1F5F9' } }
          }
        };
      };

      // Iterar celdas y aplicar formatos
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellRef];
          if (!cell) continue;

          if (R === 0) {
            cell.s = headerStyle;
          } else {
            const isEven = R % 2 === 0;
            const isStatusColumn = (filters.type === 'lineas' && C === 1) || 
                                   (filters.type === 'equipos' && C === 2);
            
            if (isStatusColumn && typeof cell.v === 'string') {
              cell.s = getStatusStyle(cell.v, isEven);
            } else {
              cell.s = JSON.parse(JSON.stringify(isEven ? evenRowStyle : oddRowStyle));
              if (typeof cell.v === 'number' || cellRef.startsWith('A') || cellRef.startsWith('D')) {
                cell.s.alignment = { horizontal: 'center', vertical: 'center' };
              }
            }
          }
        }
      }

      // Ajustar anchos de columnas
      const maxProps = Object.keys(formatted[0] || {}).map(key => ({
        wch: Math.max(key.length + 5, ...formatted.map(item => String((item as any)[key] || '').length + 5))
      }));
      ws['!cols'] = maxProps;

      const wb = XLSX.utils.book_new();
      const sheetName = filters.type === 'lineas' ? 'Líneas' : filters.type === 'equipos' ? 'Equipos' : 'Asignaciones';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `CELC_Reporte_${filters.type}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      console.error('Error al generar Excel', err);
      alert('Error al exportar reporte a Excel');
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[var(--color-surface)]/40 p-4 border border-[var(--color-border)]/50 rounded-xl">
            <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
              Vista previa del reporte generado
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                icon={<HiOutlineDocumentText className="w-4 h-4 text-rose-500" />}
              >
                Exportar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                icon={<HiOutlineArrowDownTray className="w-4 h-4 text-emerald-500" />}
              >
                Exportar Excel
              </Button>
            </div>
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