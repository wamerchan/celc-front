import { useState, useEffect } from 'react';
import {
  getTotalActiveLines,
  getEquipmentsInRepair,
  getUpcomingReviews,
} from '../services/api';

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
        const [totalActiveLines, equipmentsInRepair, upcomingReviews] = await Promise.all([
          getTotalActiveLines(),
          getEquipmentsInRepair(),
          getUpcomingReviews(),
        ]);
        setMetrics({ totalActiveLines, equipmentsInRepair, upcomingReviews });
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
