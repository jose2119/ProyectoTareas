import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Briefcase, Palette, CreditCard, User, Calendar, Clock, Plus, X, Bell, Paperclip, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel, Subtask } from '../../types';

interface NewTaskViewProps {
  onClose?: () => void;
}

export const NewTaskView: React.FC<NewTaskViewProps> = ({ onClose }) => {
  const { addTask, setIsNewTaskModalOpen, setActiveTab } = useApp();

  const [title, setTitle] = useState('Preparar presentación para inversores');
  const [description, setDescription] = useState(
    'Enfocarse en el crecimiento MoM del último trimestre, métricas de retención de cohortes y la proyección del runway.'
  );
  const [category, setCategory] = useState('Trabajo');
  const [priority, setPriority] = useState<PriorityLevel>('Alta');
  const [date, setDate] = useState('Hoy, 24 Oct');
  const [time, setTime] = useState('03:30 PM');
  const [reminderActive, setReminderActive] = useState(true);

  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: '1', title: 'Revisar datos de métricas clave', completed: true },
    { id: '2', title: 'Diseñar diapositiva de roadmap', completed: true },
    { id: '3', title: 'Exportar en PDF de alta resolución', completed: false }
  ]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const categories = [
    { id: 'Trabajo', label: 'Trabajo', icon: Briefcase },
    { id: 'UX Design', label: 'UX Design', icon: Palette },
    { id: 'Finanzas', label: 'Finanzas', icon: CreditCard },
    { id: 'Personal', label: 'Personal', icon: User },
  ];

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsNewTaskModalOpen(false);
      setActiveTab('hoy');
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setSubtasks([
      ...subtasks,
      {
        id: Date.now().toString(),
        title: newSubtaskTitle.trim(),
        completed: false
      }
    ]);
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const completedSubtasksCount = subtasks.filter(s => s.completed).length;
  const subtasksProgress = subtasks.length > 0 ? (completedSubtasksCount / subtasks.length) * 100 : 0;

  const handleSave = async () => {
    if (!title.trim()) return;

    await addTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: date,
      dueTime: time,
      reminderActive,
      reminderText: reminderActive ? '15 min antes de la hora fijada' : undefined,
      completed: false,
      subtasks,
      attachments: [
        { name: 'Pitch_Deck_Draft_v2.key', size: '14.2 MB' }
      ]
    });

    handleClose();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28">
      {/* Header específico de Nueva Tarea */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Nueva Tarea</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <MoreVertical className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Camila"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
          />
        </div>
      </header>

      {/* Form Content */}
      <div className="px-5 pt-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
        {/* Badge: Nueva Entrada */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold tracking-wide uppercase">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            NUEVA ENTRADA
          </span>
        </div>

        {/* Título y Descripción */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la tarea..."
            className="w-full text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none border-b border-transparent focus:border-indigo-100 pb-1"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descripción detallada..."
            className="w-full text-xs text-slate-600 leading-relaxed placeholder-slate-400 focus:outline-none resize-none pt-1"
          />
        </div>

        {/* Categoría / Proyecto */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Categoría / Proyecto</label>
            <span className="text-[11px] font-medium text-indigo-600">4 disponibles</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fecha y Hora de Entrega */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Fecha y Hora de Entrega</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Fecha */}
            <div className="bg-indigo-50/50 hover:bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FECHA</span>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Hora */}
            <div className="bg-indigo-50/50 hover:bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HORA</span>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de Prioridad */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Nivel de Prioridad</label>
          <div className="grid grid-cols-3 gap-2 bg-white/70 p-1.5 rounded-2xl border border-slate-100">
            {(['Baja', 'Media', 'Alta'] as PriorityLevel[]).map((level) => {
              const isSelected = priority === level;
              const dotColor =
                level === 'Alta' ? 'bg-rose-500' : level === 'Media' ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-xs border border-slate-200 text-slate-900 ring-2 ring-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  <span>{level}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtareas */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </span>
              <h4 className="text-xs font-bold text-slate-800">Subtareas</h4>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
              {completedSubtasksCount} de {subtasks.length} listas
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${subtasksProgress}%` }}
            ></div>
          </div>

          {/* Subtasks items */}
          <div className="space-y-2 pt-1">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleSubtask(subtask.id)}
                    className={`w-4 h-4 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                      subtask.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {subtask.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span
                    className={`text-xs truncate ${
                      subtask.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Eliminar subtarea"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Input / Button */}
          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                autoFocus
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Escribe la subtarea..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubtask(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSubtask(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir subtarea</span>
            </button>
          )}
        </div>

        {/* Recordatorio */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">Recordatorio activo</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">15 min antes de la hora fijada</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reminderActive}
              onChange={() => setReminderActive(!reminderActive)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Archivos adjuntos */}
        <div className="bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
              <Paperclip className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ARCHIVOS ADJUNTOS
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">Pitch_Deck_Draft_v2.key (14.2 MB)</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Action Buttons Footer */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Guardar Tarea</span>
          </button>
        </div>
      </div>
    </div>
  );
};

