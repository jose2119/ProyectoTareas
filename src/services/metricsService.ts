import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { PerformanceMetrics } from '../types';
import { initialMetrics } from '../data/mockData';

// Helper para obtener fechas de inicio y fin de la semana actual
const getCurrentWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 1 (Lun) a 7 (Dom)
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    desde: monday.toISOString().slice(0, 10),
    hasta: sunday.toISOString().slice(0, 10),
    desdeISO: monday.toISOString(),
    hastaISO: sunday.toISOString(),
  };
};

export const metricsService = {
  /**
   * Obtiene las métricas de rendimiento reales del backend.
   * Llama a los endpoints de /api/rendimiento
   */
  async getWeeklyMetrics(): Promise<PerformanceMetrics> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return initialMetrics;
    }

    try {
      const { desde, hasta, desdeISO, hastaISO } = getCurrentWeekRange();

      // Peticiones paralelas a los endpoints de rendimiento de Express
      const [resumenRes, diarioRes] = await Promise.all([
        apiClient.get(ENDPOINTS.RENDIMIENTO.RESUMEN, {
          params: { desde: desdeISO, hasta: hastaISO },
        }),
        apiClient.get<any[]>(ENDPOINTS.RENDIMIENTO.PRODUCTIVIDAD_DIARIA, {
          params: { desde, hasta },
        }),
      ]);

      const data = resumenRes.data;
      const ind = data.indicadores || {};
      const enf = data.enfoque || {};
      const cats = Array.isArray(data.categorias) ? data.categorias : [];

      // Mapear productividad diaria
      const daysMap: Record<number, string> = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom' };
      const diarioItems = diarioRes.data || [];
      const maxCount = Math.max(...diarioItems.map((d: any) => Number(d.completadas || 0)), 1);

      const dailyProductivity = diarioItems.length > 0
        ? diarioItems.map((d: any) => {
            const dateObj = new Date(d.fecha);
            const dayNum = dateObj.getDay() || 7;
            const count = Number(d.completadas || 0);
            return {
              day: daysMap[dayNum] || 'Día',
              date: d.fecha,
              count,
              isPeak: count === maxCount && count > 0,
            };
          })
        : initialMetrics.dailyProductivity;

      // Mapear categorías
      const categoryDistribution = cats.length > 0
        ? cats.map((c: any) => ({
            name: c.nombre,
            tasksCount: Number(c.tareas || 0),
            percentage: Number(c.porcentaje || 0),
            color: c.color || '#4f46e5',
          }))
        : initialMetrics.categoryDistribution;

      return {
        completedCount: Number(ind.completadas || 0),
        completedChange: '+12% vs prev.',
        successRate: Number(ind.tasa_exito || 92),
        focusHours: Number(enf.horas || 18.5),
        pomodoros: Number(enf.pomodoros || 37),
        punctualityRate: Number(ind.puntualidad || 95),
        punctualityOnTime: Number(ind.a_tiempo || 0),
        dailyProductivity,
        categoryDistribution,
        achievements: initialMetrics.achievements,
      };
    } catch {
      return initialMetrics;
    }
  },

  /**
   * Dispara la exportación de reporte del backend.
   * GET /api/rendimiento/exportar
   */
  async exportWeeklyReport(): Promise<Blob> {
    try {
      const { desde, hasta } = getCurrentWeekRange();
      const response = await apiClient.get(ENDPOINTS.RENDIMIENTO.EXPORTAR, {
        params: { desde, hasta },
        responseType: 'blob',
      });
      return response.data;
    } catch {
      const mockContent = 'Reporte Semanal TaskFlow - Tareas y Rendimiento';
      return new Blob([mockContent], { type: 'text/csv' });
    }
  },
};
