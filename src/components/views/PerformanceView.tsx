import React, { useState } from 'react';
import { Flame, CheckCircle2, ShieldCheck, Timer, Clock, Rocket, Target, Award, Download, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { metricsService } from '../../services/metricsService';

export const PerformanceView: React.FC = () => {
  const { metrics, showToast } = useApp();
  const [activeRange, setActiveRange] = useState<'semana' | 'mes' | 'historico'>('semana');
  const [isExporting, setIsExporting] = useState(false);

  const ranges = [
    { id: 'semana' as const, label: 'Esta Semana' },
    { id: 'mes' as const, label: 'Este Mes' },
    { id: 'historico' as const, label: 'Histórico' },
  ];

  const maxDailyCount = Math.max(...metrics.dailyProductivity.map(d => d.count), 1);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await metricsService.exportWeeklyReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte-TaskFlow-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('¡Reporte exportado correctamente!');
    } catch {
      showToast('Error al exportar reporte');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Web Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tu Rendimiento Semanal
            </h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold shadow-2xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>6 días seguidos</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Periodo evaluado: 24 Mar - 30 Mar, 2025 · Análisis de productividad personal
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Segmented Range Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold">
            {ranges.map((range) => {
              const isSelected = activeRange === range.id;
              return (
                <button
                  key={range.id}
                  onClick={() => setActiveRange(range.id)}
                  className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300/40 transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? 'Generando...' : 'Exportar Reporte'}</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Tarjetas de Métricas Clave (Desktop: 4 columnas en una sola fila limpia) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completadas */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completadas</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 leading-none">
              {metrics.completedCount}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              <span>{metrics.completedChange}</span>
            </div>
          </div>
        </div>

        {/* Tasa de Éxito */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasa de Éxito</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 leading-none">
              {metrics.successRate}%
            </span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs font-medium text-slate-400">Excelente ritmo</span>
              <svg className="w-14 h-4 text-emerald-500 overflow-visible" viewBox="0 0 40 12" fill="none">
                <path d="M0 10 Q 15 12, 25 4 T 40 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Enfoque */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enfoque</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">
                {metrics.focusHours}
              </span>
              <span className="text-sm font-bold text-slate-400">hrs</span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1.5">
              {metrics.pomodoros} sesiones pomodoro
            </p>
          </div>
        </div>

        {/* Puntualidad */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Puntualidad</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 leading-none">
              {metrics.punctualityRate}%
            </span>
            <p className="text-xs font-medium text-slate-400 mt-1.5">
              {metrics.punctualityOnTime} tareas entregadas a tiempo
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Web Layout: Gráficos (Productividad Diaria + Distribución de Categorías) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Productividad Diaria (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Productividad Diaria</h3>
                <p className="text-xs text-slate-400 mt-0.5">Distribución de tareas finalizadas por día</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              ⭐ Pico: Martes (8)
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-6 flex items-end justify-between gap-3 h-52 border-b border-slate-100 pb-2">
            {metrics.dailyProductivity.map((item) => {
              const heightPercent = (item.count / maxDailyCount) * 100;
              const isPeak = item.isPeak;

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {isPeak ? (
                    <div className="mb-1.5 px-2 py-0.5 rounded-md bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      MAX {item.count}
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                  )}

                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        isPeak
                          ? 'bg-indigo-600 shadow-md shadow-indigo-300'
                          : 'bg-indigo-200/70 hover:bg-indigo-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>

                  <span className={`text-xs mt-2.5 font-bold ${isPeak ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribución por Categoría (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Distribución por Categoría</h3>
                <p className="text-xs text-slate-400 mt-0.5">38 tareas totales completadas</p>
              </div>
            </div>
          </div>

          {/* Segmented Horizontal Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 gap-0.5">
              {metrics.categoryDistribution.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                />
              ))}
            </div>
          </div>

          {/* Legend Rows */}
          <div className="space-y-2.5 pt-2">
            {metrics.categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="font-bold text-slate-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">{cat.tasksCount} tareas</span>
                  <span className="font-extrabold text-slate-900 w-10 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Logros Desbloqueados (2 Columnas Web) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Logros Desbloqueados</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            2 nuevos logros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    ach.icon === 'rocket' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {ach.icon === 'rocket' ? (
                    <Rocket className="w-6 h-6 stroke-[2]" />
                  ) : (
                    <Target className="w-6 h-6 stroke-[2]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900">{ach.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        ach.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ach.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
                </div>
              </div>

              <div className="text-indigo-600 shrink-0">
                {ach.rightIcon === 'medal' ? (
                  <Award className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
