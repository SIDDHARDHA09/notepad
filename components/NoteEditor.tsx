import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onSave: (noteData: { title: string; content: string }) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: 'Deep Slate', value: '#334155' },
  { name: 'Silver Slate', value: '#94a3b8' },
  { name: 'Rose Red', value: '#ef4444' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Ocean Blue', value: '#3b82f6' },
  { name: 'Electric Violet', value: '#8b5cf6' },
];

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [color, setColor] = useState('#334155');
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content;
      updateStats();
    }
    if (!note) {
      setTimeout(() => document.getElementById('note-title-input')?.focus(), 300);
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const updateStats = () => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateStats();
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    executeCommand('foreColor', newColor);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const imgHtml = `<img src="${base64}" class="editor-image" style="max-width: 100%; height: auto; border-radius: 2.5rem; margin: 3rem 0; box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15);" />`;
        executeCommand('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    onSave({ title, content });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-stone-950 flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out overflow-hidden">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="p-4 lg:p-10 flex flex-col h-full overflow-hidden">
        
        <header className="flex items-center justify-between mb-10 px-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose} 
              className="group p-4 bg-slate-50 dark:bg-stone-900 border border-slate-100 dark:border-stone-800 rounded-[1.5rem] hover:scale-105 transition-all shadow-sm hover:shadow-xl active:scale-95"
              title="Discard Changes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-500 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 mb-1">New Manuscript</span>
              <span className="text-xs font-bold text-slate-400 dark:text-stone-500">Auto-save active</span>
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="relative group bg-brand-500 hover:bg-brand-600 disabled:opacity-30 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-brand-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10">Publish to Vault</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </button>
        </header>

        {/* Solaris Floating Toolbar */}
        <div className="mx-auto w-full max-w-5xl mb-10 sticky top-0 z-30 px-4">
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-3xl border border-slate-100/50 dark:border-stone-800/30 p-2.5 rounded-[2.5rem] shadow-2xl flex items-center flex-wrap gap-1 justify-center animate-in slide-in-from-top-4 duration-500">
            
            <div className="flex items-center gap-0.5 px-2 border-r border-slate-100 dark:border-stone-800">
              <button onClick={() => executeCommand('undo')} className="p-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl transition-all text-slate-600 dark:text-stone-400" title="Undo"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg></button>
              <button onClick={() => executeCommand('redo')} className="p-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl transition-all text-slate-600 dark:text-stone-400" title="Redo"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg></button>
            </div>

            <div className="flex items-center gap-0.5 px-2 border-r border-slate-100 dark:border-stone-800">
              <button onClick={() => executeCommand('bold')} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl font-black text-slate-700 dark:text-stone-300">B</button>
              <button onClick={() => executeCommand('italic')} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl italic font-bold text-slate-700 dark:text-stone-300">I</button>
              <button onClick={() => executeCommand('underline')} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl underline font-bold text-slate-700 dark:text-stone-300">U</button>
            </div>

            {/* Very Small Color Section */}
            <div className="flex items-center gap-2 px-3 border-r border-slate-100 dark:border-stone-800">
              <div className="flex items-center gap-0.5 p-0.5 bg-slate-50/50 dark:bg-stone-800/50 rounded-lg">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleColorChange(c.value)}
                    className={`w-3.5 h-3.5 rounded-full border transition-all hover:scale-150 ${color === c.value ? 'border-brand-500 scale-125 shadow-sm shadow-brand-500/20' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <div className="w-[1px] h-2.5 bg-slate-200 dark:bg-stone-700 mx-1"></div>
                <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden border border-white dark:border-stone-600 shadow-sm hover:scale-150 transition-transform">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => handleColorChange(e.target.value)} 
                    className="absolute inset-0 w-[300%] h-[300%] -translate-x-1/3 -translate-y-1/3 cursor-pointer" 
                    title="Custom Color" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5 px-2 border-r border-slate-100 dark:border-stone-800">
              <button onClick={() => executeCommand('justifyLeft')} className="p-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl transition-all text-slate-600 dark:text-stone-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h16" /></svg></button>
              <button onClick={() => executeCommand('justifyCenter')} className="p-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl transition-all text-slate-600 dark:text-stone-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M7 12h10M4 18h16" /></svg></button>
              <button onClick={() => executeCommand('justifyRight')} className="p-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-2xl transition-all text-slate-600 dark:text-stone-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M10 12h10M4 18h16" /></svg></button>
            </div>

            <div className="flex items-center gap-2 px-3">
               <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-brand-500 text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-500/20" title="Insert Media">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-0" onInput={updateStats}>
          <div className="max-w-4xl mx-auto w-full bg-white dark:bg-stone-900 min-h-[120vh] rounded-[4rem] shadow-premium p-12 lg:p-24 transition-all duration-700 mb-24 relative border border-slate-50 dark:border-stone-800 focus-within:shadow-2xl focus-within:border-brand-500/10">
            <input
              id="note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a name..."
              className="w-full text-5xl md:text-8xl font-black text-slate-900 dark:text-stone-100 border-none outline-none placeholder:text-slate-100 dark:placeholder:text-stone-800/20 mb-16 bg-transparent tracking-tighter leading-none"
            />
            
            <div
              ref={editorRef}
              contentEditable
              spellCheck="false"
              className="w-full text-xl md:text-2xl text-slate-700 dark:text-stone-300 leading-relaxed border-none outline-none bg-transparent min-h-[60vh] focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-100 dark:empty:before:text-stone-800 prose prose-2xl dark:prose-invert max-w-none font-medium"
              data-placeholder="The stage is yours..."
            />

            <div className="absolute bottom-12 right-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-stone-700 pointer-events-none">
              <span className="text-brand-500 font-black">{wordCount} Words</span>
              <div className="w-1 h-1 bg-slate-100 dark:bg-stone-800 rounded-full"></div>
              <span>{Math.ceil(wordCount / 200)} Min Read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;