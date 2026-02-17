import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 5000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onClose(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, onClose]);

  return (
    <div className="bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-2xl text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-10 min-w-[340px] animate-in slide-in-from-right-8 fade-in duration-500 overflow-hidden relative border border-white/10">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse"></div>
        <p className="text-sm font-bold tracking-tight">{toast.message}</p>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {toast.onUndo && (
          <button
            onClick={() => {
              toast.onUndo?.();
              onClose(toast.id);
            }}
            className="text-brand-400 hover:text-brand-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 transition-colors"
          >
            Undo
          </button>
        )}
        <button onClick={() => onClose(toast.id)} className="p-1.5 text-stone-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Smooth Progress Indicator */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-brand-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default Toast;