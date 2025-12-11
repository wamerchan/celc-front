import { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useAssignments, type Assignment } from '../hooks/useAssignments';
import { useUsers } from '../hooks/useUsers';
import { useLines } from '../hooks/useLines';
import { useEquipments } from '../hooks/useEquipments';

const AssignmentsView = () => {
  const { assignments, error, addAssignment, editAssignment, removeAssignment } = useAssignments();
  const { users } = useUsers();
  const { lines } = useLines();
  const { equipments } = useEquipments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

  const headers = ['Usuario', 'Línea', 'Equipo', 'Acciones'];

  const handleEdit = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (assignmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      try {
        await removeAssignment(assignmentId);
      } catch (err) {
        alert('Error al eliminar asignación');
      }
    }
  };

  const handleCreate = () => {
    setCurrentAssignment(null);
    setIsModalOpen(true);
  };

  const handleSave = async (assignment: Omit<Assignment, 'id'> | Assignment) => {
    try {
      if ('id' in assignment) {
        await editAssignment(assignment as Assignment);
      } else {
        await addAssignment(assignment as Omit<Assignment, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al guardar asignación');
    }
  };

  const renderRow = (assignment: Assignment) => (
    <tr key={assignment.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.usuario}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.linea}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{assignment.equipo}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(assignment)} className="mr-2">Editar</Button>
        <Button onClick={() => handleDelete(assignment.id.toString())} variant="danger">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Asignaciones</h1>
        <Button onClick={handleCreate}>Crear Asignación</Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          users={users}
          lines={lines}
          equipments={equipments}
        />
      )}
    </div>
  );
};

const AssignmentFormModal = ({
  isOpen,
  onClose,
  onSave,
  assignment,
  users,
  lines,
  equipments
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id'> | Assignment) => void;
  assignment: Assignment | null;
  users: any[];
  lines: any[];
  equipments: any[];
}) => {
  const [formData, setFormData] = useState({
    usuarioId: assignment?.usuarioId || '',
    lineaId: assignment?.lineaId || '',
    equipoId: assignment?.equipoId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  const userOptions = users.map(user => ({ value: user.id, label: user.nombre }));
  const lineOptions = lines.map(line => ({ value: line.id, label: line.numero }));
  const equipmentOptions = equipments.map(equipment => ({ value: equipment.id, label: `${equipment.marca} ${equipment.modelo}` }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assignment ? 'Editar Asignación' : 'Crear Asignación'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          id="usuarioId"
          name="usuarioId"
          label="Usuario"
          options={userOptions}
          value={formData.usuarioId}
          onChange={handleChange}
          required
        />
        <Select
          id="lineaId"
          name="lineaId"
          label="Línea"
          options={lineOptions}
          value={formData.lineaId}
          onChange={handleChange}
          required
        />
        <Select
          id="equipoId"
          name="equipoId"
          label="Equipo"
          options={equipmentOptions}
          value={formData.equipoId}
          onChange={handleChange}
          required
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  );
};

export default AssignmentsView;