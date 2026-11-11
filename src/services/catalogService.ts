import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Category, Tag } from '../types';

export const catalogService = {
  /**
   * Obtiene la lista de categorías del usuario desde el backend.
   * GET /api/categorias
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIAS.BASE);
      return response.data;
    } catch {
      return [
        { categoria_id: 1, nombre: 'Trabajo', color: '#6366f1', icono: 'briefcase' },
        { categoria_id: 2, nombre: 'UX Design', color: '#8b5cf6', icono: 'palette' },
        { categoria_id: 3, nombre: 'Finanzas', color: '#be123c', icono: 'creditCard' },
        { categoria_id: 4, nombre: 'Personal', color: '#10b981', icono: 'user' },
      ];
    }
  },

  /**
   * Obtiene la lista de etiquetas desde el backend.
   * GET /api/etiquetas
   */
  async getTags(): Promise<Tag[]> {
    try {
      const response = await apiClient.get<Tag[]>(ENDPOINTS.ETIQUETAS.BASE);
      return response.data;
    } catch {
      return [
        { etiqueta_id: 1, nombre: 'urgente', color: '#ef4444' },
        { etiqueta_id: 2, nombre: 'reunión', color: '#6366f1' },
        { etiqueta_id: 3, nombre: 'bug', color: '#be123c' },
        { etiqueta_id: 4, nombre: 'diseño', color: '#10b981' },
        { etiqueta_id: 5, nombre: 'compras', color: '#818cf8' },
      ];
    }
  },
};
