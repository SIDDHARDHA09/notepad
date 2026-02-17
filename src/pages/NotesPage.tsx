import React, { useState, useMemo } from 'react';
import { Note } from '../../types';
import NoteEditor from '../components/NoteEditor';

interface NotesPageProps {
  notes: Note[];
  availableTags: string[];
  onAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'isFavorite'>) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ notes, availableTags, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || note.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, search, selectedTag]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  const handleSave = (noteData: { title: string; content: string }) => {
    if (editingNote) {
      onUpdate(editingNote.id, { ...noteData });
    } else {
      onAdd({ ...noteData, tags: [] });
    }
    setIsEditorOpen(false);
  };

  const NoteCard = ({ note }: { note: Note; key?: React.Key }) => (
    <div className={`premium-card group rounded-[2.5rem] p-10 flex flex-col h-full relative overflow-hidden transition-all duration-500 border ${note.isPinned ? 'border-brand-300 ring-1 ring-brand-100 bg-brand-50/20 dark:bg-stone-800/50' : 'border-slate-100 dark:border-stone-800'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <h3 className="font-extrabold text-2xl text-slate-800 dark:text-stone-100 line-clamp-1 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">{note.title || 'Untitled'}</h3>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { isPinned: !note.isPinned }); }}
            className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${note.isPinned ? 'text-brand-600 bg-white dark:bg-stone-700 shadow-sm' : 'text-slate-300 hover:text-brand-500'}`}
          >
            <svg className="w-5 h-5" fill={note.isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { isFavorite: !note.isFavorite }); }}
            className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${note.isFavorite ? 'text-rose-500 bg-white dark:bg-stone-700 shadow-sm' : 'text-slate-300 hover:text-rose-500'}`}
          >
            <svg className="w-5 h-5" fill={note.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>

      <div
        className="text-slate-600 dark:text-stone-400 text-base leading-relaxed line-clamp-4 mb-10 prose prose-slate dark:prose-invert max-w-none flex-grow relative z-10"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      <div className="mt-auto pt-8 border-t border-slate-50 dark:border-stone-800 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <button onClick={() => setPreviewNote(note)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors duration-300">Preview</button>
          <button onClick={() => { setEditingNote(note); setIsEditorOpen(true); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-500 transition-colors duration-300">Edit</button>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="p-3 bg-rose-50/30 dark:bg-rose-950/20 text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-2xl transition-all duration-300 shadow-sm"
          title="Delete Note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-24 space-y-24 animate-in fade-in duration-700">

      <section className="space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-stone-100 tracking-tighter leading-none">Capture your <br /><span className="text-brand-500 drop-shadow-sm">brilliance.</span></h2>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-stone-400 font-medium leading-relaxed max-w-xl">A radiant space for your thoughts, dreams, and chaos. Designed for clarity.</p>
          </div>
          <button
            onClick={() => { setEditingNote(null); setIsEditorOpen(true); }}
            className="group relative px-12 py-6 bg-brand-500 text-white rounded-[2.5rem] font-black shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center justify-center gap-4"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            <span className="relative z-10 text-lg">New Manuscript</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 group w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-[3rem] blur opacity-5 group-focus-within:opacity-10 transition duration-700"></div>
            <div className="relative bg-white dark:bg-stone-900 border border-slate-100 dark:border-stone-800/50 rounded-[2.5rem] px-10 flex items-center shadow-premium transition-all duration-500 group-focus-within:shadow-xl">
              <svg className="w-7 h-7 text-slate-300 mr-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search your library..."
                className="w-full py-7 bg-transparent text-xl text-slate-800 dark:text-stone-100 font-semibold outline-none placeholder:text-slate-200 dark:placeholder:text-stone-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar py-3 px-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${!selectedTag ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/20' : 'bg-white dark:bg-stone-900 border border-slate-50 dark:border-stone-800 text-slate-400 hover:bg-orange-50 dark:hover:bg-stone-800'}`}
            >
              All
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${selectedTag === tag ? 'bg-brand-500 text-white shadow-xl' : 'bg-white dark:bg-stone-900 border border-slate-50 dark:border-stone-800 text-slate-400 hover:bg-orange-50 dark:hover:bg-stone-800'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {pinnedNotes.length > 0 && (
        <section className="space-y-12 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center gap-5">
            <div className="w-2 h-10 bg-brand-500 rounded-full shadow-lg shadow-brand-500/30"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-stone-100 uppercase tracking-widest">Priority Vault</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        </section>
      )}

      <section className="space-y-12 animate-in slide-in-from-bottom-24 duration-1000">
        <div className="flex items-center gap-5">
          <div className="w-2 h-10 bg-slate-100 dark:bg-stone-800 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-stone-100 uppercase tracking-widest">The Archive</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {otherNotes.map(note => <NoteCard key={note.id} note={note} />)}
          {filteredNotes.length === 0 && (
            <div className="col-span-full py-48 flex flex-col items-center justify-center text-center space-y-10">
              <div className="w-40 h-40 bg-orange-50 dark:bg-stone-900/50 rounded-[4rem] flex items-center justify-center float-animation shadow-inner">
                <svg className="w-16 h-16 text-orange-200 dark:text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="space-y-3">
                <h4 className="text-3xl font-black text-slate-800 dark:text-stone-200 tracking-tight">The vault is silent</h4>
                <p className="text-lg text-slate-400 font-medium">Capture a thought to begin your collection.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {previewNote && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 lg:p-12">
          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-3xl" onClick={() => setPreviewNote(null)}></div>
          <div className="bg-white dark:bg-stone-900 rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in zoom-in slide-in-from-bottom-12 duration-700 custom-scrollbar p-16 lg:p-24 border border-orange-100/10">
            <header className="mb-20 flex justify-between items-start gap-12">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-stone-100 leading-none tracking-tighter">{previewNote.title || 'Untitled Document'}</h2>
                <div className="flex flex-wrap gap-3">
                  {previewNote.tags.map(t => <span key={t} className="text-[11px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-5 py-2 rounded-full border border-brand-100/20 dark:bg-stone-800 dark:text-brand-400">#{t}</span>)}
                </div>
              </div>
              <button onClick={() => setPreviewNote(null)} className="p-5 bg-orange-50 dark:bg-stone-800 rounded-[2rem] hover:scale-110 active:scale-95 transition-all shadow-lg">
                <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <div className="prose prose-2xl dark:prose-invert max-w-none text-slate-700 dark:text-stone-300 leading-[1.6] font-medium" dangerouslySetInnerHTML={{ __html: previewNote.content }} />

            <footer className="mt-24 pt-12 border-t border-slate-50 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <p>Sync at {new Date(previewNote.createdAt).toLocaleString()}</p>
              <p>Last Edit {new Date(previewNote.updatedAt).toLocaleString()}</p>
            </footer>
          </div>
        </div>
      )}

      {isEditorOpen && <NoteEditor note={editingNote} onSave={handleSave} onClose={() => setIsEditorOpen(false)} />}
    </div>
  );
};

export default NotesPage;