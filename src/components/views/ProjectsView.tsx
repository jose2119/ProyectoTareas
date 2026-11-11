import React, { useState } from 'react';
import { SlidersHorizontal, Folder, Palette, Code, Leaf, CreditCard, BookOpen, MoreVertical, Plus, Check, Clock, User, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { projects, createProject, showToast, searchQuery } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'palette' | 'code' | 'leaf' | 'creditCard' | 'book'>('palette');

  const tags = [
    { name: '#urgente', dotColor: 'bg-rose-500', count: 4 },
    { name: '#reunión', dotColor: 'bg-indigo-600', count: 7 },
    { name: '#bug', dotColor: 'bg-rose-700', count: 2 },
    { name: '#diseño', dotColor: 'bg-emerald-500', count: 9 },
    { name: '#compras', dotColor: 'bg-indigo-400', count: 3 },
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
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'personal':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'finance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'learning':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const effectiveSearch = (searchTerm || searchQuery).toLowerCase();

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(effectiveSearch)
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner de Espacios Activos */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Folder className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {projects.length} Espacios Activos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Gestionando {totalPending} tareas activas en todas tus colecciones
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300/50 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear nuevo proyecto</span>
        </button>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 flex items-center gap-2.5 px-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proyectos por nombre o etiqueta..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3">
          <button
            onClick={() => showToast('Filtrando proyectos activos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* 3. Grid Responsivo de Colecciones / Proyectos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Tus Colecciones
          </h3>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            ORGANIZADO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${getIconBg(project.icon)}`}>
                    {renderIcon(project.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {project.activeTasksCount} tareas activas
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(project.badgeVariant)} shrink-0`}>
                  {project.badgeText}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progreso general</span>
                  <span className="font-extrabold text-slate-800">{project.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progressPercentage}%`,
                      backgroundColor: project.color
                    }}
                  ></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                {project.members && project.members.length > 0 ? (
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {project.members.map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar}
                        alt={m.name}
                        title={m.name}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                ) : project.isIndividual ? (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{project.footerNote || 'Proyecto individual'}</span>
                  </div>
                ) : project.footerStatus === 'check' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{project.footerNote}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{project.footerNote}</span>
                  </div>
                )}

                <button
                  onClick={() => showToast(`Opciones de ${project.title}`)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* "+ Crear nuevo proyecto" tarjeta visual integrada en el grid */}
          <div
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-slate-50/70 hover:bg-indigo-50/40 border-2 border-dashed border-indigo-200/80 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[170px] group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white group-hover:bg-indigo-600 group-hover:text-white border border-indigo-100 flex items-center justify-center text-indigo-600 transition-colors shadow-2xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block">
                Crear nuevo proyecto
              </span>
              <span className="text-xs text-slate-400">
                Organiza tareas en un nuevo espacio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Etiquetas Rápidas Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-extrabold text-slate-900">Etiquetas Rápidas</h4>
          </div>
          <button
            onClick={() => showToast('Gestor de etiquetas')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Gestionar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => showToast(`Filtrando por ${tag.name}`)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${tag.dotColor}`}></span>
              <span>{tag.name}</span>
              <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded-md font-bold">
                {tag.count}
              </span>
            </button>
          ))}
          <button
            onClick={() => showToast('Añadir etiqueta rápida')}
            className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Agregar etiqueta"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Modal para Crear Proyecto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <h4 className="text-lg font-extrabold text-slate-900">Crear Nuevo Proyecto</h4>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marketing Digital Q4"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Ícono del Espacio</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['palette', 'code', 'leaf', 'creditCard', 'book'] as const).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
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

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-300 cursor-pointer"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
