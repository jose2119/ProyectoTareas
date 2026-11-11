import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Project } from '../types';
import { initialProjects } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'taskflow_projects_data';

export const mapBackendProyectoToProject = (raw: any): Project => {
  const percent = Number(raw.porcentaje || 0);
  let badgeVariant: Project['badgeVariant'] = 'progress';
  let badgeText = 'EN CURSO';

  if (percent >= 80) {
    badgeVariant = 'finance';
    badgeText = 'Casi listo';
  } else if (percent > 60) {
    badgeVariant = 'urgent';
    badgeText = 'PRIORIDAD ALTA';
  } else if (raw.icono === 'leaf') {
    badgeVariant = 'personal';
    badgeText = 'PERSONAL';
  } else if (raw.icono === 'book') {
    badgeVariant = 'learning';
    badgeText = 'LECTURA';
  }

  return {
    id: String(raw.proyecto_id || raw.id),
    proyecto_id: raw.proyecto_id,
    title: raw.nombre || raw.title || 'Proyecto sin nombre',
    description: raw.descripcion,
    badgeText: raw.badgeText || badgeText,
    badgeVariant: (raw.badgeVariant || badgeVariant) as Project['badgeVariant'],
    activeTasksCount: Number(raw.tareas_activas ?? raw.activeTasksCount ?? 0),
    completedTasksCount: Number(raw.tareas_completadas ?? 0),
    totalTasksCount: Number(raw.tareas_totales ?? 0),
    progressPercentage: percent,
    color: raw.color || '#4f46e5',
    icon: (raw.icono || raw.icon || 'palette') as Project['icon'],
    members: raw.miembros?.map((m: any) => ({
      id: String(m.usuario_id),
      name: m.nombre_completo || m.nombre_usuario,
      avatar: m.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    })) || raw.members,
    isIndividual: raw.isIndividual ?? (!raw.miembros || raw.miembros.length <= 1),
    footerNote: raw.footerNote || `${raw.tareas_completadas || 0} de ${raw.tareas_totales || 0} tareas`,
    footerStatus: raw.footerStatus || (percent >= 80 ? 'check' : 'time'),
  };
};

const getLocalProjects = (): Project[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing local projects', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProjects));
  return initialProjects;
};

const saveLocalProjects = (projects: Project[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
};

export const projectService = {
  /**
   * Obtiene la lista de proyectos y colecciones del usuario.
   * GET /api/proyectos
   */
  async getProjects(): Promise<Project[]> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return getLocalProjects();
    }
    try {
      const response = await apiClient.get<any[]>(ENDPOINTS.PROYECTOS.BASE);
      const mapped = response.data.map(mapBackendProyectoToProject);
      saveLocalProjects(mapped);
      return mapped;
    } catch {
      return getLocalProjects();
    }
  },

  /**
   * Crea un nuevo proyecto en el backend.
   * POST /api/proyectos
   */
  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const payload = {
      nombre: projectData.title,
      descripcion: projectData.description || null,
      color: projectData.color || '#4f46e5',
      icono: projectData.icon || 'palette',
    };

    try {
      const response = await apiClient.post<any>(ENDPOINTS.PROYECTOS.BASE, payload);
      const created = mapBackendProyectoToProject(response.data);
      const current = getLocalProjects();
      saveLocalProjects([...current, created]);
      return created;
    } catch {
      const fallback: Project = {
        ...projectData,
        id: `p_${Date.now()}`,
      };
      const current = getLocalProjects();
      saveLocalProjects([...current, fallback]);
      return fallback;
    }
  },
};
