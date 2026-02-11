
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Toast as ToastType } from '../types';
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
      <aside className="w-72 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 hidden lg:flex flex-col sticky top-0 h-screen transition-all z-40">
        <div className="p-8">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">MindVault</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500/70">Personal Sanctuary</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <NavLink 
            to="/notes" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group ${
                isActive 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-premium border border-slate-100 dark:border-slate-700' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Notes
          </NavLink>
          <NavLink 
            to="/bookmarks" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group ${
                isActive 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-premium border border-slate-100 dark:border-slate-700' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmarks
          </NavLink>
        </nav>

        <div className="p-6">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-widest">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Modern Bottom Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-3xl px-8 py-4 flex justify-between items-center z-50">
        <NavLink to="/notes" className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </NavLink>
        <button onClick={toggleTheme} className="p-3 text-slate-400">
           {theme === 'light' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           )}
        </button>
        <NavLink to="/bookmarks" className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </NavLink>
      </nav>

      <main className="flex-1 lg:pl-0 pb-32 lg:pb-0 overflow-x-hidden min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Toasts */}
      <div className="fixed bottom-32 lg:bottom-12 right-6 lg:right-12 z-[100] flex flex-col gap-4">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default Layout;
