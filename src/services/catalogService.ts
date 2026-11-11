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
   * Crea una nueva categoría.
   * POST /api/categorias
   */
  async createCategory(nombre: string, color = '#6366f1', icono = 'briefcase'): Promise<Category> {
    const response = await apiClient.post<Category>(ENDPOINTS.CATEGORIAS.BASE, { nombre, color, icono });
    return response.data;
  },

  /**
   * Elimina una categoría por ID.
   * DELETE /api/categorias/:id
   */
  async deleteCategory(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.CATEGORIAS.BY_ID(id));
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

  /**
   * Crea una nueva etiqueta.
   * POST /api/etiquetas
   */
  async createTag(nombre: string, color = '#6366f1'): Promise<Tag> {
    const response = await apiClient.post<Tag>(ENDPOINTS.ETIQUETAS.BASE, { nombre, color });
    return response.data;
  },

  /**
   * Elimina una etiqueta por ID.
   * DELETE /api/etiquetas/:id
   */
  async deleteTag(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.ETIQUETAS.BY_ID(id));
  },
};

