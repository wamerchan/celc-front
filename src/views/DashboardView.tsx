import { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';
import { HiOutlinePhone, HiOutlineCheckCircle, HiOutlineWrenchScrewdriver, HiOutlineClock } from 'react-icons/hi2';

interface Stats {
  totalLines: number;
  activeLines: number;
  equipmentsInRepair: number;
  upcomingReviews: number;
}

const DashboardView = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real data from API
        const [linesResponse, repairResponse, reviewsResponse] = await Promise.all([
          metricsAPI.getTotalActiveLines(),
          metricsAPI.getEquipmentsInRepair(),
          metricsAPI.getUpcomingReviews(),
        ]);

        setStats({
          totalLines: linesResponse.data.total || 0,
          activeLines: linesResponse.data.active || 0,
          equipmentsInRepair: repairResponse.data.count || 0,
          upcomingReviews: reviewsResponse.data.count || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error al cargar las estadísticas');
        // Fallback to mock data
        setStats({
          totalLines: 150,
          activeLines: 120,
          equipmentsInRepair: 12,
          upcomingReviews: 5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Líneas',
      value: stats?.totalLines || 0,
      icon: HiOutlinePhone,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Líneas Activas',
      value: stats?.activeLines || 0,
      icon: HiOutlineCheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Equipos en Reparación',
      value: stats?.equipmentsInRepair || 0,
      icon: HiOutlineWrenchScrewdriver,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Revisiones Próximas',
      value: stats?.upcomingReviews || 0,
      icon: HiOutlineClock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">⚠️ {error}</div>
        <p className="text-muted-foreground">Mostrando datos de ejemplo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al Sistema para el Control de Equipos y Líneas de Comunicación - CELC
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="stats-card scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="stats-content">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="flex-1">
                  <p className="stats-label">{card.title}</p>
                  <p className="stats-value">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional dashboard content can be added here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
          </div>
          <div className="card-content">
            <p className="text-muted-foreground">No hay actividad reciente para mostrar.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Alertas</h3>
          </div>
          <div className="card-content">
            <p className="text-muted-foreground">No hay alertas activas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;