import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { metricasEndpoints } from '../shared/api/endpoints';
import { useUIStore } from '../store/useUIStore';
import { HiOutlinePhone, HiOutlineCheckCircle, HiOutlineWrenchScrewdriver, HiOutlineClock } from 'react-icons/hi2';
import type { DashboardMetrics } from '../shared/types/api.types';
import { Spinner } from '../shared/components/ui/Spinner';

const DashboardView = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useUIStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await metricasEndpoints.getDashboard();
        setMetrics(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar las métricas reales del sistema');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-rose-500/10 rounded-2xl border border-rose-500/20 max-w-xl mx-auto my-8">
        <div className="text-rose-500 text-lg font-semibold mb-2">⚠️ Error de carga</div>
        <p className="text-sm text-[var(--color-text-muted)]">{error}</p>
      </div>
    );
  }

  // --- ECharts Custom Theme Settings ---
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const labelColor = isDark ? '#f8fafc' : '#0f172a';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipBg = isDark ? '#0d111d' : '#ffffff';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  const chartColors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899'];

  const optionChart1 = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Estado de Equipos', 
      left: 'center',
      textStyle: { color: labelColor, fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 'bold' }
    },
    tooltip: { 
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText }
    },
    legend: { 
      bottom: '0%',
      textStyle: { color: textColor }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { 
        borderRadius: 8, 
        borderColor: isDark ? '#0d111d' : '#fff', 
        borderWidth: 2 
      },
      label: { show: false },
      data: (metrics?.equiposPorEstado || []).map(d => ({
        name: d.estado.replace(/_/g, ' '),
        value: d.count
      }))
    }],
    color: chartColors
  };

  const optionChart2 = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Líneas por Operador', 
      left: 'center',
      textStyle: { color: labelColor, fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 'bold' }
    },
    tooltip: { 
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText }
    },
    legend: { 
      bottom: '0%',
      textStyle: { color: textColor }
    },
    series: [{
      type: 'pie',
      radius: '60%',
      itemStyle: { 
        borderRadius: 6,
        borderColor: isDark ? '#0d111d' : '#fff', 
        borderWidth: 1
      },
      data: (metrics?.lineasPorOperador || []).map(d => ({
        name: d.operador,
        value: d.count
      }))
    }],
    color: chartColors
  };

  const optionChart3 = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Revisiones por Mes',
      left: 'left',
      textStyle: { color: labelColor, fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 'bold' }
    },
    tooltip: { 
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: (metrics?.revisionesPorMes || []).map(d => d.mes),
      axisLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor }
    },
    yAxis: { 
      type: 'value',
      axisLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor } }
    },
    series: [{
      data: (metrics?.revisionesPorMes || []).map(d => d.count),
      type: 'line',
      smooth: true,
      symbolSize: 6,
      lineStyle: { width: 3, color: '#10b981' },
      itemStyle: { color: '#10b981' },
      areaStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
          ]
        }
      }
    }]
  };

  const optionChart4 = {
    backgroundColor: 'transparent',
    title: { 
      text: 'Top Marcas de Equipos',
      left: 'left',
      textStyle: { color: labelColor, fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 'bold' }
    },
    tooltip: { 
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'value',
      axisLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor } }
    },
    yAxis: { 
      type: 'category', 
      data: (metrics?.topMarcas || []).map(d => d.marca),
      axisLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor }
    },
    series: [{
      type: 'bar',
      data: (metrics?.topMarcas || []).map(d => d.count),
      itemStyle: { 
        borderRadius: [0, 4, 4, 0],
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#3b82f6' }
          ]
        }
      }
    }]
  };

  const statCards = [
    { title: 'Total Líneas', value: metrics?.totalLineas || 0, icon: HiOutlinePhone, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Líneas Activas', value: metrics?.lineasActivas || 0, icon: HiOutlineCheckCircle, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: 'Equipos en Mantenimiento', value: metrics?.equiposEnMantenimiento || 0, icon: HiOutlineWrenchScrewdriver, color: 'text-amber-500', bgColor: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Revisiones Próximas', value: metrics?.revisionesProximas || 0, icon: HiOutlineClock, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10 border-indigo-500/20' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-transparent">
          Dashboard Informativo
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] font-medium">
          Sistema para el Control de Equipos y Líneas de Comunicación - CELC v2.0
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className={`p-5 rounded-2xl border bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg flex items-center transition-all duration-300 hover:scale-[1.02] ${card.bgColor}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)]/90 shadow-sm shrink-0">
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="ml-4 min-w-0 text-left">
                <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-extrabold text-[var(--color-text)] mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
          <ReactECharts option={optionChart1} style={{ height: '300px' }} />
        </div>
        <div className="p-6 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
          <ReactECharts option={optionChart2} style={{ height: '300px' }} />
        </div>
        <div className="p-6 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
          <ReactECharts option={optionChart3} style={{ height: '300px' }} />
        </div>
        <div className="p-6 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
          <ReactECharts option={optionChart4} style={{ height: '300px' }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
