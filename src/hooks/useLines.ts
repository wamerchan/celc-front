import { useState, useEffect } from 'react';
import { linesAPI } from '../services/api';

export interface Line {
  id: string;
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
      const response = await linesAPI.getLines();
      setLines(response.data);
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
      await linesAPI.createLine(line);
      await fetchLines();
    } catch (err) {
      setError('Error al crear la línea');
      console.error(err);
      throw err;
    }
  };

  const editLine = async (line: Line) => {
    try {
      await linesAPI.updateLine(line.id.toString(), line);
      await fetchLines();
    } catch (err) {
      setError('Error al actualizar la línea');
      console.error(err);
      throw err;
    }
  };

  const removeLine = async (lineId: string) => {
    try {
      await linesAPI.deleteLine(lineId);
      await fetchLines();
    } catch (err) {
      setError('Error al eliminar la línea');
      console.error(err);
      throw err;
    }
  };

  const toggleStatus = async (lineId: string) => {
    try {
      await linesAPI.toggleStatus(lineId);
      await fetchLines();
    } catch (err) {
      setError('Error al cambiar el estado');
      console.error(err);
      throw err;
    }
  };

  return { lines, loading, error, addLine, editLine, removeLine, toggleStatus, refetch: fetchLines };
};
