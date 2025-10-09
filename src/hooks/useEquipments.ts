import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Equipment } from '../services/api';

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const fetchedEquipments = await api.getEquipments();
        setEquipments(fetchedEquipments);
      } catch (err) {
        setError('Error al cargar los equipos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const addEquipment = async (equipment: Omit<Equipment, 'id'>) => {
    try {
      const newEquipment = await api.createEquipment(equipment);
      setEquipments((prevEquipments) => [...prevEquipments, newEquipment]);
    } catch (err) {
      setError('Error al crear el equipo');
      console.error(err);
    }
  };

  const editEquipment = async (equipment: Equipment) => {
    try {
      const updatedEquipment = await api.updateEquipment(equipment);
      setEquipments((prevEquipments) =>
        prevEquipments.map((e) => (e.id === updatedEquipment.id ? updatedEquipment : e))
      );
    } catch (err) {
      setError('Error al actualizar el equipo');
      console.error(err);
    }
  };

  const removeEquipment = async (equipmentId: string) => {
    try {
      await api.deleteEquipment(equipmentId);
      setEquipments((prevEquipments) => prevEquipments.filter((e) => e.id !== equipmentId));
    } catch (err) {
      setError('Error al eliminar el equipo');
      console.error(err);
    }
  };

  return { equipments, loading, error, addEquipment, editEquipment, removeEquipment };
};
