import React, { useState } from 'react';
import { Briefcase, Palette, CreditCard, User, Calendar, Clock, Plus, X, Bell, Paperclip, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel, Subtask } from '../../types';

interface NewTaskViewProps {
  onClose?: () => void;
}

export const NewTaskView: React.FC<NewTaskViewProps> = ({ onClose }) => {
  const { addTask, setIsNewTaskModalOpen, setActiveTab, categories: appCategories } = useApp();

  const [title, setTitle] = useState('Preparar presentación para inversores');
  const [description, setDescription] = useState(
    'Enfocarse en el crecimiento MoM del último trimestre, métricas de retención de cohortes y la proyección del runway.'
  );
  const [category, setCategory] = useState('Trabajo');
  const [categoriaId, setCategoriaId] = useState<number>(1);
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

  const displayCategories = appCategories.length > 0
    ? appCategories.map(c => ({
        id: c.nombre,
        categoria_id: c.categoria_id,
        label: c.nombre,
        icon: c.nombre === 'Trabajo' ? Briefcase : c.nombre === 'UX Design' ? Palette : c.nombre === 'Finanzas' ? CreditCard : User,
      }))
    : [
        { id: 'Trabajo', categoria_id: 1, label: 'Trabajo', icon: Briefcase },
        { id: 'UX Design', categoria_id: 2, label: 'UX Design', icon: Palette },
        { id: 'Finanzas', categoria_id: 3, label: 'Finanzas', icon: CreditCard },
        { id: 'Personal', categoria_id: 4, label: 'Personal', icon: User },
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
      categoria_id: categoriaId,
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Nueva Tarea</h3>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                NUEVA ENTRADA
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columnas Web Responsive */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Título, Descripción, Categoría y Subtareas (7 columnas) */}
            <div className="md:col-span-7 space-y-5">
              {/* Título & Descripción */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Información Principal
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título de la tarea..."
                  className="w-full text-base sm:text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Descripción detallada de la tarea..."
                  className="w-full text-xs text-slate-600 leading-relaxed placeholder-slate-400 focus:outline-none resize-none bg-transparent pt-1 border-t border-slate-200/60"
                />
              </div>

              {/* Categoría / Proyecto */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Categoría / Proyecto</label>
                  <span className="text-[11px] font-medium text-indigo-600">4 disponibles</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {displayCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          setCategoriaId(cat.categoria_id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtareas */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>Subtareas</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                    {completedSubtasksCount} de {subtasks.length} listas
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${subtasksProgress}%` }}
                  ></div>
                </div>

                {/* Lista de subtareas */}
                <div className="space-y-2 pt-1">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
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

                {/* Input para nueva subtarea */}
                {isAddingSubtask ? (
                  <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      autoFocus
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Escribe la subtarea..."
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir subtarea</span>
                  </button>
                )}
              </div>
            </div>

            {/* Columna Derecha: Fecha, Hora, Prioridad, Recordatorio y Adjuntos (5 columnas) */}
            <div className="md:col-span-5 space-y-4">
              {/* Fecha y Hora de Entrega */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Entrega</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">FECHA</span>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">HORA</span>
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
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                  {(['Baja', 'Media', 'Alta'] as PriorityLevel[]).map((level) => {
                    const isSelected = priority === level;
                    const dotColor =
                      level === 'Alta' ? 'bg-rose-500' : level === 'Media' ? 'bg-amber-500' : 'bg-emerald-500';

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriority(level)}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

              {/* Recordatorio Activo */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Recordatorio activo</h5>
                    <p className="text-[10px] text-slate-400">15 min antes de la hora fijada</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderActive}
                    onChange={() => setReminderActive(!reminderActive)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Archivos adjuntos */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      ARCHIVOS ADJUNTOS
                    </span>
                    <p className="text-xs font-bold text-slate-800 truncate">Pitch_Deck_Draft_v2.key (14.2 MB)</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Guardar Tarea</span>
          </button>
        </div>
      </div>
    </div>
  );
};
