import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Modal } from '../shared/components/ui/Modal';
import { Button } from '../shared/components/ui/Button';
import { Select } from '../shared/components/ui/Select';
import { useAssignments, type Assignment } from '../hooks/useAssignments';
import { useUsers } from '../hooks/useUsers';
import { useLines } from '../hooks/useLines';
import { useEquipments } from '../hooks/useEquipments';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

const AssignmentsView = () => {
  const { assignments, error, addAssignment, editAssignment, removeAssignment } = useAssignments();
  const { users } = useUsers();
  const { lines } = useLines();
  const { equipments } = useEquipments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

  const columns = [
    {
      key: 'usuario',
      header: 'Usuario',
      sortable: true,
    },
    {
      key: 'linea',
      header: 'Línea de Comunicación',
      sortable: true,
      render: (assignment: Assignment) => assignment.linea || 'Sin Línea',
    },
    {
      key: 'equipo',
      header: 'Equipo Asignado',
      sortable: true,
      render: (assignment: Assignment) => assignment.equipo || 'Sin Equipo',
    },
  ];

  const handleEdit = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (assignmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      try {
        await removeAssignment(assignmentId);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Error al eliminar asignación';
        alert(errMsg);
      }
    }
  };

  const handleCreate = () => {
    setCurrentAssignment(null);
    setIsModalOpen(true);
  };

  const handleSave = async (assignment: Omit<Assignment, 'id'> | Assignment) => {
    try {
      if (currentAssignment && 'id' in assignment) {
        await editAssignment(assignment as Assignment);
      } else {
        await addAssignment(assignment as Omit<Assignment, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al guardar asignación';
      alert(errMsg);
    }
  };

  const renderActions = (assignment: Assignment) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(assignment)}
        title="Editar"
        icon={<HiOutlinePencilSquare className="w-4 h-4 text-emerald-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(assignment.id.toString())}
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
            Asignaciones de Equipos y Líneas
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Asigna dispositivos tecnológicos y números de comunicación a los usuarios registrados en el sistema.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          Crear Asignación
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={assignments as any[]}
        actions={renderActions as any}
        rowKey={(asg: any) => asg.id}
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
    usuarioId: assignment?.usuarioId?.toString() || '',
    lineaId: assignment?.lineaId?.toString() || '',
    equipoId: assignment?.equipoId?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignment) {
      onSave({ ...assignment, ...formData });
    } else {
      onSave(formData as Omit<Assignment, 'id'>);
    }
  };

  const userOptions = [
    { value: '', label: 'Seleccionar un usuario' },
    ...users.map(user => ({
      value: user.id,
      label: `${user.nombres} ${user.apellidos || ''}`.trim()
    }))
  ];

  const lineOptions = [
    { value: '', label: 'Ninguna' },
    ...lines.map(line => ({
      value: line.id,
      label: `${line.numero} (${line.operador})`
    }))
  ];

  const equipmentOptions = [
    { value: '', label: 'Ninguno' },
    ...equipments.map(equipment => ({
      value: equipment.id,
      label: `${equipment.marca} ${equipment.modelo} (${equipment.estado})`
    }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assignment ? 'Editar Asignación' : 'Crear Asignación'}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <Select
          id="usuarioId"
          name="usuarioId"
          label="Usuario Responsable"
          options={userOptions}
          value={formData.usuarioId}
          onChange={handleChange}
          required
        />
        <Select
          id="lineaId"
          name="lineaId"
          label="Línea Telefónica Asociada"
          options={lineOptions}
          value={formData.lineaId}
          onChange={handleChange}
        />
        <Select
          id="equipoId"
          name="equipoId"
          label="Equipo Tecnológico"
          options={equipmentOptions}
          value={formData.equipoId}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {assignment ? 'Guardar Cambios' : 'Asignar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentsView;