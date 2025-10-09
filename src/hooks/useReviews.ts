import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Review } from '../services/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const fetchedReviews = await api.getReviews();
        setReviews(fetchedReviews);
      } catch (err) {
        setError('Error al cargar las revisiones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const addReview = async (review: Omit<Review, 'id'>) => {
    try {
      const newReview = await api.createReview(review);
      setReviews((prevReviews) => [...prevReviews, newReview]);
    } catch (err) {
      setError('Error al crear la revisión');
      console.error(err);
    }
  };

  const editReview = async (review: Review) => {
    try {
      const updatedReview = await api.updateReview(review);
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
      await api.deleteReview(reviewId);
      setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError('Error al eliminar la revisión');
      console.error(err);
    }
  };

  return { reviews, loading, error, addReview, editReview, removeReview };
};
