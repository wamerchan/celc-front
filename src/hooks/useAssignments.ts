import { useState, useEffect } from 'react';
import { assignmentsAPI } from '../services/api';

export interface Assignment {
  id: string;
  usuarioId: string;
  lineaId: string;
  equipoId: string;
  usuario?: string;
  linea?: string;
  equipo?: string;
}

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentsAPI.getAssignments();
      setAssignments(response.data);
    } catch (err) {
      setError('Error al cargar las asignaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    try {
      await assignmentsAPI.createAssignment(assignment);
      await fetchAssignments();
    } catch (err) {
      setError('Error al crear la asignación');
      console.error(err);
      throw err;
    }
  };

  const editAssignment = async (assignment: Assignment) => {
    try {
      await assignmentsAPI.updateAssignment(assignment.id.toString(), assignment);
      await fetchAssignments();
    } catch (err) {
      setError('Error al actualizar la asignación');
      console.error(err);
      throw err;
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    try {
      await assignmentsAPI.deleteAssignment(assignmentId);
      await fetchAssignments();
    } catch (err) {
      setError('Error al eliminar la asignación');
      console.error(err);
      throw err;
    }
  };

  return { assignments, loading, error, addAssignment, editAssignment, removeAssignment, refetch: fetchAssignments };
};
