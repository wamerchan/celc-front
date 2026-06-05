import { useState, useEffect } from 'react';
import { metricasEndpoints } from '../shared/api/endpoints';

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
          metricasEndpoints.getLineasActivas(),
          metricasEndpoints.getEquiposEnReparacion(),
          metricasEndpoints.getRevisionesProximas(),
        ]);
        setMetrics({
          totalActiveLines: totalActiveLinesRes.data.count,
          equipmentsInRepair: equipmentsInRepairRes.data.count,
          upcomingReviews: upcomingReviewsRes.data.count
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
export default useMetrics;
