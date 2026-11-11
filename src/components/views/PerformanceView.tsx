import React, { useState } from 'react';
import { Flame, CheckCircle2, ShieldCheck, Timer, Clock, Rocket, Target, Award, Download, ArrowUpRight } from 'lucide-react';
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
    <div className="pb-32 px-5 pt-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* 1. Título y Racha */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Tu Rendimiento Semanal
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">24 Mar - 30 Mar, 2025</p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-semibold shadow-2xs">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>6 días</span>
        </div>
      </div>

      {/* 2. Rango Temporal (Segmented Tabs) */}
      <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
        {ranges.map((range) => {
          const isSelected = activeRange === range.id;
          return (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>

      {/* 3. 4 Tarjetas de Métricas Clave (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Completadas */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completadas</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {metrics.completedCount}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              <span>{metrics.completedChange}</span>
            </div>
          </div>
        </div>

        {/* Tasa de Éxito */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tasa de Éxito</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {metrics.successRate}%
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-medium text-slate-400">Excelente ritmo</span>
              {/* Mini Sparkline SVG */}
              <svg className="w-12 h-3.5 text-emerald-500 overflow-visible" viewBox="0 0 40 12" fill="none">
                <path d="M0 10 Q 15 12, 25 4 T 40 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Enfoque */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Enfoque</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Timer className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {metrics.focusHours}
              </span>
              <span className="text-xs font-bold text-slate-400">hrs</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-1">
              {metrics.pomodoros} pomodoros
            </p>
          </div>
        </div>

        {/* Puntualidad */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Puntualidad</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {metrics.punctualityRate}%
            </span>
            <p className="text-[10px] font-medium text-slate-400 mt-1">
              {metrics.punctualityOnTime} a tiempo
            </p>
          </div>
        </div>
      </div>

      {/* 4. Productividad Diaria (Bar Chart) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Productividad Diaria</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Distribución de tareas finalizadas</p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
            ⭐ Pico: Martes (8)
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="pt-4 flex items-end justify-between gap-2 h-40 border-b border-slate-100 pb-2">
          {metrics.dailyProductivity.map((item) => {
            const heightPercent = (item.count / maxDailyCount) * 100;
            const isPeak = item.isPeak;

            return (
              <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Floating MAX badge for peak day */}
                {isPeak && (
                  <div className="mb-1 px-1.5 py-0.5 rounded-md bg-indigo-700 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                    MAX {item.count}
                  </div>
                )}
                {!isPeak && (
                  <span className="text-[10px] font-bold text-slate-400 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                )}

                {/* Bar */}
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isPeak
                        ? 'bg-indigo-600 shadow-sm shadow-indigo-300'
                        : 'bg-indigo-200/70 hover:bg-indigo-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>

                {/* Day label */}
                <span className={`text-[11px] mt-2 font-bold ${isPeak ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Distribución por Categoría */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900">Distribución por Categoría</h4>
          <span className="text-xs font-semibold text-slate-400">38 tareas totales</span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 gap-0.5">
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

        {/* Legend rows */}
        <div className="space-y-2 pt-1">
          {metrics.categoryDistribution.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span className="font-semibold text-slate-700">{cat.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">{cat.tasksCount} tareas</span>
                <span className="font-bold text-slate-800 w-8 text-right">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Logros Desbloqueados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900">Logros Desbloqueados</h4>
          <span className="text-xs font-bold text-indigo-600">2 nuevos</span>
        </div>

        <div className="space-y-2.5">
          {metrics.achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    ach.icon === 'rocket' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {ach.icon === 'rocket' ? (
                    <Rocket className="w-5 h-5 stroke-[2]" />
                  ) : (
                    <Target className="w-5 h-5 stroke-[2]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900">{ach.title}</h5>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        ach.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ach.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>

              <div className="text-indigo-600">
                {ach.rightIcon === 'medal' ? (
                  <Award className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Botón: Exportar Reporte Semanal */}
      <div className="space-y-3 pt-2 text-center">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-indigo-400"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{isExporting ? 'Generando Reporte...' : 'Exportar Reporte Semanal'}</span>
        </button>

        <button
          onClick={() => showToast('Historial completo disponible')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Ver Historial Completo</span>
        </button>
      </div>
    </div>
  );
};

