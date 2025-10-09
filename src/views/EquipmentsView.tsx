import React, { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useEquipments } from '../hooks/useEquipments';
import { Equipment } from '../services/api';

const EquipmentsView = () => {
  const { equipments, loading, error, addEquipment, editEquipment, removeEquipment } = useEquipments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);

  const headers = ['Model', 'Brand', 'Status', 'Actions'];

  const handleEdit = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = (equipmentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      removeEquipment(equipmentId);
    }
  };

  const handleCreate = () => {
    setCurrentEquipment(null);
    setIsModalOpen(true);
  };

  const handleSave = (equipment: Omit<Equipment, 'id'> | Equipment) => {
    if ('id' in equipment) {
      editEquipment(equipment as Equipment);
    } else {
      addEquipment(equipment as Omit<Equipment, 'id'>);
    }
    setIsModalOpen(false);
  };

  const renderRow = (equipment: Equipment) => (
    <tr key={equipment.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{equipment.model}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{equipment.brand}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{equipment.status}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(equipment)}>Editar</Button>
        <Button onClick={() => handleDelete(equipment.id)} className="ml-2 bg-coral">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Equipos</h1>
        <Button onClick={handleCreate}>Crear Equipo</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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
    </div>
  );
};

const EquipmentFormModal = ({ isOpen, onClose, onSave, equipment }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, 'id'> | Equipment) => void;
  equipment: Equipment | null;
}) => {
  const [formData, setFormData] = useState({
    model: equipment?.model || '',
    brand: equipment?.brand || '',
    status: equipment?.status || '',
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
          id='model' 
          name='model' 
          label='Model' 
          placeholder='iPhone 13' 
          required 
          value={formData.model}
          onChange={handleChange}
        />
        <Input 
          id='brand' 
          name='brand' 
          label='Brand' 
          placeholder='Apple' 
          required 
          value={formData.brand}
          onChange={handleChange}
        />
        <Input 
          id='status' 
          name='status' 
          label='Status' 
          placeholder='In Use' 
          required 
          value={formData.status}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  )
}

export default EquipmentsView;