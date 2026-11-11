import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { TodayView } from './components/views/TodayView';
import { ProjectsView } from './components/views/ProjectsView';
import { NewTaskView } from './components/views/NewTaskView';
import { PerformanceView } from './components/views/PerformanceView';
import { AuthModal } from './components/auth/AuthModal';
import { TagsModal } from './components/modals/TagsModal';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    toastMessage,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isTagModalOpen,
    setIsTagModalOpen,
  } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center gap-2 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Responsive Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Web Top Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic View Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {activeTab === 'hoy' && <TodayView />}
          {activeTab === 'proyectos' && <ProjectsView />}
          {activeTab === 'rendimiento' && <PerformanceView />}
        </main>

        {/* Mobile-only Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* New Task SaaS Modal Dialog */}
      {isNewTaskModalOpen && (
        <NewTaskView onClose={() => setIsNewTaskModalOpen(false)} />
      )}

      {/* Auth Modal (Login / Registro para backend en Render) */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Tags & Categories CRUD Modal */}
      <TagsModal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} />
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
