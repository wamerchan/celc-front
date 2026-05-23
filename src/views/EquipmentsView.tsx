import { useState } from 'react';
import DataTable from '../shared/components/ui/DataTable';
import Modal from '../shared/components/ui/Modal';
import Button from '../shared/components/ui/Button';
import Input from '../shared/components/ui/Input';
import { useEquipments, type Equipment } from '../hooks/useEquipments';

const EquipmentsView = () => {
  const { equipments, error, addEquipment, editEquipment, removeEquipment, repairEquipment } = useEquipments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);

  const headers = ['Modelo', 'Marca', 'Estado', 'Acciones'];

  const handleEdit = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = async (equipmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await removeEquipment(equipmentId);
      } catch (err) {
        alert('Error al eliminar equipo');
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
    } catch (err) {
      alert('Error al guardar equipo');
    }
  };

  const handleSaveRepair = async (descripcion: string) => {
    if (!currentEquipment) return;
    try {
      await repairEquipment(currentEquipment.id.toString(), descripcion);
      setIsRepairModalOpen(false);
    } catch (err) {
      alert('Error al registrar reparación');
    }
  };

  const renderRow = (equipment: Equipment) => (
    <tr key={equipment.id} className="hover:bg-muted/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap text-foreground">{equipment.modelo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-foreground">{equipment.marca}</td>
      <td className="px-6 py-4 whitespace-nowrap text-foreground">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          equipment.estado === 'In Use' ? 'bg-green-100 text-green-800' :
          equipment.estado === 'In Stock' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {equipment.estado}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={() => handleRepair(equipment)} className="mr-2" variant="secondary">Reparar</Button>
        <Button onClick={() => handleEdit(equipment)} className="mr-2">Editar</Button>
        <Button onClick={() => handleDelete(equipment.id.toString())} variant="danger">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Equipos</h1>
        <Button onClick={handleCreate}>Crear Equipo</Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <DataTable
        headers={headers}
        data={equipments}
        renderRow={renderRow}
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
    estado: equipment?.estado || 'In Stock',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (equipment) {
      onSave({ ...equipment, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={equipment ? 'Editar Equipo' : 'Crear Equipo'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="modelo"
          name="modelo"
          label="Modelo"
          placeholder="iPhone 13"
          required
          value={formData.modelo}
          onChange={handleChange}
        />
        <Input
          id="marca"
          name="marca"
          label="Marca"
          placeholder="Apple"
          required
          value={formData.marca}
          onChange={handleChange}
        />
        <Input
          id="estado"
          name="estado"
          label="Estado"
          placeholder="In Stock"
          required
          value={formData.estado}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Registrar Reparación - ${equipment.modelo}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="descripcion"
          name="descripcion"
          label="Descripción de la Reparación"
          placeholder="Descripción detallada..."
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <Button type="submit">Registrar Reparación</Button>
      </form>
    </Modal>
  );
};

export default EquipmentsView;