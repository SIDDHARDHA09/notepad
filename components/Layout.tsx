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
      <aside className="w-80 bg-white/60 dark:bg-stone-900/60 backdrop-blur-3xl border-r border-orange-50 dark:border-stone-800 hidden lg:flex flex-col sticky top-0 h-screen transition-all z-40">
        <div className="p-10">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-14 h-14 bg-brand-500 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-brand-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-stone-100 leading-none">MindVault</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-500 mt-1">Solaris V2</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-8">
          {/* Fix: Wrap NavLink children in a function to correctly access the isActive state for child elements */}
          <NavLink 
            to="/notes" 
            className={({ isActive }) => 
              `flex items-center gap-5 px-8 py-5 rounded-[2rem] text-base font-bold transition-all group relative overflow-hidden ${
                isActive 
                ? 'bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-xl border border-orange-100 dark:border-stone-700' 
                : 'text-slate-400 dark:text-stone-500 hover:bg-orange-50/50 dark:hover:bg-stone-800/50 hover:text-slate-900 dark:hover:text-stone-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Notes</span>
                <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-brand-500 scale-125 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-200 dark:bg-stone-700 group-hover:bg-brand-200'}`}></div>
              </>
            )}
          </NavLink>
          {/* Fix: Wrap NavLink children in a function to correctly access the isActive state for child elements */}
          <NavLink 
            to="/bookmarks" 
            className={({ isActive }) => 
              `flex items-center gap-5 px-8 py-5 rounded-[2rem] text-base font-bold transition-all group relative overflow-hidden ${
                isActive 
                ? 'bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-xl border border-orange-100 dark:border-stone-700' 
                : 'text-slate-400 dark:text-stone-500 hover:bg-orange-50/50 dark:hover:bg-stone-800/50 hover:text-slate-900 dark:hover:text-stone-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmarks</span>
                <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-brand-500 scale-125 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-200 dark:bg-stone-700 group-hover:bg-brand-200'}`}></div>
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-8">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-8 py-5 rounded-[2rem] bg-stone-900 dark:bg-brand-600 text-white hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-500/20"
          >
            <span className="text-xs font-black uppercase tracking-widest">{theme === 'light' ? 'Nightfall' : 'Daylight'}</span>
            <div className="p-2 rounded-xl bg-white/10 text-white">
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Bespoke Island Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/80 dark:bg-stone-900/90 backdrop-blur-3xl rounded-[3rem] px-8 py-5 flex justify-between items-center z-[150] shadow-2xl border border-orange-100/20 dark:border-stone-800">
        <NavLink to="/notes" className={({ isActive }) => `p-4 rounded-2xl transition-all relative ${isActive ? 'bg-brand-500 text-white shadow-2xl shadow-brand-500/40 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </NavLink>
        <button onClick={toggleTheme} className="p-4 bg-orange-50 dark:bg-stone-800 rounded-2xl text-brand-500 dark:text-stone-400 hover:scale-110 active:scale-95 transition-all">
           {theme === 'light' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           )}
        </button>
        <NavLink to="/bookmarks" className={({ isActive }) => `p-4 rounded-2xl transition-all relative ${isActive ? 'bg-brand-500 text-white shadow-2xl shadow-brand-500/40 scale-110' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </NavLink>
      </nav>

      <main className="flex-1 lg:pl-0 pb-40 lg:pb-0 overflow-x-hidden min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Toasts */}
      <div className="fixed bottom-40 lg:bottom-12 right-6 lg:right-12 z-[300] flex flex-col gap-5 items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default Layout;