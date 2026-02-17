import React from 'react';
import { NavLink } from 'react-router-dom';
import { Toast as ToastType } from '../../types';
import Toast from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  toasts: ToastType[];
  removeToast: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, toasts, removeToast, theme, toggleTheme }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sleek Sidebar - Desktop */}
      <aside className="w-80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-3xl border-r border-slate-100 dark:border-stone-800 hidden lg:flex flex-col sticky top-0 h-screen transition-all z-40">
        <div className="p-10">
          <div className="flex items-center gap-4 group cursor-pointer select-none">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 ring-2 ring-white/20 dark:ring-black/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-stone-100 leading-none">MindVault</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 dark:text-stone-500 mt-1">Solaris V2</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden ${isActive
                ? 'bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-stone-700'
                : 'text-slate-500 dark:text-stone-500 hover:bg-slate-50 dark:hover:bg-stone-800/50 hover:text-slate-900 dark:hover:text-stone-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Notes</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
              </>
            )}
          </NavLink>

          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden ${isActive
                ? 'bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-stone-700'
                : 'text-slate-500 dark:text-stone-500 hover:bg-slate-50 dark:hover:bg-stone-800/50 hover:text-slate-900 dark:hover:text-stone-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmarks</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-8">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-2xl"
          >
            <span className="text-xs font-black uppercase tracking-widest">{theme === 'light' ? 'Nightfall' : 'Daylight'}</span>
            <div className="p-1.5 rounded-lg bg-white/20 dark:bg-black/10 text-white dark:text-stone-900">
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Bespoke Island Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 dark:bg-stone-900/90 backdrop-blur-2xl rounded-[2.5rem] px-6 py-4 flex justify-between items-center z-[150] shadow-2xl border border-slate-200/50 dark:border-stone-800 ring-1 ring-black/5">
        <NavLink to="/notes" className={({ isActive }) => `p-3.5 rounded-2xl transition-all relative ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-stone-800'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </NavLink>
        <button onClick={toggleTheme} className="p-3.5 bg-slate-100 dark:bg-stone-800 rounded-2xl text-slate-600 dark:text-stone-300 hover:scale-105 active:scale-95 transition-all">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <NavLink to="/bookmarks" className={({ isActive }) => `p-3.5 rounded-2xl transition-all relative ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-stone-800'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </NavLink>
      </nav>

      <main className="flex-1 lg:pl-0 pb-32 lg:pb-0 overflow-x-hidden min-h-screen">
        <div className="max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>

      {/* Toasts - Fixed Z-index and positioning */}
      <div className="fixed bottom-32 lg:bottom-10 right-6 lg:right-10 z-[300] flex flex-col gap-4 items-end pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;