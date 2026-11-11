import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Task, Subtask } from '../types';
import { initialTasks } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'taskflow_tasks_data';

// Helper de persistencia local para desarrollo sin backend
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
   * Obtiene la lista completa de tareas.
   * Llama a GET /api/tasks si el backend está activo; si falla o VITE_USE_MOCK=true usa almacenamiento local.
   */
  async getTasks(): Promise<Task[]> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return getLocalTasks();
    }
    try {
      const response = await apiClient.get<Task[]>(ENDPOINTS.TASKS);
      saveLocalTasks(response.data);
      return response.data;
    } catch {
      return getLocalTasks();
    }
  },

  /**
   * Crea una nueva tarea.
   * Llama a POST /api/tasks
   */
  async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const current = getLocalTasks();
      const updated = [newTask, ...current];
      saveLocalTasks(updated);
      return newTask;
    }

    try {
      const response = await apiClient.post<Task>(ENDPOINTS.TASKS, taskData);
      const current = getLocalTasks();
      saveLocalTasks([response.data, ...current]);
      return response.data;
    } catch {
      const current = getLocalTasks();
      const updated = [newTask, ...current];
      saveLocalTasks(updated);
      return newTask;
    }
  },

  /**
   * Alterna el estado completado de una tarea.
   * Llama a PATCH/PUT /api/tasks/:id/toggle
   */
  async toggleTaskCompletion(taskId: string): Promise<Task> {
    const current = getLocalTasks();
    const target = current.find(t => t.id === taskId);
    if (!target) throw new Error('Tarea no encontrada');

    const updatedTask: Task = {
      ...target,
      completed: !target.completed,
      completedAt: !target.completed
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : undefined
    };

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      saveLocalTasks(current.map(t => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    }

    try {
      const response = await apiClient.patch<Task>(ENDPOINTS.TOGGLE_TASK(taskId), {
        completed: updatedTask.completed,
        completedAt: updatedTask.completedAt
      });
      saveLocalTasks(current.map(t => (t.id === taskId ? response.data : t)));
      return response.data;
    } catch {
      saveLocalTasks(current.map(t => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    }
  },

  /**
   * Alterna el estado completado de una subtarea.
   */
  async toggleSubtaskCompletion(taskId: string, subtaskId: string): Promise<Task> {
    const current = getLocalTasks();
    const taskIndex = current.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Tarea no encontrada');

    const updatedSubtasks: Subtask[] = current[taskIndex].subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const updatedTask: Task = {
      ...current[taskIndex],
      subtasks: updatedSubtasks
    };

    const newTasks = [...current];
    newTasks[taskIndex] = updatedTask;
    saveLocalTasks(newTasks);

    if (import.meta.env.VITE_USE_MOCK !== 'true') {
      try {
        await apiClient.patch(ENDPOINTS.TOGGLE_SUBTASK(taskId, subtaskId), {
          completed: updatedSubtasks.find(s => s.id === subtaskId)?.completed
        });
      } catch {
        // Fallback silently
      }
    }

    return updatedTask;
  },

  /**
   * Elimina una tarea por su id.
   */
  async deleteTask(taskId: string): Promise<void> {
    const current = getLocalTasks();
    saveLocalTasks(current.filter(t => t.id !== taskId));

    if (import.meta.env.VITE_USE_MOCK !== 'true') {
      try {
        await apiClient.delete(ENDPOINTS.TASK_BY_ID(taskId));
      } catch {
        // Fallback
      }
    }
  }
};

