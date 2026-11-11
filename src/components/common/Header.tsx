import React from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ subtitle = 'Hoy', showBack, onBack, rightAction }) => {
  const { searchQuery, setSearchQuery } = useApp();
  const [isSearching, setIsSearching] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition-colors"
            aria-label="Volver"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
              TaskFlow
            </h1>
            <span className="text-xs font-medium text-slate-400 capitalize">{subtitle}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {isSearching ? (
          <div className="relative animate-in fade-in duration-200">
            <input
              type="text"
              autoFocus
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearching(false)}
              className="w-36 sm:w-48 pl-3 pr-7 py-1 text-xs bg-slate-100 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {rightAction ? (
          rightAction
        ) : (
          <div className="relative cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Camila"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        )}
      </div>
    </header>
  );
};

