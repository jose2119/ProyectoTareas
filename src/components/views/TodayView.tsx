import React, { useState } from 'react';
import { Flame, Clock, Video, MoreVertical, ChevronDown, ChevronUp, Check, ArrowUp, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';

export const TodayView: React.FC = () => {
  const { tasks, toggleTaskCompletion, addTask, deleteTask, searchQuery } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [activeFilter, setActiveFilter] = useState<string>('Todas');
  const [isCompletedOpen, setIsCompletedOpen] = useState<boolean>(true);
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Días de la semana para el selector horizontal
  const weekDays = [
    { day: 'L', num: 23 },
    { day: 'M', num: 24 },
    { day: 'M', num: 25 },
    { day: 'J', num: 26 },
    { day: 'V', num: 27 },
    { day: 'S', num: 28 },
    { day: 'D', num: 29 },
  ];

  // Filtros disponibles
  const filterOptions = [
    { id: 'Todas', label: `Todas (${tasks.length})` },
    { id: 'Prioritarias', label: `Prioritarias (${tasks.filter(t => t.priority === 'Alta').length})` },
    { id: 'Trabajo', label: `Trabajo (${tasks.filter(t => t.category === 'Trabajo').length})` },
    { id: 'Personal', label: `Personal (${tasks.filter(t => t.category === 'Personal').length})` },
  ];

  // Filtrado de tareas
  const filteredTasks = tasks.filter(task => {
    // Search query
    if (searchQuery) {
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }

    // Filter chip
    if (activeFilter === 'Prioritarias') return task.priority === 'Alta';
    if (activeFilter === 'Trabajo') return task.category === 'Trabajo';
    if (activeFilter === 'Personal') return task.category === 'Personal';
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  // Métricas dinámicas para la tarjeta de progreso
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
    <div className="pb-32 px-5 pt-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* 1. Saludo y Racha */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Hola, Camila <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Martes, 24 de Octubre</p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-100/80 rounded-full text-indigo-700 text-xs font-semibold shadow-xs">
          <Flame className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
          <span>4 días racha</span>
        </div>
      </div>

      {/* 2. Selector de Días Semanal */}
      <div className="grid grid-cols-7 gap-2 bg-white/70 p-1.5 rounded-2xl border border-slate-100 shadow-xs">
        {weekDays.map(item => {
          const isSelected = item.num === selectedDay;
          return (
            <button
              key={item.num}
              onClick={() => setSelectedDay(item.num)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300 font-semibold ring-2 ring-indigo-400/30'
                  : 'text-slate-500 hover:bg-slate-100 font-medium'
              }`}
            >
              <span className={`text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className="text-sm font-bold mt-0.5">{item.num}</span>
              {isSelected && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1"></span>}
            </button>
          );
        })}
      </div>

      {/* 3. Tarjeta: Progreso de Hoy */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/20 to-white border border-indigo-100/70 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
              PROGRESO DE HOY
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {progressPercent}% completado
            </h3>
            <p className="text-xs text-slate-500">
              {completedCount} de {totalTasks} tareas listas para hoy
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100/60">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                {remainingCount > 0 ? `¡Gran ritmo, solo faltan ${remainingCount}!` : '¡Increíble, todo terminado! 🎉'}
              </span>
            </div>
          </div>

          <CircularProgress percentage={progressPercent} size={76} />
        </div>
      </div>

      {/* 4. Filtros tipo píldora */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map(chip => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === chip.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50/70 text-slate-600 hover:bg-indigo-100/60'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 5. Sección: Vencen pronto */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <h4 className="text-sm font-bold text-slate-800">Vencen pronto</h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">{pendingTasks.length} pendientes</span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">¡No tienes tareas pendientes aquí!</p>
            <p className="text-xs text-slate-400 mt-1">Crea una nueva tarea con el botón + o el campo rápido.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingTasks.map(task => {
              const completedSubtasks = task.subtasks.filter(s => s.completed).length;
              const hasSubtasks = task.subtasks.length > 0;
              const subtaskProgress = hasSubtasks ? (completedSubtasks / task.subtasks.length) * 100 : 0;

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-indigo-200 transition-all relative group"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-lg border-2 border-indigo-200 hover:border-indigo-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label="Completar tarea"
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-sm font-semibold text-slate-800 leading-snug">
                          {task.title}
                        </h5>

                        {/* Menu dots */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 -mr-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuTaskId === task.id && (
                            <div className="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 text-xs animate-in fade-in duration-150">
                              <button
                                onClick={() => {
                                  toggleTaskCompletion(task.id);
                                  setActiveMenuTaskId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                              >
                                Completar
                              </button>
                              <button
                                onClick={() => {
                                  deleteTask(task.id);
                                  setActiveMenuTaskId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badges & Time */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          {task.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            task.priority === 'Alta'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : task.priority === 'Media'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 ml-auto">
                          {task.isVideoCall ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-slate-600 font-semibold">{task.dueTime}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{task.dueTime}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Subtask progress if exists */}
                      {hasSubtasks && (
                        <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <span className="text-slate-400">⚡</span>
                            <span>
                              {completedSubtasks}/{task.subtasks.length} subtareas
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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

      {/* 6. Sección: Completadas hoy (Acordeón) */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 pt-1">
          <button
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h4 className="text-sm font-bold text-slate-800">Completadas hoy</h4>
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
                  className="bg-white/80 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center cursor-pointer shrink-0"
                      aria-label="Desmarcar tarea"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500 line-through truncate">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Completada {task.completedAt ? `a las ${task.completedAt}` : ''} · {task.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-emerald-500 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Input Rápido de Tarea Inferior */}
      <form onSubmit={handleQuickSubmit} className="pt-2">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 pl-4 shadow-sm flex items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <span className="text-indigo-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Escribe una tarea rápida..."
            className="flex-1 bg-transparent border-none text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="w-8 h-8 rounded-xl bg-indigo-600 disabled:bg-slate-200 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed hover:bg-indigo-700"
            aria-label="Agregar tarea rápida"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
