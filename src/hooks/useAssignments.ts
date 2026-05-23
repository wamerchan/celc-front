import { useState, useEffect } from 'react';
import { asignacionesEndpoints } from '../shared/api/endpoints';

export interface Assignment {
  id: string | number;
  usuarioId: string | number;
  lineaId: string | number;
  equipoId: string | number;
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
      const response = await asignacionesEndpoints.getAll();
      const mappedAssignments = response.data.map((a) => ({
        id: a.id,
        usuarioId: a.usuarioId,
        lineaId: a.lineaId || '',
        equipoId: a.equipoId || '',
        usuario: `${a.usuario.nombres} ${a.usuario.apellidos || ''}`.trim(),
        linea: a.linea?.numeroTelefono || '',
        equipo: a.equipo ? `${a.equipo.marca} ${a.equipo.modelo}` : '',
      }));
      setAssignments(mappedAssignments);
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
      await asignacionesEndpoints.create({
        usuarioId: Number(assignment.usuarioId),
        lineaId: assignment.lineaId ? Number(assignment.lineaId) : undefined,
        equipoId: assignment.equipoId ? Number(assignment.equipoId) : undefined,
      });
      await fetchAssignments();
    } catch (err) {
      setError('Error al crear la asignación');
      console.error(err);
      throw err;
    }
  };

  const editAssignment = async (assignment: Assignment) => {
    try {
      await asignacionesEndpoints.update(Number(assignment.id), {
        usuarioId: Number(assignment.usuarioId),
        lineaId: assignment.lineaId ? Number(assignment.lineaId) : undefined,
        equipoId: assignment.equipoId ? Number(assignment.equipoId) : undefined,
      });
      await fetchAssignments();
    } catch (err) {
      setError('Error al actualizar la asignación');
      console.error(err);
      throw err;
    }
  };

  const removeAssignment = async (assignmentId: string | number) => {
    try {
      await asignacionesEndpoints.delete(Number(assignmentId));
      await fetchAssignments();
    } catch (err) {
      setError('Error al eliminar la asignación');
      console.error(err);
      throw err;
    }
  };

  return { assignments, loading, error, addAssignment, editAssignment, removeAssignment, refetch: fetchAssignments };
};
export default useAssignments;
