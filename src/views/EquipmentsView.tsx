import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Modal } from '../shared/components/ui/Modal';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { useEquipments, type Equipment } from '../hooks/useEquipments';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineWrenchScrewdriver } from 'react-icons/hi2';

const EquipmentsView = () => {
  const { equipments, error, addEquipment, editEquipment, removeEquipment, repairEquipment } = useEquipments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);

  const columns = [
    {
      key: 'modelo',
      header: 'Modelo',
      sortable: true,
    },
    {
      key: 'marca',
      header: 'Marca',
      sortable: true,
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (equipment: Equipment) => {
        const stateColors: Record<string, string> = {
          Disponible: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
          Asignado: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
          En_Mantenimiento: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
          Baja: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
        };

        const displayLabel: Record<string, string> = {
          Disponible: 'Disponible',
          Asignado: 'Asignado',
          En_Mantenimiento: 'En Mantenimiento',
          Baja: 'De Baja',
        };

        const status = equipment.estado || 'Disponible';
        const colorClass = stateColors[status] || stateColors.Disponible;
        const label = displayLabel[status] || status;

        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {label}
          </span>
        );
      },
    },
  ];

  const handleEdit = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = async (equipmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await removeEquipment(equipmentId);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Error al eliminar equipo';
        alert(errMsg);
      }
    }
  };

  const handleCreate = () => {
    setCurrentEquipment(null);
    setIsModalOpen(true);
  };

  const handleRepair = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setIsRepairModalOpen(true);
  };

  const handleSave = async (equipment: Omit<Equipment, 'id'> | Equipment) => {
    try {
      if ('id' in equipment) {
        await editEquipment(equipment as Equipment);
      } else {
        await addEquipment(equipment as Omit<Equipment, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al guardar equipo';
      alert(errMsg);
    }
  };

  const handleSaveRepair = async (descripcion: string) => {
    if (!currentEquipment) return;
    try {
      await repairEquipment(currentEquipment.id.toString(), descripcion);
      setIsRepairModalOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al registrar reparación';
      alert(errMsg);
    }
  };

  const renderActions = (equipment: Equipment) => (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleRepair(equipment)}
        title="Registrar Mantenimiento"
        icon={<HiOutlineWrenchScrewdriver className="w-4 h-4 text-amber-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(equipment)}
        title="Editar"
        icon={<HiOutlinePencilSquare className="w-4 h-4 text-emerald-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(equipment.id.toString())}
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
            Gestión de Equipos
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Administra el inventario de dispositivos, routers, terminales y su estado operativo.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          Crear Equipo
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={equipments as any[]}
        actions={renderActions as any}
        rowKey={(eq: any) => eq.id}
        searchable={true}
        searchPlaceholder="Buscar equipos..."
      />

      {isModalOpen && (
        <EquipmentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          equipment={currentEquipment}
        />
      )}

      {isRepairModalOpen && currentEquipment && (
        <RepairFormModal
          isOpen={isRepairModalOpen}
          onClose={() => setIsRepairModalOpen(false)}
          onSave={handleSaveRepair}
          equipment={currentEquipment}
        />
      )}
    </div>
  );
};

const EquipmentFormModal = ({
  isOpen,
  onClose,
  onSave,
  equipment
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, 'id'> | Equipment) => void;
  equipment: Equipment | null;
}) => {
  const [formData, setFormData] = useState({
    modelo: equipment?.modelo || '',
    marca: equipment?.marca || '',
    estado: equipment?.estado || 'Disponible',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (equipment) {
      onSave({ ...equipment, ...formData });
    } else {
      onSave(formData as Omit<Equipment, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={equipment ? 'Editar Equipo' : 'Crear Equipo'}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <Input
          id="modelo"
          name="modelo"
          label="Modelo del Dispositivo"
          placeholder="Ej. Cisco ASR1001"
          required
          value={formData.modelo}
          onChange={handleChange}
        />
        <Input
          id="marca"
          name="marca"
          label="Marca"
          placeholder="Ej. Cisco"
          required
          value={formData.marca}
          onChange={handleChange}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="estado" className="text-sm font-semibold text-[var(--color-text)]">
            Estado Operativo
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
          >
            <option value="Disponible">Disponible</option>
            <option value="Asignado">Asignado</option>
            <option value="En_Mantenimiento">En Mantenimiento</option>
            <option value="Baja">De Baja</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {equipment ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const RepairFormModal = ({
  isOpen,
  onClose,
  onSave,
  equipment
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (descripcion: string) => void;
  equipment: Equipment;
}) => {
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(descripcion);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mantenimiento - ${equipment.marca} ${equipment.modelo}`}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <Input
          id="descripcion"
          name="descripcion"
          label="Detalles de la Reparación / Mantenimiento"
          placeholder="Ej. Cambio de fuente de poder, actualización de firmware..."
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Registrar Mantenimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EquipmentsView;