import { Task, Project, PerformanceMetrics } from '../types';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Revisión final de propuesta de diseño',
    description: 'Revisar prototipos de alta fidelidad y asegurar compatibilidad de componentes en Figma.',
    category: 'Trabajo',
    priority: 'Alta',
    dueDate: 'Hoy, 24 Oct',
    dueTime: '11:30 AM',
    completed: false,
    reminderActive: true,
    reminderText: '15 min antes de la hora fijada',
    subtasks: [
      { id: 's1', title: 'Revisar paleta de colores accesibles', completed: true },
      { id: 's2', title: 'Comprobar espaciados en mobile', completed: true },
      { id: 's3', title: 'Exportar assets en SVG', completed: true },
      { id: 's4', title: 'Subir entregable final a Drive', completed: false }
    ],
    attachments: [
      { name: 'Propuesta_Final_v3.fig', size: '24.5 MB' }
    ]
  },
  {
    id: '2',
    title: 'Comprar insumos para oficina',
    description: 'Comprar libretas ecológicas, café en grano y cargadores USB-C para el equipo.',
    category: 'Personal',
    priority: 'Media',
    dueDate: 'Hoy, 24 Oct',
    dueTime: '02:00 PM',
    completed: false,
    reminderActive: false,
    subtasks: [
      { id: 's5', title: 'Lista de insumos requeridos', completed: true },
      { id: 's6', title: 'Comparar precios en proveedor local', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Llamada de sincronización con el equipo frontend',
    description: 'Sprint planning y revisión de componentes React + Tailwind del nuevo dashboard.',
    category: 'Sprint Q4',
    priority: 'Alta',
    dueDate: 'Hoy, 24 Oct',
    dueTime: '04:15 PM',
    isVideoCall: true,
    completed: false,
    reminderActive: true,
    reminderText: '10 min antes de la llamada',
    subtasks: [
      { id: 's7', title: 'Preparar notas de la reunión', completed: true },
      { id: 's8', title: 'Compartir enlace de Google Meet', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Enviar reporte semanal a gerencia',
    description: 'Resumen ejecutivo de entregables y métricas de avance semanal.',
    category: 'Trabajo',
    priority: 'Alta',
    dueDate: 'Hoy, 24 Oct',
    dueTime: '09:00 AM',
    completed: true,
    completedAt: '09:15 AM',
    subtasks: [
      { id: 's9', title: 'Recopilar métricas del dashboard', completed: true },
      { id: 's10', title: 'Exportar PDF y enviar correo', completed: true }
    ]
  },
  {
    id: '5',
    title: 'Rutina matutina de meditación',
    description: 'Sesión de 15 minutos de respiración y mindfulness.',
    category: 'Bienestar',
    priority: 'Baja',
    dueDate: 'Hoy, 24 Oct',
    dueTime: '07:30 AM',
    completed: true,
    completedAt: '07:30 AM',
    subtasks: [
      { id: 's11', title: 'Sesión de respiración guiada', completed: true }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Diseño de Product...',
    badgeText: 'PRIORIDAD ALTA',
    badgeVariant: 'urgent',
    activeTasksCount: 12,
    progressPercentage: 75,
    color: '#6366f1',
    icon: 'palette',
    members: [
      { id: 'm1', name: 'Ana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { id: 'm2', name: 'Carlos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { id: 'm3', name: 'Laura', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ],
    footerStatus: 'members'
  },
  {
    id: 'p2',
    title: 'Desarrollo Web & API',
    badgeText: 'EN CURSO',
    badgeVariant: 'progress',
    activeTasksCount: 8,
    progressPercentage: 50,
    color: '#3b82f6',
    icon: 'code',
    members: [
      { id: 'm4', name: 'David', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { id: 'm5', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' }
    ],
    footerStatus: 'members'
  },
  {
    id: 'p3',
    title: 'Vida Personal & Biene...',
    badgeText: 'PERSONAL',
    badgeVariant: 'personal',
    activeTasksCount: 5,
    progressPercentage: 40,
    color: '#10b981',
    icon: 'leaf',
    isIndividual: true,
    footerNote: 'Proyecto individual',
    footerStatus: 'single'
  },
  {
    id: 'p4',
    title: 'Finanzas & Fact...',
    badgeText: 'Vence en 2 días',
    badgeVariant: 'finance',
    activeTasksCount: 3,
    progressPercentage: 90,
    color: '#be123c',
    icon: 'creditCard',
    footerNote: 'Cierre mensual listo',
    footerStatus: 'check'
  },
  {
    id: 'p5',
    title: 'Aprendizaje & Libros',
    badgeText: 'LECTURA',
    badgeVariant: 'learning',
    activeTasksCount: 4,
    progressPercentage: 25,
    color: '#8b5cf6',
    icon: 'book',
    footerNote: 'Último repaso ayer',
    footerStatus: 'time'
  }
];

export const initialMetrics: PerformanceMetrics = {
  completedCount: 38,
  completedChange: '+12% vs prev.',
  successRate: 92,
  focusHours: 18.5,
  pomodoros: 37,
  punctualityRate: 95,
  punctualityOnTime: 36,
  dailyProductivity: [
    { day: 'Lun', count: 5 },
    { day: 'Mar', count: 8, isPeak: true },
    { day: 'Mié', count: 6 },
    { day: 'Jue', count: 7 },
    { day: 'Vie', count: 6 },
    { day: 'Sáb', count: 4 },
    { day: 'Dom', count: 2 }
  ],
  categoryDistribution: [
    { name: 'Trabajo', tasksCount: 21, percentage: 55, color: '#4f46e5' },
    { name: 'Personal', tasksCount: 10, percentage: 25, color: '#059669' },
    { name: 'Estudio', tasksCount: 7, percentage: 20, color: '#be123c' }
  ],
  achievements: [
    {
      id: 'a1',
      title: 'Enfoque Láser',
      badge: 'NUEVO',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      description: '5 tareas complejas terminadas en 1 día',
      icon: 'rocket',
      rightIcon: 'medal'
    },
    {
      id: 'a2',
      title: 'Puntualidad Máxima',
      badge: 'SEMANA',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      description: 'Cero tareas vencidas durante los últimos 7 días',
      icon: 'target',
      rightIcon: 'shield'
    }
  ]
};
