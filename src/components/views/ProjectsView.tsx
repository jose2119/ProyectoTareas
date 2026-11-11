import React, { useState } from 'react';
import { SlidersHorizontal, Folder, Palette, Code, Leaf, CreditCard, BookOpen, MoreVertical, Plus, Check, Clock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { projects, createProject, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'palette' | 'code' | 'leaf' | 'creditCard' | 'book'>('palette');

  const tags = [
    { name: '#urgente', dotColor: 'bg-rose-500' },
    { name: '#reunión', dotColor: 'bg-indigo-600' },
    { name: '#bug', dotColor: 'bg-rose-700' },
    { name: '#diseño', dotColor: 'bg-emerald-500' },
    { name: '#compras', dotColor: 'bg-indigo-400' },
  ];

  const renderIcon = (type: Project['icon']) => {
    switch (type) {
      case 'palette':
        return <Palette className="w-5 h-5 text-indigo-600" />;
      case 'code':
        return <Code className="w-5 h-5 text-blue-600" />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'creditCard':
        return <CreditCard className="w-5 h-5 text-rose-600" />;
      case 'book':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return <Folder className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getIconBg = (type: Project['icon']) => {
    switch (type) {
      case 'palette':
        return 'bg-indigo-50 border-indigo-100';
      case 'code':
        return 'bg-blue-50 border-blue-100';
      case 'leaf':
        return 'bg-emerald-50 border-emerald-100';
      case 'creditCard':
        return 'bg-rose-50 border-rose-100';
      case 'book':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  const getBadgeStyle = (variant: Project['badgeVariant']) => {
    switch (variant) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'progress':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'personal':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'finance':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'learning':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPending = projects.reduce((acc, p) => acc + p.activeTasksCount, 0);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createProject({
      title: newTitle.trim(),
      badgeText: 'EN CURSO',
      badgeVariant: 'progress',
      activeTasksCount: 1,
      progressPercentage: 10,
      color: '#4f46e5',
      icon: newCategory,
      isIndividual: true,
      footerNote: 'Proyecto recién creado',
      footerStatus: 'single'
    });

    setNewTitle('');
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="pb-32 px-5 pt-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* 1. Buscador y Filtro */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proyectos o etiquetas..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <button
          onClick={() => showToast('Filtro de proyectos activado')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer"
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Banner de Espacios Activos */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-indigo-50/50 to-blue-50/80 border border-indigo-100 rounded-3xl p-4 flex items-center justify-between shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <h3 className="text-sm font-extrabold text-slate-900">
              {projects.length} Espacios Activos
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-4">
            {totalPending} tareas pendientes en total
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
          <Folder className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* 3. Tus Colecciones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900">Tus Colecciones</h4>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            ORGANIZADO
          </span>
        </div>

        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-indigo-200 transition-all space-y-3"
            >
              {/* Header card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${getIconBg(project.icon)}`}>
                    {renderIcon(project.icon)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 leading-tight">
                      {project.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {project.activeTasksCount} tareas activas
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(project.badgeVariant)}`}>
                  {project.badgeText}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Progreso</span>
                  <span className="font-bold text-slate-700">{project.progressPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progressPercentage}%`,
                      backgroundColor: project.color
                    }}
                  ></div>
                </div>
              </div>

              {/* Footer card */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                {project.members && project.members.length > 0 ? (
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {project.members.map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar}
                        alt={m.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                ) : project.isIndividual ? (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.footerNote || 'Proyecto individual'}</span>
                  </div>
                ) : project.footerStatus === 'check' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{project.footerNote}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.footerNote}</span>
                  </div>
                )}

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Botón: + Crear nuevo proyecto */}
      <button
        onClick={() => setIsNewProjectModalOpen(true)}
        className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] border border-dashed border-indigo-300 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs shadow-xs transition-all cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <span>Crear nuevo proyecto</span>
      </button>

      {/* 5. Etiquetas Rápidas */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900">Etiquetas Rápidas</h4>
          <button
            onClick={() => showToast('Gestor de etiquetas')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Gestionar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 cursor-pointer transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tag.dotColor}`}></span>
              {tag.name}
            </span>
          ))}
          <button
            onClick={() => showToast('Agregar nueva etiqueta')}
            className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer"
            aria-label="Agregar etiqueta"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal para Crear Proyecto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-100">
            <h4 className="text-base font-bold text-slate-900">Crear Nuevo Proyecto</h4>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marketing Digital"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tipo de Ícono</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['palette', 'code', 'leaf', 'creditCard', 'book'] as const).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                        newCategory === cat
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {renderIcon(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-300 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

