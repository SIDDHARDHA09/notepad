
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onSave: (noteData: { title: string; content: string }) => void;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [fontSize, setFontSize] = useState('3');
  const [color, setColor] = useState('#6366f1');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content;
    }
    if (!note) {
      setTimeout(() => document.getElementById('note-title-input')?.focus(), 300);
    }
  }, []);

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontSize(val);
    executeCommand('fontSize', val);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    executeCommand('foreColor', e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const imgHtml = `<img src="${base64}" class="editor-image" style="max-width: 100%; height: auto; border-radius: 1.5rem; margin: 2rem 0; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);" />`;
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
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="p-4 lg:p-6 flex flex-col h-full overflow-hidden">
        
        <header className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:scale-105 transition-transform shadow-sm"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 hidden sm:block">Editor Mode</p>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {note ? 'Update Changes' : 'Publish Note'}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </button>
        </header>

        <div className="mx-auto w-full max-w-5xl mb-6 sticky top-0 z-20">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 p-2.5 rounded-[2rem] shadow-premium flex items-center flex-wrap gap-1.5 justify-center">
            
            <div className="flex items-center gap-0.5 px-1">
              <button onClick={() => executeCommand('undo')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400" title="Undo"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg></button>
              <button onClick={() => executeCommand('redo')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400" title="Redo"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg></button>
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-0.5 px-1">
              <button onClick={() => executeCommand('cut')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400" title="Cut">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243-4.243z" /></svg>
              </button>
              <button onClick={() => executeCommand('copy')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400" title="Copy">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              </button>
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-2 px-1">
              <select 
                onChange={(e) => executeCommand('fontName', e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Playfair Display, serif">Playfair</option>
                <option value="Lora, serif">Lora</option>
                <option value="JetBrains Mono, monospace">Mono</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Roboto, sans-serif">Roboto</option>
              </select>
              <select 
                value={fontSize}
                onChange={handleFontSizeChange}
                className="bg-slate-50 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 outline-none cursor-pointer w-12"
              >
                <option value="1">10</option>
                <option value="2">12</option>
                <option value="3">14</option>
                <option value="4">18</option>
                <option value="5">24</option>
                <option value="6">32</option>
                <option value="7">48</option>
              </select>
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-1 px-1">
              <button onClick={() => executeCommand('bold')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-black text-slate-700 dark:text-slate-300" title="Bold">B</button>
              <button onClick={() => executeCommand('italic')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl italic font-bold text-slate-700 dark:text-slate-300" title="Italic">I</button>
              <button onClick={() => executeCommand('underline')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl underline font-bold text-slate-700 dark:text-slate-300" title="Underline">U</button>
              <div className="relative group p-1 flex items-center">
                <input type="color" value={color} onChange={handleColorChange} className="w-8 h-8 rounded-xl cursor-pointer border-none bg-transparent outline-none overflow-hidden" title="Text Color" />
              </div>
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-1 px-1">
              <button onClick={() => executeCommand('justifyLeft')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" title="Align Left">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
              </button>
              <button onClick={() => executeCommand('justifyCenter')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" title="Align Center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
              </button>
              <button onClick={() => executeCommand('justifyRight')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" title="Align Right">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
              </button>
            </div>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <div className="flex items-center gap-1 px-1">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" title="Insert Image">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <button onClick={() => executeCommand('insertUnorderedList')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" title="Bullet List">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-0">
          <div className="max-w-4xl mx-auto w-full bg-white dark:bg-slate-900 min-h-[120vh] rounded-[3rem] shadow-premium p-12 lg:p-24 transition-colors duration-500 mb-20 relative border border-slate-100 dark:border-slate-800">
            <input
              id="note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your thoughts a title..."
              className="w-full text-5xl md:text-7xl font-black text-slate-900 dark:text-white border-none outline-none placeholder:text-slate-100 dark:placeholder:text-slate-800 mb-12 bg-transparent tracking-tight leading-tight"
            />
            
            <div
              ref={editorRef}
              contentEditable
              spellCheck="false"
              className="w-full text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed border-none outline-none bg-transparent min-h-[50vh] focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-200 dark:empty:before:text-slate-800 prose prose-2xl dark:prose-invert max-w-none"
              data-placeholder="Start your masterpiece here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
