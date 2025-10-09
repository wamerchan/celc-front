import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Assignment } from '../services/api';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const fetchedAssignments = await api.getAssignments();
        setAssignments(fetchedAssignments);
      } catch (err) {
        setError('Error al cargar las asignaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    try {
      const newAssignment = await api.createAssignment(assignment);
      setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
    } catch (err) {
      setError('Error al crear la asignación');
      console.error(err);
    }
  };

  const editAssignment = async (assignment: Assignment) => {
    try {
      const updatedAssignment = await api.updateAssignment(assignment);
      setAssignments((prevAssignments) =>
        prevAssignments.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
      );
    } catch (err) {
      setError('Error al actualizar la asignación');
      console.error(err);
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    try {
      await api.deleteAssignment(assignmentId);
      setAssignments((prevAssignments) => prevAssignments.filter((a) => a.id !== assignmentId));
    } catch (err) {
      setError('Error al eliminar la asignación');
      console.error(err);
    }
  };

  return { assignments, loading, error, addAssignment, editAssignment, removeAssignment };
};
