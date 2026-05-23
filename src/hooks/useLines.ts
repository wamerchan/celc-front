import { useState, useEffect } from 'react';
import { lineasEndpoints } from '../shared/api/endpoints';
import type { LineaEstado } from '../shared/types/api.types';

export interface Line {
  id: string | number;
  numero: string;
  estado: string;
  plan: string;
}

export const useLines = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLines = async () => {
    try {
      setLoading(true);
      const response = await lineasEndpoints.getAll();
      const mappedLines = response.data.map((l) => ({
        id: l.id,
        numero: l.numeroTelefono,
        estado: l.estado,
        plan: l.planDatos || '',
      }));
      setLines(mappedLines);
    } catch (err) {
      setError('Error al cargar las líneas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const addLine = async (line: Omit<Line, 'id'>) => {
    try {
      await lineasEndpoints.create({
        numeroTelefono: line.numero,
        operador: 'Claro',
        planDatos: line.plan,
        estado: line.estado as LineaEstado,
      });
      await fetchLines();
    } catch (err) {
      setError('Error al crear la línea');
      console.error(err);
      throw err;
    }
  };

  const editLine = async (line: Line) => {
    try {
      await lineasEndpoints.update(Number(line.id), {
        numeroTelefono: line.numero,
        planDatos: line.plan,
        estado: line.estado as LineaEstado,
      });
      await fetchLines();
    } catch (err) {
      setError('Error al actualizar la línea');
      console.error(err);
      throw err;
    }
  };

  const removeLine = async (lineId: string | number) => {
    try {
      await lineasEndpoints.delete(Number(lineId));
      await fetchLines();
    } catch (err) {
      setError('Error al eliminar la línea');
      console.error(err);
      throw err;
    }
  };

  const toggleStatus = async (lineId: string | number) => {
    try {
      await lineasEndpoints.toggleStatus(Number(lineId));
      await fetchLines();
    } catch (err) {
      setError('Error al cambiar el estado');
      console.error(err);
      throw err;
    }
  };

  return { lines, loading, error, addLine, editLine, removeLine, toggleStatus, refetch: fetchLines };
};
export default useLines;
