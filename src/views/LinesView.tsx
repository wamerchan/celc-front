import React, { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useLines } from '../hooks/useLines';
import { Line } from '../services/api';

const LinesView = () => {
  const { lines, loading, error, addLine, editLine, removeLine } = useLines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const headers = ['Number', 'Status', 'Plan', 'Actions'];

  const handleEdit = (line: Line) => {
    setCurrentLine(line);
    setIsModalOpen(true);
  };

  const handleDelete = (lineId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta línea?')) {
      removeLine(lineId);
    }
  };

  const handleCreate = () => {
    setCurrentLine(null);
    setIsModalOpen(true);
  };

  const handleSave = (line: Omit<Line, 'id'> | Line) => {
    if ('id' in line) {
      editLine(line as Line);
    } else {
      addLine(line as Omit<Line, 'id'>);
    }
    setIsModalOpen(false);
  };

  const renderRow = (line: Line) => (
    <tr key={line.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{line.number}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{line.status}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{line.plan}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(line)}>Editar</Button>
        <Button onClick={() => handleDelete(line.id)} className="ml-2 bg-coral">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Líneas</h1>
        <Button onClick={handleCreate}>Crear Línea</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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

const LineFormModal = ({ isOpen, onClose, onSave, line }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (line: Omit<Line, 'id'> | Line) => void;
  line: Line | null;
}) => {
  const [formData, setFormData] = useState({
    number: line?.number || '',
    status: line?.status || '',
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
          id='number' 
          name='number' 
          label='Number' 
          placeholder='123456789' 
          required 
          value={formData.number}
          onChange={handleChange}
        />
        <Input 
          id='status' 
          name='status' 
          label='Status' 
          placeholder='Active' 
          required 
          value={formData.status}
          onChange={handleChange}
        />
        <Input 
          id='plan' 
          name='plan' 
          label='Plan' 
          placeholder='Basic' 
          required 
          value={formData.plan}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  )
}

export default LinesView;