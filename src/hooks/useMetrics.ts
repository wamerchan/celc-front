import { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalActiveLines: 0,
    equipmentsInRepair: 0,
    upcomingReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [totalActiveLinesRes, equipmentsInRepairRes, upcomingReviewsRes] = await Promise.all([
          metricsAPI.getTotalActiveLines(),
          metricsAPI.getEquipmentsInRepair(),
          metricsAPI.getUpcomingReviews(),
        ]);
        setMetrics({
          totalActiveLines: totalActiveLinesRes.data,
          equipmentsInRepair: equipmentsInRepairRes.data,
          upcomingReviews: upcomingReviewsRes.data
        });
      } catch (err) {
        setError('Error al cargar las métricas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};
