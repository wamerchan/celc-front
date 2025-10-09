import { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useLines, type Line } from '../hooks/useLines';

const LinesView = () => {
  const { lines, loading, error, addLine, editLine, removeLine, toggleStatus } = useLines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const headers = ['Número', 'Estado', 'Plan', 'Acciones'];

  const handleEdit = (line: Line) => {
    setCurrentLine(line);
    setIsModalOpen(true);
  };

  const handleDelete = async (lineId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta línea?')) {
      try {
        await removeLine(lineId);
      } catch (err) {
        alert('Error al eliminar línea');
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
    } catch (err) {
      alert('Error al cambiar estado');
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
    } catch (err) {
      alert('Error al guardar línea');
    }
  };

  const renderRow = (line: Line) => (
    <tr key={line.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{line.numero}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          line.estado === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {line.estado}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{line.plan}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button
          onClick={() => handleToggleStatus(line.id.toString())}
          variant={line.estado === 'Active' ? 'danger' : 'primary'}
          className="mr-2"
        >
          {line.estado === 'Active' ? 'Suspender' : 'Activar'}
        </Button>
        <Button onClick={() => handleEdit(line)} className="mr-2">Editar</Button>
        <Button onClick={() => handleDelete(line.id.toString())} variant="danger">Eliminar</Button>
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