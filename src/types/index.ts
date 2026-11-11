export type PriorityLevel = 'Baja' | 'Media' | 'Alta';

export interface User {
  usuario_id: number | string;
  rol_id?: number;
  nombre_usuario: string;
  nombre_completo: string;
  correo: string;
  zona_horaria?: string;
  racha_actual?: number;
  racha_maxima?: number;
  avatar_url?: string;
  estado?: string;
  fecha_creacion?: string;
}

export interface Subtask {
  id: string;
  subtarea_id?: number;
  title: string;
  completed: boolean;
}

export interface Attachment {
  name: string;
  size: string;
  type?: string;
  url?: string;
}

export interface Task {
  id: string;
  tarea_id?: number;
  title: string;
  description?: string;
  category: string;
  categoria_id?: number;
  priority: PriorityLevel;
  dueDate: string;
  dueTime: string;
  isVideoCall?: boolean;
  completed: boolean;
  completedAt?: string;
  completedOnTime?: boolean;
  reminderActive?: boolean;
  reminderMinutes?: number;
  reminderText?: string;
  subtasks: Subtask[];
  subtasksCount?: number;
  subtasksCompleted?: number;
  attachments?: Attachment[];
  projectId?: number | string;
  createdAt?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  proyecto_id?: number;
  title: string;
  description?: string;
  badgeText: string;
  badgeVariant: 'urgent' | 'progress' | 'personal' | 'finance' | 'learning' | 'default';
  activeTasksCount: number;
  completedTasksCount?: number;
  totalTasksCount?: number;
  progressPercentage: number;
  color: string;
  icon: 'palette' | 'code' | 'leaf' | 'creditCard' | 'book';
  members?: ProjectMember[];
  isIndividual?: boolean;
  footerNote?: string;
  footerStatus?: 'check' | 'time' | 'members' | 'single';
}

export interface Category {
  categoria_id: number;
  nombre: string;
  color?: string;
  icono?: string;
}

export interface Tag {
  etiqueta_id: number;
  nombre: string;
  color?: string;
}

export interface DailyProductivity {
  day: string;
  date?: string;
  count: number;
  isPeak?: boolean;
}

export interface CategoryMetric {
  name: string;
  tasksCount: number;
  percentage: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  badge: string;
  badgeColor?: string;
  description: string;
  icon: 'rocket' | 'target' | 'award';
  rightIcon: 'medal' | 'shield';
}

export interface PerformanceMetrics {
  completedCount: number;
  completedChange: string;
  successRate: number;
  focusHours: number;
  pomodoros: number;
  punctualityRate: number;
  punctualityOnTime: number;
  dailyProductivity: DailyProductivity[];
  categoryDistribution: CategoryMetric[];
  achievements: Achievement[];
}
