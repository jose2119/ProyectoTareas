import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { PerformanceMetrics } from '../types';
import { initialMetrics } from '../data/mockData';

export const metricsService = {
  /**
   * Obtiene las métricas de rendimiento y productividad.
   * Llama a GET /api/metrics/weekly
   */
  async getWeeklyMetrics(): Promise<PerformanceMetrics> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return initialMetrics;
    }
    try {
      const response = await apiClient.get<PerformanceMetrics>(ENDPOINTS.METRICS_WEEKLY);
      return response.data;
    } catch {
      return initialMetrics;
    }
  },

  /**
   * Dispara la exportación del reporte semanal.
   * Llama a POST /api/metrics/export
   */
  async exportWeeklyReport(): Promise<Blob> {
    try {
      const response = await apiClient.post(
        ENDPOINTS.METRICS_EXPORT,
        {},
        { responseType: 'blob' }
      );
      return response.data;
    } catch {
      // Simula descarga de archivo PDF/CSV con Blob
      const mockContent = 'Reporte Semanal de Tareas TaskFlow - Resumen de Productividad';
      return new Blob([mockContent], { type: 'text/plain' });
    }
  }
};
