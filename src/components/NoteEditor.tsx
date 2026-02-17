import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../../types';
import { Button } from './ui/Button';

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
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content;
      updateStats();
    }

    // Focus management
    if (!note) {
      setTimeout(() => document.getElementById('note-title-input')?.focus(), 300);
    }

    const checkFormats = () => {
      const formats = [];
      if (document.queryCommandState('bold')) formats.push('bold');
      if (document.queryCommandState('italic')) formats.push('italic');
      if (document.queryCommandState('underline')) formats.push('underline');
      if (document.queryCommandState('justifyLeft')) formats.push('justifyLeft');
      if (document.queryCommandState('justifyCenter')) formats.push('justifyCenter');
      if (document.queryCommandState('justifyRight')) formats.push('justifyRight');
      setActiveFormats(formats);
    };

    document.addEventListener('selectionchange', checkFormats);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('selectionchange', checkFormats);
    };
  }, [note]);

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
        const imgHtml = `<img src="${base64}" class="editor-image" />`;
        executeCommand('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    onSave({ title, content });
  };

  const ToolbarButton = ({
    command,
    icon,
    label,
    isActive = false
  }: {
    command: () => void,
    icon?: React.ReactNode,
    label?: string,
    isActive?: boolean
  }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); command(); }}
      className={`p-2.5 rounded-2xl transition-all duration-200 flex items-center justify-center min-w-[40px] min-h-[40px] ${isActive
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-stone-800 text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-200'
        }`}
      title={label}
    >
      {icon || <span className="font-bold text-lg">{label}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-stone-950 flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out overflow-hidden">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="p-4 lg:p-8 flex flex-col h-full overflow-hidden">

        <header className="flex items-center justify-between mb-6 px-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="group p-3 bg-slate-50 dark:bg-stone-900 border border-slate-100 dark:border-stone-800 rounded-2xl hover:scale-105 transition-all shadow-sm hover:shadow-xl active:scale-95"
              title="Discard Changes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 mb-1">Editor</span>
              <span className="text-xs font-bold text-slate-400 dark:text-stone-500">Auto-save enabled</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={!title.trim()}
            className="rounded-[1.5rem]"
          >
            <span className="mr-2">Publish</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </Button>
        </header>

        {/* Improved Floating Toolbar */}
        <div className="mx-auto w-full max-w-4xl mb-8 sticky top-0 z-30 px-4">
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-stone-800/50 p-2 rounded-[2rem] shadow-2xl flex items-center flex-wrap gap-1 justify-center animate-in slide-in-from-top-4 duration-500">

            <div className="flex items-center gap-1 px-2 border-r border-slate-200 dark:border-stone-800">
              <ToolbarButton command={() => executeCommand('undo')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>} label="Undo" />
              <ToolbarButton command={() => executeCommand('redo')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>} label="Redo" />
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-slate-200 dark:border-stone-800">
              <ToolbarButton command={() => executeCommand('bold')} label="B" isActive={activeFormats.includes('bold')} />
              <ToolbarButton command={() => executeCommand('italic')} label="I" isActive={activeFormats.includes('italic')} />
              <ToolbarButton command={() => executeCommand('underline')} label="U" isActive={activeFormats.includes('underline')} />
            </div>

            <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-stone-800">
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-stone-800 rounded-xl">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onMouseDown={(e) => { e.preventDefault(); handleColorChange(c.value); }}
                    className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125 ${color === c.value ? 'border-slate-400 dark:border-stone-400 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <div className="w-[1px] h-3 bg-slate-300 dark:bg-stone-600 mx-1"></div>
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-slate-300 dark:border-stone-600 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                    title="Custom Color"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-slate-200 dark:border-stone-800">
              <ToolbarButton command={() => executeCommand('justifyLeft')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h16" /></svg>} label="Left" isActive={activeFormats.includes('justifyLeft')} />
              <ToolbarButton command={() => executeCommand('justifyCenter')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M7 12h10M4 18h16" /></svg>} label="Center" isActive={activeFormats.includes('justifyCenter')} />
              <ToolbarButton command={() => executeCommand('justifyRight')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M10 12h10M4 18h16" /></svg>} label="Right" isActive={activeFormats.includes('justifyRight')} />
            </div>

            <div className="flex items-center gap-1 px-2">
              <ToolbarButton command={() => fileInputRef.current?.click()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Image" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-0" onInput={updateStats}>
          <div className="max-w-4xl mx-auto w-full bg-white dark:bg-stone-900 min-h-[100vh] rounded-[3rem] shadow-premium p-10 lg:p-20 transition-all duration-700 mb-20 relative border border-slate-100 dark:border-stone-800 ring-1 ring-slate-900/5">
            <input
              id="note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Start with a title..."
              className="w-full text-4xl md:text-6xl font-black text-slate-900 dark:text-stone-100 border-none outline-none placeholder:text-slate-200 dark:placeholder:text-stone-800 mb-12 bg-transparent tracking-tight leading-tight"
            />

            <div
              ref={editorRef}
              contentEditable
              spellCheck="false"
              className="w-full text-lg md:text-xl text-slate-700 dark:text-stone-300 leading-relaxed border-none outline-none bg-transparent min-h-[60vh] focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 dark:empty:before:text-stone-700 prose prose-lg dark:prose-invert max-w-none"
              data-placeholder="Type something amazing..."
            />

            <div className="absolute bottom-8 right-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-stone-700 pointer-events-none select-none">
              <span className="text-brand-500">{wordCount} Words</span>
              <div className="w-1 h-1 bg-slate-200 dark:bg-stone-800 rounded-full"></div>
              <span>{Math.ceil(wordCount / 200)} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;