/**
 * Catálogo de rutas de la API del backend.
 * Adapta estas rutas cuando construyas tu backend.
 */
export const ENDPOINTS = {
  // Tareas
  TASKS: '/tasks',
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  TOGGLE_TASK: (id: string) => `/tasks/${id}/toggle`,
  SUBTASKS: (taskId: string) => `/tasks/${taskId}/subtasks`,
  TOGGLE_SUBTASK: (taskId: string, subtaskId: string) => `/tasks/${taskId}/subtasks/${subtaskId}/toggle`,

  // Proyectos
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id: string) => `/projects/${id}`,

  // Métricas y Rendimiento
  METRICS: '/metrics',
  METRICS_WEEKLY: '/metrics/weekly',
  METRICS_EXPORT: '/metrics/export',

  // Autenticación (preparado para futuro login)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  }
} as const;

