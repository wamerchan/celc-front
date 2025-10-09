import React from 'react';
import { useMetrics } from '../hooks/useMetrics';

const MetricCard = ({ title, value, isLoading }: { title: string; value: string | number; isLoading: boolean }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    {isLoading ? (
      <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    ) : (
      <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    )}
  </div>
);

const DashboardView = () => {
  const { metrics, loading, error } = useMetrics();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total de Líneas Activas" 
          value={metrics.totalActiveLines} 
          isLoading={loading} 
        />
        <MetricCard 
          title="Equipos en Reparación" 
          value={metrics.equipmentsInRepair} 
          isLoading={loading} 
        />
        <MetricCard 
          title="Próximas Revisiones" 
          value={metrics.upcomingReviews} 
          isLoading={loading} 
        />
      </div>
    </div>
  );
};

export default DashboardView;