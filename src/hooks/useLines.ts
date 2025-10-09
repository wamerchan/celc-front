import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Line } from '../services/api';

export const useLines = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        setLoading(true);
        const fetchedLines = await api.getLines();
        setLines(fetchedLines);
      } catch (err) {
        setError('Error al cargar las líneas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, []);

  const addLine = async (line: Omit<Line, 'id'>) => {
    try {
      const newLine = await api.createLine(line);
      setLines((prevLines) => [...prevLines, newLine]);
    } catch (err) {
      setError('Error al crear la línea');
      console.error(err);
    }
  };

  const editLine = async (line: Line) => {
    try {
      const updatedLine = await api.updateLine(line);
      setLines((prevLines) =>
        prevLines.map((l) => (l.id === updatedLine.id ? updatedLine : l))
      );
    } catch (err) {
      setError('Error al actualizar la línea');
      console.error(err);
    }
  };

  const removeLine = async (lineId: string) => {
    try {
      await api.deleteLine(lineId);
      setLines((prevLines) => prevLines.filter((l) => l.id !== lineId));
    } catch (err) {
      setError('Error al eliminar la línea');
      console.error(err);
    }
  };

  return { lines, loading, error, addLine, editLine, removeLine };
};
