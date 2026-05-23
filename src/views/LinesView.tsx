import { useState } from 'react';
import DataTable from '../shared/components/ui/DataTable';
import Modal from '../shared/components/ui/Modal';
import Button from '../shared/components/ui/Button';
import Input from '../shared/components/ui/Input';
import { useLines, type Line } from '../hooks/useLines';

const LinesView = () => {
  // Hook para obtener líneas del backend - 20 de octubre de 2025 - WM Developer
  const { lines, error, addLine, editLine, removeLine, toggleStatus } = useLines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  // Headers de la tabla de líneas - 20 de octubre de 2025 - WM Developer
  const headers = ['Número', 'Estado', 'Plan', 'Acciones'];

  // Maneja la apertura del modal para editar una línea - 20 de octubre de 2025 - WM Developer
  const handleEdit = (line: Line) => {
    setCurrentLine(line);
    setIsModalOpen(true);
  };

  // Maneja la eliminación de una línea con confirmación - 20 de octubre de 2025 - WM Developer
  const handleDelete = async (lineId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta línea?')) {
      try {
        await removeLine(lineId);
      } catch {
        alert('Error al eliminar línea');
      }
    }
  };

  // Abre el modal para crear una nueva línea - 20 de octubre de 2025 - WM Developer
  const handleCreate = () => {
    setCurrentLine(null);
    setIsModalOpen(true);
  };

  // Maneja el cambio de estado de una línea (Activa/Inactiva) - 20 de octubre de 2025 - WM Developer
  const handleToggleStatus = async (lineId: string) => {
    try {
      await toggleStatus(lineId);
    } catch {
      alert('Error al cambiar estado');
    }
  };

  // Guarda los cambios de una línea (crear o editar) - 20 de octubre de 2025 - WM Developer
  const handleSave = async (line: Omit<Line, 'id'> | Line) => {
    try {
      if ('id' in line) {
        await editLine(line as Line);
      } else {
        await addLine(line as Omit<Line, 'id'>);
      }
      setIsModalOpen(false);
    } catch {
      alert('Error al guardar línea');
    }
  };

  const renderRow = (line: Line) => (
    <tr key={line.id} className="hover:bg-muted/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap text-foreground">{line.numero}</td>
      <td className="px-6 py-4 whitespace-nowrap text-foreground">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          line.estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {line.estado}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-foreground">{line.plan}</td>
      <td className="px-6 py-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={() => handleToggleStatus(line.id.toString())}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors text-white ${
            line.estado === 'Activa' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          title={line.estado === 'Activa' ? 'Suspender' : 'Activar'}
        >
          {/* Icono de toggle para activar/suspender - 20 de octubre de 2025 - WM Developer */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 11h12m-3-8H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
          </svg>
        </button>
        <button
          onClick={() => handleEdit(line)}
          className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          title="Editar"
        >
          {/* Icono de lápiz para editar - 20 de octubre de 2025 - WM Developer */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => handleDelete(line.id.toString())}
          className="inline-flex items-center justify-center w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          title="Eliminar"
        >
          {/* Icono de basura para eliminar - 20 de octubre de 2025 - WM Developer */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Líneas</h1>
        <Button onClick={handleCreate}>Crear Línea</Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <DataTable
        headers={headers}
        data={lines}
        renderRow={renderRow}
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
    estado: line?.estado || 'Active',
    plan: line?.plan || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (line) {
      onSave({ ...line, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={line ? 'Editar Línea' : 'Crear Línea'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="numero"
          name="numero"
          label="Número"
          placeholder="123456789"
          required
          value={formData.numero}
          onChange={handleChange}
        />
        <Input
          id="estado"
          name="estado"
          label="Estado"
          placeholder="Active"
          required
          value={formData.estado}
          onChange={handleChange}
        />
        <Input
          id="plan"
          name="plan"
          label="Plan"
          placeholder="Basic"
          required
          value={formData.plan}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  );
};

export default LinesView;