import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Project, PerformanceMetrics, User, Category, Tag } from '../types';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { metricsService } from '../services/metricsService';
import { authService, RegisterData } from '../services/authService';
import { catalogService } from '../services/catalogService';
import { initialMetrics, initialTasks, initialProjects } from '../data/mockData';

export type NavTab = 'hoy' | 'proyectos' | 'rendimiento';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  isTagModalOpen: boolean;
  setIsTagModalOpen: (open: boolean) => void;
  tasks: Task[];
  projects: Project[];
  metrics: PerformanceMetrics;
  categories: Category[];
  tags: Tag[];
  streak: number;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  login: (correo: string, pass: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (taskId: string, task: Partial<Task>) => Promise<Task>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (projectId: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  createTag: (nombre: string, color?: string) => Promise<Tag>;
  deleteTag: (id: number | string) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  // MOSTRAR EL MODAL DE INGRESAR O REGISTRAR AL CARGAR SI NO ESTÁ AUTENTICADO
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(!authService.isAuthenticated());
  const [activeTab, setActiveTab] = useState<NavTab>('hoy');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [streak, setStreak] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getMe();
        if (currentUser) setUser(currentUser);
      }

      const [loadedTasks, loadedProjects, loadedMetrics, loadedCats, loadedTags, userStreak] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
        metricsService.getWeeklyMetrics(),
        catalogService.getCategories(),
        catalogService.getTags(),
        taskService.getUserStreak(),
      ]);

      setTasks(loadedTasks.length > 0 ? loadedTasks : initialTasks);
      setProjects(loadedProjects.length > 0 ? loadedProjects : initialProjects);
      setMetrics(loadedMetrics);
      setCategories(loadedCats);
      setTags(loadedTags);
      setStreak(userStreak);
    } catch (err) {
      console.error('Error cargando datos de la app:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  const login = async (correo: string, pass: string) => {
    const res = await authService.login({ correo, password: pass });
    setUser(res.usuario);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    await loadAllData();
  };

  const register = async (data: RegisterData) => {
    const res = await authService.register(data);
    setUser(res.usuario);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    await loadAllData();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
    showToast('Sesión cerrada');
  };

  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const created = await taskService.createTask(taskData);
    setTasks(prev => [created, ...prev]);
    showToast('¡Tarea guardada exitosamente!');
    return created;
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    const updated = await taskService.updateTask(taskId, taskData);
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updated } : t)));
    showToast('Tarea actualizada');
    return updated;
  };

  const toggleTaskCompletion = async (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newCompleted = !t.completed;
          return {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return t;
      })
    );

    try {
      await taskService.toggleTaskCompletion(taskId);
      const newStreak = await taskService.getUserStreak();
      setStreak(newStreak);
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const toggleSubtaskCompletion = async (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );

    try {
      await taskService.toggleSubtaskCompletion(taskId, subtaskId);
    } catch (err) {
      console.error('Error toggling subtask:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    await taskService.deleteTask(taskId);
    showToast('Tarea eliminada');
  };

  const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    const created = await projectService.createProject(projectData);
    setProjects(prev => [...prev, created]);
    showToast('Proyecto creado');
    return created;
  };

  const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    const updated = await projectService.updateProject(projectId, projectData);
    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, ...updated } : p)));
    showToast('Proyecto actualizado');
    return updated;
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    await projectService.deleteProject(projectId);
    showToast('Proyecto eliminado');
  };

  const createTag = async (nombre: string, color?: string): Promise<Tag> => {
    const created = await catalogService.createTag(nombre, color);
    setTags(prev => [...prev, created]);
    showToast(`Etiqueta #${nombre} creada`);
    return created;
  };

  const deleteTag = async (id: number | string): Promise<void> => {
    setTags(prev => prev.filter(t => String(t.etiqueta_id) !== String(id)));
    await catalogService.deleteTag(id);
    showToast('Etiqueta eliminada');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeTab,
        setActiveTab,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        editingTask,
        setEditingTask,
        editingProject,
        setEditingProject,
        isTagModalOpen,
        setIsTagModalOpen,
        tasks,
        projects,
        metrics,
        categories,
        tags,
        streak,
        loading,
        searchQuery,
        setSearchQuery,
        login,
        register,
        logout,
        addTask,
        updateTask,
        toggleTaskCompletion,
        toggleSubtaskCompletion,
        deleteTask,
        createProject,
        updateProject,
        deleteProject,
        createTag,
        deleteTag,
        toastMessage,
        showToast,
        refreshData: loadAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
