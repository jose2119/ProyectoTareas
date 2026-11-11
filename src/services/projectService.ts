import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Project } from '../types';
import { initialProjects } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'taskflow_projects_data';

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
   * Obtiene la lista de proyectos y colecciones.
   * Llama a GET /api/projects
   */
  async getProjects(): Promise<Project[]> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return getLocalProjects();
    }
    try {
      const response = await apiClient.get<Project[]>(ENDPOINTS.PROJECTS);
      saveLocalProjects(response.data);
      return response.data;
    } catch {
      return getLocalProjects();
    }
  },

  /**
   * Crea un nuevo proyecto.
   * Llama a POST /api/projects
   */
  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      ...projectData,
      id: `p_${Date.now()}`
    };

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const current = getLocalProjects();
      const updated = [...current, newProject];
      saveLocalProjects(updated);
      return newProject;
    }

    try {
      const response = await apiClient.post<Project>(ENDPOINTS.PROJECTS, projectData);
      const current = getLocalProjects();
      saveLocalProjects([...current, response.data]);
      return response.data;
    } catch {
      const current = getLocalProjects();
      const updated = [...current, newProject];
      saveLocalProjects(updated);
      return newProject;
    }
  }
};

