import React from 'react';
import { Calendar, FolderClosed, Plus, TrendingUp } from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsNewTaskModalOpen } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pt-1 md:hidden">
      <nav className="max-w-md mx-auto bg-white/95 backdrop-blur-lg border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-300/40 px-4 py-2 flex items-center justify-between">
        {/* Item: Hoy */}
        <button
          onClick={() => setActiveTab('hoy')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            activeTab === 'hoy'
              ? 'text-indigo-600 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5 stroke-[2]" />
            {activeTab === 'hoy' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Hoy</span>
        </button>

        {/* Item: Proyectos */}
        <button
          onClick={() => setActiveTab('proyectos')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            activeTab === 'proyectos'
              ? 'text-indigo-600 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <FolderClosed className="w-5 h-5 stroke-[2]" />
            {activeTab === 'proyectos' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Proyectos</span>
        </button>

        {/* Center Floating Action Button: + */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all cursor-pointer group"
            aria-label="Nueva Tarea"
          >
            <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Item: Rendimiento */}
        <button
          onClick={() => setActiveTab('rendimiento')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            activeTab === 'rendimiento'
              ? 'text-indigo-600 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5 stroke-[2]" />
            {activeTab === 'rendimiento' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">Rendimiento</span>
        </button>
      </nav>
    </div>
  );
};
