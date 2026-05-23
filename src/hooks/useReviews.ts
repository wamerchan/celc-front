import { useState, useEffect } from 'react';
import { revisionesEndpoints } from '../shared/api/endpoints';
import { apiClient } from '../shared/api/client';
import type { RevisionResultado } from '../shared/types/api.types';

export interface Review {
  id: string | number;
  equipment: string;
  date: string;
  result: string;
  equipoId: string | number;
  fecha: string;
  resultado: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await revisionesEndpoints.getAll();
      const transformedReviews = response.data.map((review) => ({
        id: review.id,
        equipment: review.equipo ? `${review.equipo.marca} ${review.equipo.modelo}` : `Equipo ${review.equipoId}`,
        date: review.fechaRealizada || review.fechaProgramada,
        result: review.resultado || 'Pendiente',
        equipoId: review.equipoId,
        fecha: review.fechaProgramada,
        resultado: review.resultado || 'Pendiente',
      }));
      setReviews(transformedReviews);
    } catch (err) {
      setError('Error al cargar las revisiones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (review: Omit<Review, 'id'>) => {
    try {
      await revisionesEndpoints.create({
        equipoId: Number(review.equipoId),
        fechaProgramada: review.fecha,
        resultado: review.resultado as RevisionResultado,
      });
      await fetchReviews();
    } catch (err) {
      setError('Error al crear la revisión');
      console.error(err);
    }
  };

  const editReview = async (review: Review) => {
    try {
      await revisionesEndpoints.update(Number(review.id), {
        equipoId: Number(review.equipoId),
        fechaProgramada: review.fecha,
        resultado: review.resultado as RevisionResultado,
      });
      await fetchReviews();
    } catch (err) {
      setError('Error al actualizar la revisión');
      console.error(err);
    }
  };

  const removeReview = async (reviewId: string | number) => {
    try {
      const id = typeof reviewId === 'string' ? parseInt(reviewId, 10) : reviewId;
      await apiClient.delete(`/revisiones/${id}`);
      await fetchReviews();
    } catch (err) {
      setError('Error al eliminar la revisión');
      console.error(err);
    }
  };

  return { reviews, loading, error, addReview, editReview, removeReview };
};
export default useReviews;
