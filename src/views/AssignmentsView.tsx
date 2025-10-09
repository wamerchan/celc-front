import React, { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAssignments } from '../hooks/useAssignments';
import { useUsers } from '../hooks/useUsers';
import { useLines } from '../hooks/useLines';
import { useEquipments } from '../hooks/useEquipments';
import { Assignment } from '../services/api';

const AssignmentsView = () => {
  const { assignments, loading, error, addAssignment, editAssignment, removeAssignment } = useAssignments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

  const headers = ['User', 'Line', 'Equipment', 'Actions'];

  const handleEdit = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = (assignmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      removeAssignment(assignmentId);
    }
  };

  const handleCreate = () => {
    setCurrentAssignment(null);
    setIsModalOpen(true);
  };

  const handleSave = (assignment: Omit<Assignment, 'id'> | Assignment) => {
    if ('id' in assignment) {
      editAssignment(assignment as Assignment);
    } else {
      addAssignment(assignment as Omit<Assignment, 'id'>);
    }
    setIsModalOpen(false);
  };

  const renderRow = (assignment: Assignment) => (
    <tr key={assignment.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.user}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.line}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.equipment}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(assignment)}>Editar</Button>
        <Button onClick={() => handleDelete(assignment.id)} className="ml-2 bg-coral">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Asignaciones</h1>
        <Button onClick={handleCreate}>Crear Asignación</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <DataTable 
        headers={headers} 
        data={assignments} 
        renderRow={renderRow} 
        searchable={true}
        searchPlaceholder="Buscar asignaciones..."
      />
      {isModalOpen && (
        <AssignmentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          assignment={currentAssignment}
        />
      )}
    </div>
  );
};

const AssignmentFormModal = ({ isOpen, onClose, onSave, assignment }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id'> | Assignment) => void;
  assignment: Assignment | null;
}) => {
  const { users } = useUsers();
  const { lines } = useLines();
  const { equipments } = useEquipments();
  const [formData, setFormData] = useState({
    user: assignment?.user || '',
    line: assignment?.line || '',
    equipment: assignment?.equipment || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignment) {
      onSave({ ...assignment, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assignment ? 'Editar Asignación' : 'Crear Asignación'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="user">Usuario</label>
          <select id="user" name="user" value={formData.user} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Selecciona un usuario</option>
            {users.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="line">Línea</label>
          <select id="line" name="line" value={formData.line} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Selecciona una línea</option>
            {lines.map(line => <option key={line.id} value={line.number}>{line.number}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="equipment">Equipo</label>
          <select id="equipment" name="equipment" value={formData.equipment} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Selecciona un equipo</option>
            {equipments.map(equipment => <option key={equipment.id} value={equipment.model}>{equipment.model}</option>)}
          </select>
        </div>
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  )
}

export default AssignmentsView;