import { useState, useEffect } from 'react';
import { equiposEndpoints } from '../shared/api/endpoints';
import { apiClient } from '../shared/api/client';
import type { EquipoEstado } from '../shared/types/api.types';

export interface Equipment {
  id: string | number;
  modelo: string;
  marca: string;
  estado: string;
  numeroSerie?: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await equiposEndpoints.getAll();
      const mappedEquipments = response.data.map((e) => ({
        id: e.id,
        modelo: e.modelo,
        marca: e.marca,
        estado: e.estado,
        numeroSerie: e.numeroSerie,
      }));
      setEquipments(mappedEquipments);
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
      await equiposEndpoints.create({
        marca: equipment.marca,
        modelo: equipment.modelo,
        numeroSerie: 'SN-' + Math.random().toString(36).substring(2, 9).toUpperCase(), // Default SN if not provided
        estado: equipment.estado as EquipoEstado,
      });
      await fetchEquipments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el equipo';
      setError(msg);
      console.error(err);
      throw err;
    }
  };

  const editEquipment = async (equipment: Equipment) => {
    try {
      await equiposEndpoints.update(Number(equipment.id), {
        marca: equipment.marca,
        modelo: equipment.modelo,
        estado: equipment.estado as EquipoEstado,
      });
      await fetchEquipments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el equipo';
      setError(msg);
      console.error(err);
      throw err;
    }
  };

  const removeEquipment = async (equipmentId: string | number) => {
    try {
      await equiposEndpoints.delete(Number(equipmentId));
      await fetchEquipments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar el equipo';
      setError(msg);
      console.error(err);
      throw err;
    }
  };

  const repairEquipment = async (equipmentId: string | number, descripcion: string) => {
    try {
      await apiClient.put(`/equipos/${equipmentId}/repair`, { descripcion });
      await fetchEquipments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrar reparación';
      setError(msg);
      console.error(err);
      throw err;
    }
  };

  return { equipments, loading, error, addEquipment, editEquipment, removeEquipment, repairEquipment, refetch: fetchEquipments };
};
export default useEquipments;
