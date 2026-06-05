import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Modal } from '../shared/components/ui/Modal';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { useLines, type Line } from '../hooks/useLines';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineArrowPath } from 'react-icons/hi2';

const LinesView = () => {
  const { lines, error, addLine, editLine, removeLine, toggleStatus } = useLines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const columns = [
    {
      key: 'numero',
      header: 'Número',
      sortable: true,
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (line: Line) => {
        const active = line.estado === 'Activa';
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              active
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}
          >
            {line.estado}
          </span>
        );
      },
    },
    {
      key: 'plan',
      header: 'Plan de Datos',
      sortable: true,
    },
  ];

  const handleEdit = (line: Line) => {
    setCurrentLine(line);
    setIsModalOpen(true);
  };

  const handleDelete = async (lineId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta línea?')) {
      try {
        await removeLine(lineId);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Error al eliminar línea';
        alert(errMsg);
      }
    }
  };

  const handleCreate = () => {
    setCurrentLine(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (lineId: string) => {
    try {
      await toggleStatus(lineId);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al cambiar estado';
      alert(errMsg);
    }
  };

  const handleSave = async (line: Omit<Line, 'id'> | Line) => {
    try {
      if ('id' in line) {
        await editLine(line as Line);
      } else {
        await addLine(line as Omit<Line, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al guardar línea';
      alert(errMsg);
    }
  };

  const renderActions = (line: Line) => (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleToggleStatus(line.id.toString())}
        title={line.estado === 'Activa' ? 'Suspender Línea' : 'Activar Línea'}
        icon={<HiOutlineArrowPath className={`w-4 h-4 ${line.estado === 'Activa' ? 'text-amber-500' : 'text-emerald-500'}`} />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(line)}
        title="Editar"
        icon={<HiOutlinePencilSquare className="w-4 h-4 text-emerald-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(line.id.toString())}
        title="Eliminar"
        icon={<HiOutlineTrash className="w-4 h-4 text-rose-500" />}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-transparent">
            Gestión de Líneas
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Administra las líneas de comunicación telefónica y sus planes de datos activos.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          Crear Línea
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={lines as any[]}
        actions={renderActions as any}
        rowKey={(line: any) => line.id}
        searchable={true}
        searchPlaceholder="Buscar líneas..."
      />

      {isModalOpen && (
        <LineFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          line={currentLine}
        />
      )}
    </div>
  );
};

const LineFormModal = ({
  isOpen,
  onClose,
  onSave,
  line
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (line: Omit<Line, 'id'> | Line) => void;
  line: Line | null;
}) => {
  const [formData, setFormData] = useState({
    numero: line?.numero || '',
    estado: line?.estado || 'Activa',
    plan: line?.plan || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (line) {
      onSave({ ...line, ...formData });
    } else {
      onSave(formData as Omit<Line, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={line ? 'Editar Línea' : 'Crear Línea'}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <Input
          id="numero"
          name="numero"
          label="Número de Teléfono"
          placeholder="Ej. +573001234567"
          required
          value={formData.numero}
          onChange={handleChange}
        />
        <Input
          id="plan"
          name="plan"
          label="Plan de Datos"
          placeholder="Ej. Plan Ilimitado 5G"
          required
          value={formData.plan}
          onChange={handleChange}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="estado" className="text-sm font-semibold text-[var(--color-text)]">
            Estado de la Línea
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
          >
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
            <option value="Suspendida">Suspendida</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {line ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LinesView;