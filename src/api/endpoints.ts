/**
 * Catálogo completo de endpoints de la API en Express (Render).
 * Coincide 1:1 con la documentación de Swagger: https://backend-tareas-fvnx.onrender.com/api-docs/
 */
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },

  // Pantalla Hoy
  HOY: {
    PROGRESO: '/hoy/progreso',
    TAREAS: '/hoy/tareas',
    RACHA: '/hoy/racha',
  },

  // Tareas
  TAREAS: {
    BASE: '/tareas',
    BY_ID: (id: string | number) => `/tareas/${id}`,
    COMPLETAR: (id: string | number) => `/tareas/${id}/completar`,
    ESTADO: (id: string | number) => `/tareas/${id}/estado`,
  },

  // Subtareas
  SUBTAREAS: {
    BASE: '/subtareas',
    BY_ID: (id: string | number) => `/subtareas/${id}`,
    TOGGLE: (id: string | number) => `/subtareas/${id}/toggle`,
  },

  // Proyectos
  PROYECTOS: {
    BASE: '/proyectos',
    BY_ID: (id: string | number) => `/proyectos/${id}`,
  },

  // Categorías
  CATEGORIAS: {
    BASE: '/categorias',
    BY_ID: (id: string | number) => `/categorias/${id}`,
  },

  // Etiquetas
  ETIQUETAS: {
    BASE: '/etiquetas',
    BY_ID: (id: string | number) => `/etiquetas/${id}`,
  },

  // Rendimiento
  RENDIMIENTO: {
    INDICADORES: '/rendimiento/indicadores',
    PRODUCTIVIDAD_DIARIA: '/rendimiento/productividad-diaria',
    POR_CATEGORIA: '/rendimiento/por-categoria',
    ENFOQUE: '/rendimiento/enfoque',
    RESUMEN: '/rendimiento/resumen',
    EXPORTAR: '/rendimiento/exportar',
  },

  // Logros
  LOGROS: {
    BASE: '/logros',
    MIS_LOGROS: '/logros/mis-logros',
  },
} as const;
