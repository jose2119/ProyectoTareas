import React from 'react';
import { Calendar, FolderClosed, TrendingUp, Plus, Flame, Hash, X, LogIn, LogOut, CheckCircle } from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    setIsNewTaskModalOpen,
    tasks,
    projects,
    tags,
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    logout,
    streak,
  } = useApp();

  const pendingCount = tasks.filter(t => !t.completed).length;

  const navItems = [
    {
      id: 'hoy' as NavTab,
      label: 'Hoy',
      icon: Calendar,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'proyectos' as NavTab,
      label: 'Proyectos',
      icon: FolderClosed,
      badge: projects.length,
    },
    {
      id: 'rendimiento' as NavTab,
      label: 'Rendimiento',
      icon: TrendingUp,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none block">
                TaskFlow
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                API Render Conectada
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setIsNewTaskModalOpen(true);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <span>Nueva Tarea</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Principal
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Colecciones / Espacios */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Colecciones
              </span>
              <span className="text-[10px] font-bold text-indigo-600">
                {projects.length}
              </span>
            </div>

            <div className="space-y-0.5">
              {projects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavClick('proyectos')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-semibold">
                    {p.activeTasksCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tags */}
          <div className="space-y-2">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Etiquetas
            </span>
            <div className="px-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.etiqueta_id}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  <Hash className="w-3 h-3 text-indigo-500" />
                  {tag.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile in Sidebar Footer with Auth Controls */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                      alt={user.nombre_completo}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="leading-tight min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {user.nombre_completo}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      @{user.nombre_usuario}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                  <Flame className="w-3 h-3 fill-amber-500" />
                  <span>{streak}d</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              <p className="text-[11px] text-slate-500 text-center">
                Conecta tu cuenta para sincronizar con Render
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar / Registrarse</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
