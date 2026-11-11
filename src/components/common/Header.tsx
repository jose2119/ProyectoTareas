import React from 'react';
import { Search, Bell, Plus, Menu, Flame, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    setIsNewTaskModalOpen,
    showToast,
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    streak,
  } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'hoy':
        return 'Panel de Hoy';
      case 'proyectos':
        return 'Colecciones & Proyectos';
      case 'rendimiento':
        return 'Rendimiento & Métricas';
      default:
        return 'Panel Principal';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger + View Titles */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir navegación"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {getTitle()}
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              API Render Live
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
            {user ? `Bienvenido, ${user.nombre_completo}` : 'Gestión inteligente sincronizada con backend en Render'}
          </p>
        </div>
      </div>

      {/* Middle & Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Search Input Bar */}
        <div className="relative w-40 sm:w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tareas o proyectos..."
            className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 pl-9 pr-12 py-2 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          <kbd className="hidden lg:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Streak Badge (visible on sm+) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-700 text-xs font-bold shadow-2xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{streak} días racha</span>
        </div>

        {/* Notifications button */}
        <button
          onClick={() => showToast('No tienes notificaciones pendientes')}
          className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Desktop Quick "+ Nueva Tarea" button */}
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="hidden md:flex items-center gap-2 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-indigo-300 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Tarea</span>
        </button>

        {/* User profile / Login trigger */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200/80">
          {isAuthenticated && user ? (
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={user.nombre_completo}
              title={`Conectado como ${user.nombre_completo}`}
              onClick={() => setIsAuthModalOpen(true)}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs cursor-pointer hover:ring-indigo-500 transition-all"
            />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer border border-indigo-200/60"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
