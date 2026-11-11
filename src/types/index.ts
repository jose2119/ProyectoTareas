export type PriorityLevel = 'Baja' | 'Media' | 'Alta';

export interface Subtask {
  id: string;
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
  title: string;
  description?: string;
  category: string; // e.g. "Trabajo", "Personal", "Sprint Q4", "UX Design", "Finanzas"
  priority: PriorityLevel;
  dueDate: string; // e.g. "Hoy, 24 Oct" or "2026-10-24"
  dueTime: string; // e.g. "11:30 AM"
  isVideoCall?: boolean;
  completed: boolean;
  completedAt?: string; // e.g. "09:15 AM"
  reminderActive?: boolean;
  reminderText?: string;
  subtasks: Subtask[];
  attachments?: Attachment[];
  createdAt?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant: 'urgent' | 'progress' | 'personal' | 'finance' | 'learning' | 'default';
  activeTasksCount: number;
  progressPercentage: number;
  color: string; // hex or tailwind class
  icon: 'palette' | 'code' | 'leaf' | 'creditCard' | 'book';
  members?: ProjectMember[];
  isIndividual?: boolean;
  footerNote?: string;
  footerStatus?: 'check' | 'time' | 'members' | 'single';
}

export interface DailyProductivity {
  day: string; // "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
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
  badge: string; // "NUEVO", "SEMANA"
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

