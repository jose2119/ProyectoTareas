import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { TodayView } from './components/views/TodayView';
import { ProjectsView } from './components/views/ProjectsView';
import { NewTaskView } from './components/views/NewTaskView';
import { PerformanceView } from './components/views/PerformanceView';

const MainLayout: React.FC = () => {
  const { activeTab, isNewTaskModalOpen, setIsNewTaskModalOpen, toastMessage } = useApp();

  const getSubtitle = () => {
    switch (activeTab) {
      case 'hoy':
        return 'Hoy';
      case 'proyectos':
        return 'Proyectos';
      case 'rendimiento':
        return 'Rendimiento';
      default:
        return 'Hoy';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 animate-in slide-in-from-top-4 duration-300 px-4">
          <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-slate-900/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container / Mobile Frame */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-xl shadow-slate-200/50 flex flex-col relative border-x border-slate-200/60">
        {isNewTaskModalOpen ? (
          <NewTaskView onClose={() => setIsNewTaskModalOpen(false)} />
        ) : (
          <>
            <Header subtitle={getSubtitle()} />

            <main className="flex-1 overflow-y-auto">
              {activeTab === 'hoy' && <TodayView />}
              {activeTab === 'proyectos' && <ProjectsView />}
              {activeTab === 'rendimiento' && <PerformanceView />}
            </main>

            <BottomNav />
          </>
        )}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
