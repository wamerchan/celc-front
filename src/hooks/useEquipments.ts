import { useState, useEffect } from 'react';
import { equipmentsAPI } from '../services/api';

export interface Equipment {
  id: string;
  modelo: string;
  marca: string;
  estado: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await equipmentsAPI.getEquipments();
      setEquipments(response.data);
    } catch (err) {
      setError('Error al cargar los equipos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const addEquipment = async (equipment: Omit<Equipment, 'id'>) => {
    try {
      await equipmentsAPI.createEquipment(equipment);
      await fetchEquipments();
    } catch (err) {
      setError('Error al crear el equipo');
      console.error(err);
      throw err;
    }
  };

  const editEquipment = async (equipment: Equipment) => {
    try {
      await equipmentsAPI.updateEquipment(equipment.id.toString(), equipment);
      await fetchEquipments();
    } catch (err) {
      setError('Error al actualizar el equipo');
      console.error(err);
      throw err;
    }
  };

  const removeEquipment = async (equipmentId: string) => {
    try {
      await equipmentsAPI.deleteEquipment(equipmentId);
      await fetchEquipments();
    } catch (err) {
      setError('Error al eliminar el equipo');
      console.error(err);
      throw err;
    }
  };

  const repairEquipment = async (equipmentId: string, descripcion: string) => {
    try {
      await equipmentsAPI.repairEquipment(equipmentId, { descripcion });
      await fetchEquipments();
    } catch (err) {
      setError('Error al registrar reparación');
      console.error(err);
      throw err;
    }
  };

  return { equipments, loading, error, addEquipment, editEquipment, removeEquipment, repairEquipment, refetch: fetchEquipments };
};
