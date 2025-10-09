import { useState, useEffect } from 'react';
import * as api from '../services/api';

interface ApiReview {
  id: number;
  equipoId: string;
  fecha: string;
  resultado: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.reviewsAPI.getReviews();
        // Transform API data to component format
        const transformedReviews = response.data.map((review: ApiReview) => ({
          id: review.id,
          equipment: `Equipo ${review.equipoId}`, // You might want to fetch equipment name
          date: review.fecha,
          result: review.resultado,
          equipoId: review.equipoId,
          fecha: review.fecha,
          resultado: review.resultado,
        }));
        setReviews(transformedReviews);
      } catch (err) {
        setError('Error al cargar las revisiones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const addReview = async (review: Omit<api.Review, 'id'>) => {
    try {
      const response = await api.reviewsAPI.createReview({
        equipoId: review.equipoId,
        fecha: review.fecha,
        resultado: review.resultado,
      });
      // Transform the response back to component format
      const newReview: api.Review = {
        id: response.data.id,
        equipment: `Equipo ${response.data.equipoId}`,
        date: response.data.fecha,
        result: response.data.resultado,
        equipoId: response.data.equipoId,
        fecha: response.data.fecha,
        resultado: response.data.resultado,
      };
      setReviews((prevReviews) => [...prevReviews, newReview]);
    } catch (err) {
      setError('Error al crear la revisión');
      console.error(err);
    }
  };

  const editReview = async (review: api.Review) => {
    try {
      const response = await api.reviewsAPI.updateReview(review.id.toString(), {
        equipoId: review.equipoId,
        fecha: review.fecha,
        resultado: review.resultado,
      });
      // Transform the response back to component format
      const updatedReview: api.Review = {
        id: response.data.id,
        equipment: `Equipo ${response.data.equipoId}`,
        date: response.data.fecha,
        result: response.data.resultado,
        equipoId: response.data.equipoId,
        fecha: response.data.fecha,
        resultado: response.data.resultado,
      };
      setReviews((prevReviews) =>
        prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
    } catch (err) {
      setError('Error al actualizar la revisión');
      console.error(err);
    }
  };

  const removeReview = async (reviewId: string) => {
    try {
      await api.reviewsAPI.deleteReview(reviewId);
      setReviews((prevReviews) => prevReviews.filter((r) => r.id.toString() !== reviewId));
    } catch (err) {
      setError('Error al eliminar la revisión');
      console.error(err);
    }
  };

  return { reviews, loading, error, addReview, editReview, removeReview };
};
