import React, { useState } from 'react';
import { Flame, Clock, Video, MoreVertical, ChevronDown, ChevronUp, Check, ArrowUp, Zap, Sparkles, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';

export const TodayView: React.FC = () => {
  const { tasks, toggleTaskCompletion, addTask, deleteTask, searchQuery, user, streak } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const [isCompletedOpen, setIsCompletedOpen] = useState<boolean>(true);
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Días de la semana para el selector
  const weekDays = [
    { day: 'Lun', num: 23, full: 'Lunes' },
    { day: 'Mar', num: 24, full: 'Martes' },
    { day: 'Mié', num: 25, full: 'Miércoles' },
    { day: 'Jue', num: 26, full: 'Jueves' },
    { day: 'Vie', num: 27, full: 'Viernes' },
    { day: 'Sáb', num: 28, full: 'Sábado' },
    { day: 'Dom', num: 29, full: 'Domingo' },
  ];

  const filterOptions = [
    { id: 'Todas', label: `Todas (${tasks.length})` },
    { id: 'Prioritarias', label: `Prioritarias (${tasks.filter(t => t.priority === 'Alta').length})` },
    { id: 'Trabajo', label: `Trabajo (${tasks.filter(t => t.category === 'Trabajo').length})` },
    { id: 'Personal', label: `Personal (${tasks.filter(t => t.category === 'Personal').length})` },
  ];

  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }
    if (activeFilter === 'Prioritarias') return task.priority === 'Alta';
    if (activeFilter === 'Trabajo') return task.category === 'Trabajo';
    if (activeFilter === 'Personal') return task.category === 'Personal';
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const remainingCount = totalTasks - completedCount;

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    await addTask({
      title: quickTitle.trim(),
      category: 'Trabajo',
      priority: 'Media',
      dueDate: 'Hoy, 24 Oct',
      dueTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: false,
      subtasks: []
    });

    setQuickTitle('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Web Banner: Saludo + Calendario Semanal */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Hola, {user ? user.nombre_completo.split(' ')[0] : 'Camila'} <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
            </h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-amber-700 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{streak} días racha</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span>Martes, 24 de Octubre · Tienes {pendingTasks.length} tareas pendientes para hoy</span>
          </p>
        </div>

        {/* Selector de Días Semanal Horizontal */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 w-full lg:w-auto">
          {weekDays.map(item => {
            const isSelected = item.num === selectedDay;
            return (
              <button
                key={item.num}
                onClick={() => setSelectedDay(item.num)}
                className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-4 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/50 font-bold ring-2 ring-indigo-400/30'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 font-semibold'
                }`}
              >
                <span className={`text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {item.day}
                </span>
                <span className="text-sm sm:text-base font-extrabold mt-0.5">{item.num}</span>
                {isSelected && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Grid Principal Responsivo: Tareas (Izquierda) + Estadísticas (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Principal: Contenido y Tareas (8 columnas en desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Formulario de Entrada Rápida de Tarea */}
          <form onSubmit={handleQuickSubmit} className="relative">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 pl-4 shadow-xs flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <span className="text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Escribe una nueva tarea y presiona Enter..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!quickTitle.trim()}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 disabled:bg-slate-200 text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed hover:bg-indigo-700"
              >
                <span>Añadir</span>
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Filtros tipo píldora */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filterOptions.map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === chip.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-semibold hidden sm:inline-block">
              Mostrando {filteredTasks.length} de {tasks.length} tareas
            </span>
          </div>

          {/* Sección: Vencen pronto */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Vencen pronto</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                  {pendingTasks.length} pendientes
                </span>
              </div>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
                <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-800">¡Todo al día en esta vista!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No tienes tareas pendientes aquí. Puedes agregar una con el campo de arriba o el botón "+ Nueva Tarea".
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map(task => {
                  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
                  const hasSubtasks = task.subtasks.length > 0;
                  const subtaskProgress = hasSubtasks ? (completedSubtasks / task.subtasks.length) * 100 : 0;

                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all relative group"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5 w-5 h-5 rounded-lg border-2 border-indigo-200 hover:border-indigo-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          aria-label="Completar tarea"
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                        </button>

                        {/* Contenido de la tarea */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            {/* Opciones */}
                            <div className="relative shrink-0">
                              <button
                                onClick={() => setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeMenuTaskId === task.id && (
                                <div className="absolute right-0 top-7 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs animate-in fade-in duration-150">
                                  <button
                                    onClick={() => {
                                      toggleTaskCompletion(task.id);
                                      setActiveMenuTaskId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                                  >
                                    Marcar completada
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteTask(task.id);
                                      setActiveMenuTaskId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-rose-50 text-rose-600 font-medium"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Metadatos: Tags, Prioridad y Horario */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              {task.category}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                                task.priority === 'Alta'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : task.priority === 'Media'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}
                            >
                              {task.priority}
                            </span>

                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 sm:ml-auto">
                              {task.isVideoCall ? (
                                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                  <Video className="w-3.5 h-3.5" />
                                  <span>{task.dueTime}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{task.dueTime}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Subtareas Progress Bar */}
                          {hasSubtasks && (
                            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="text-slate-400">⚡</span>
                                <span>
                                  {completedSubtasks}/{task.subtasks.length} subtareas
                                </span>
                              </div>
                              <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                  style={{ width: `${subtaskProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sección: Completadas hoy */}
          {completedTasks.length > 0 && (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                className="w-full flex items-center justify-between text-left group cursor-pointer bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-sm font-extrabold text-slate-800">Completadas hoy</h3>
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                    {completedTasks.length}
                  </span>
                </div>
                {isCompletedOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                )}
              </button>

              {isCompletedOpen && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-white/90 rounded-2xl p-4 border border-slate-200/70 flex items-center justify-between gap-4 shadow-2xs hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center cursor-pointer shrink-0"
                          aria-label="Desmarcar tarea"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-500 line-through truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Completada {task.completedAt ? `a las ${task.completedAt}` : ''} · {task.category}
                          </p>
                        </div>
                      </div>

                      <span className="text-emerald-500 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Lateral Web: Progreso y Widgets de Resumen (4 columnas en desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tarjeta: Progreso de Hoy */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                PROGRESO DE HOY
              </span>
              <span className="text-xs font-semibold text-slate-400">Objetivo diario</span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {progressPercent}%
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {completedCount} de {totalTasks} tareas listas para hoy
                </p>
              </div>
              <CircularProgress percentage={progressPercent} size={84} strokeWidth={7} />
            </div>

            {/* Motivational Pill */}
            <div className="pt-1">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                <span>
                  {remainingCount > 0 ? `¡Gran ritmo, solo faltan ${remainingCount}!` : '¡Increíble, todo completado hoy! 🎉'}
                </span>
              </div>
            </div>
          </div>

          {/* Widget: Próximas Reuniones o Tareas con Video */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900">Llamadas del día</h4>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                En vivo
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-800 truncate">
                  Llamada de sincronización frontend
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">04:15 PM · Sprint Q4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
