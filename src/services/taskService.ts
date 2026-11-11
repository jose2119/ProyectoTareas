import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Task, Subtask } from '../types';
import { initialTasks } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'taskflow_tasks_data';

// Helper de mapeo de DTO del backend en Express a modelo Task de React
export const mapBackendTareaToTask = (raw: any): Task => {
  const isCompleted = raw.estado === 'Completada';
  const timeFormatted = raw.hora_vencimiento ? raw.hora_vencimiento.slice(0, 5) : '12:00';
  const dateFormatted = raw.fecha_vencimiento ? String(raw.fecha_vencimiento).slice(0, 10) : 'Hoy, 24 Oct';

  return {
    id: String(raw.tarea_id || raw.id),
    tarea_id: raw.tarea_id,
    title: raw.titulo || raw.title || 'Sin título',
    description: raw.descripcion || raw.description || '',
    category: raw.categoria_nombre || raw.categoria || raw.category || 'Trabajo',
    categoria_id: raw.categoria_id,
    priority: (raw.prioridad || raw.priority || 'Media') as Task['priority'],
    dueDate: dateFormatted,
    dueTime: timeFormatted,
    isVideoCall: !!raw.es_reunion,
    completed: isCompleted,
    completedAt: raw.fecha_completada
      ? new Date(raw.fecha_completada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : raw.completedAt,
    completedOnTime: raw.completada_a_tiempo,
    reminderActive: !!raw.recordatorio_activo,
    reminderMinutes: raw.recordatorio_minutos || 15,
    reminderText: raw.recordatorio_activo ? `${raw.recordatorio_minutos || 15} min antes` : undefined,
    subtasks: Array.isArray(raw.subtareas)
      ? raw.subtareas.map((st: any) => ({
          id: String(st.subtarea_id || st.id),
          subtarea_id: st.subtarea_id,
          title: st.titulo || st.title,
          completed: !!st.completada,
        }))
      : [],
    subtasksCount: Number(raw.subtareas_total ?? raw.subtasks?.length ?? 0),
    subtasksCompleted: Number(raw.subtareas_completadas ?? raw.subtasks?.filter((s: any) => s.completed).length ?? 0),
    projectId: raw.proyecto_id,
    createdAt: raw.fecha_creacion,
  };
};

const getLocalTasks = (): Task[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing local tasks', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
  return initialTasks;
};

const saveLocalTasks = (tasks: Task[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  /**
   * Obtiene la lista completa de tareas del usuario.
   * GET /api/tareas
   */
  async getTasks(): Promise<Task[]> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return getLocalTasks();
    }
    try {
      const response = await apiClient.get<any[]>(ENDPOINTS.TAREAS.BASE);
      const mapped = response.data.map(mapBackendTareaToTask);
      saveLocalTasks(mapped);
      return mapped;
    } catch {
      return getLocalTasks();
    }
  },

  /**
   * Obtiene las tareas pendientes específicas para hoy.
   * GET /api/hoy/tareas
   */
  async getTodayTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<any[]>(ENDPOINTS.HOY.TAREAS);
      return response.data.map(mapBackendTareaToTask);
    } catch {
      return (await this.getTasks()).filter(t => !t.completed);
    }
  },

  /**
   * Obtiene el progreso del día (hechas, total, porcentaje).
   * GET /api/hoy/progreso
   */
  async getTodayProgress(): Promise<{ hechas: number; total: number; porcentaje: number }> {
    try {
      const response = await apiClient.get<{ hechas: number | string; total: number | string; porcentaje: number | string }>(
        ENDPOINTS.HOY.PROGRESO
      );
      return {
        hechas: Number(response.data.hechas || 0),
        total: Number(response.data.total || 0),
        porcentaje: Number(response.data.porcentaje || 0),
      };
    } catch {
      const tasks = getLocalTasks();
      const hechas = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      return {
        hechas,
        total,
        porcentaje: total > 0 ? Math.round((hechas / total) * 100) : 0,
      };
    }
  },

  /**
   * Obtiene la racha actual del usuario.
   * GET /api/hoy/racha
   */
  async getUserStreak(): Promise<number> {
    try {
      const response = await apiClient.get<{ racha_actual: number }>(ENDPOINTS.HOY.RACHA);
      return Number(response.data.racha_actual || 4);
    } catch {
      return 4;
    }
  },

  /**
   * Crea una nueva tarea en el backend.
   * POST /api/tareas
   */
  async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    // Normalizar payload para el schema del backend
    const payload = {
      titulo: taskData.title,
      descripcion: taskData.description || null,
      prioridad: taskData.priority || 'Media',
      proyecto_id: taskData.projectId ? Number(taskData.projectId) : null,
      categoria_id: taskData.categoria_id || 1,
      fecha_vencimiento: taskData.dueDate.includes('Oct') ? new Date().toISOString().slice(0, 10) : taskData.dueDate,
      hora_vencimiento: taskData.dueTime ? taskData.dueTime.slice(0, 5) : '12:00',
      es_reunion: !!taskData.isVideoCall,
      recordatorio_activo: !!taskData.reminderActive,
      recordatorio_minutos: taskData.reminderMinutes || 15,
      etiquetas: [],
    };

    try {
      const response = await apiClient.post<any>(ENDPOINTS.TAREAS.BASE, payload);
      const created = mapBackendTareaToTask(response.data);

      // Si tiene subtareas, guardarlas en el backend secuencialmente
      if (taskData.subtasks && taskData.subtasks.length > 0 && response.data.tarea_id) {
        for (const st of taskData.subtasks) {
          try {
            await apiClient.post(ENDPOINTS.SUBTAREAS.BASE, {
              tarea_id: response.data.tarea_id,
              titulo: st.title,
            });
          } catch {
            // Ignorar error en subtarea individual
          }
        }
        created.subtasks = taskData.subtasks;
      }

      const current = getLocalTasks();
      saveLocalTasks([created, ...current]);
      return created;
    } catch {
      const fallbackTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const current = getLocalTasks();
      saveLocalTasks([fallbackTask, ...current]);
      return fallbackTask;
    }
  },

  /**
   * Alterna el estado de una tarea (Completar / Revertir).
   * Llama a PATCH /api/tareas/:id/completar o PATCH /api/tareas/:id/estado
   */
  async toggleTaskCompletion(taskId: string): Promise<Task> {
    const current = getLocalTasks();
    const target = current.find(t => t.id === taskId);
    const newCompleted = target ? !target.completed : true;

    try {
      if (newCompleted) {
        // Marcar completada
        const response = await apiClient.patch<any>(ENDPOINTS.TAREAS.COMPLETAR(taskId));
        const updated = mapBackendTareaToTask(response.data);
        saveLocalTasks(current.map(t => (t.id === taskId ? updated : t)));
        return updated;
      } else {
        // Revertir a Pendiente
        const response = await apiClient.patch<any>(ENDPOINTS.TAREAS.ESTADO(taskId), {
          estado: 'Pendiente',
        });
        const updated = mapBackendTareaToTask(response.data);
        saveLocalTasks(current.map(t => (t.id === taskId ? updated : t)));
        return updated;
      }
    } catch {
      // Fallback local
      const updatedTask: Task = target
        ? {
            ...target,
            completed: !target.completed,
            completedAt: !target.completed
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          }
        : {
            id: taskId,
            title: 'Tarea',
            category: 'Trabajo',
            priority: 'Media',
            dueDate: 'Hoy',
            dueTime: '12:00',
            completed: true,
            subtasks: [],
          };

      saveLocalTasks(current.map(t => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    }
  },

  /**
   * Alterna el estado de una subtarea.
   * PATCH /api/subtareas/:id/toggle
   */
  async toggleSubtaskCompletion(taskId: string, subtaskId: string): Promise<void> {
    const current = getLocalTasks();
    const taskIndex = current.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const updatedSubtasks = current[taskIndex].subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      current[taskIndex] = { ...current[taskIndex], subtasks: updatedSubtasks };
      saveLocalTasks(current);
    }

    try {
      await apiClient.patch(ENDPOINTS.SUBTAREAS.TOGGLE(subtaskId));
    } catch {
      // Fallback silencioso
    }
  },

  /**
   * Elimina una tarea por ID.
   * DELETE /api/tareas/:id
   */
  async deleteTask(taskId: string): Promise<void> {
    const current = getLocalTasks();
    saveLocalTasks(current.filter(t => t.id !== taskId));

    try {
      await apiClient.delete(ENDPOINTS.TAREAS.BY_ID(taskId));
    } catch {
      // Fallback
    }
  },
};
