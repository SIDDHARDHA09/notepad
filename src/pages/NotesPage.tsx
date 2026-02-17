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
    <div key={note.id} className="group relative break-inside-avoid mb-6" onClick={() => setPreviewNote(note)}>
      <div className={`
        relative overflow-hidden rounded-[2rem] transition-all duration-500 cursor-pointer
        bg-white dark:bg-stone-900 
        border border-slate-200 dark:border-stone-800
        hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2
        ${note.isPinned ? 'ring-2 ring-brand-500/20 bg-brand-50/30 dark:bg-stone-800/50' : ''}
      `}>
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="p-8 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
              ${note.isPinned ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 rotate-3' : 'bg-slate-100 dark:bg-stone-800 text-slate-400 dark:text-stone-500 group-hover:bg-brand-500 group-hover:text-white'}
            `}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { isPinned: !note.isPinned }); }}
                className={`p-2 rounded-xl transition-colors ${note.isPinned ? 'text-brand-500 bg-brand-50' : 'text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
                title="Pin Note"
              >
                <svg className="w-5 h-5" fill={note.isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { isFavorite: !note.isFavorite }); }}
                className={`p-2 rounded-xl transition-colors ${note.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-800'}`}
                title="Favorite Note"
              >
                <svg className="w-5 h-5" fill={note.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 leading-tight mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{note.title || 'Untitled Draft'}</h3>
            <div
              className="text-sm text-slate-500 dark:text-stone-400 line-clamp-4 leading-relaxed prose prose-sm dark:prose-invert pointer-events-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 dark:border-stone-800/50">
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-stone-800 px-2 py-1 rounded-md">
                {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              {note.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setEditingNote(note); setIsEditorOpen(true); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-brand-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full"
                title="Edit Note"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full"
                title="Delete Note"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 px-6 lg:px-16 pt-24 lg:pt-32 max-w-[1600px] mx-auto">

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-black text-slate-900 dark:text-stone-100 leading-[0.9] tracking-tight mb-8">
            Creative <br />
            <span className="text-slate-900 dark:text-stone-100">Canvas.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
            A radiant space for your thoughts, dreams, and chaos. Designed for clarity and inspiration.
          </p>
        </div>

        <button
          onClick={() => { setEditingNote(null); setIsEditorOpen(true); }}
          className="group relative px-10 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            <span className="group-hover:text-white transition-colors">New Manuscript</span>
            <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-6 z-30 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl border border-slate-200/60 dark:border-stone-800 rounded-[2rem] p-4 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col md:flex-row items-center gap-4">

          {/* Search Input */}
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your library..."
              className="w-full bg-slate-50 dark:bg-stone-950/50 border-none rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-stone-100 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none font-medium"
            />
          </div>

          {/* Tag Filters */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex gap-2 pb-1 md:pb-0 px-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${!selectedTag ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
            >
              All
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${selectedTag === tag ? 'bg-brand-500 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="columns-1 md:columns-2 xl:columns-3 gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
        {/* Mapping filtered notes */}
        {pinnedNotes.map(n => (
          <NoteCard key={n.id} note={n} />
        ))}
        {otherNotes.map(n => (
          <NoteCard key={n.id} note={n} />
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-slate-50 dark:bg-stone-800/50 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <svg className="w-12 h-12 text-slate-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-3xl font-playfair font-bold text-slate-900 dark:text-stone-100 mb-2">The canvas is blank.</h3>
          <p className="text-slate-500">Capture a new thought to begin your collection.</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 lg:p-12">
          <div className="absolute inset-0 bg-stone-950/40 dark:bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setPreviewNote(null)}></div>
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar p-10 lg:p-16 border border-white/20">
            <header className="mb-12 flex justify-between items-start gap-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-playfair font-black text-slate-900 dark:text-stone-100 leading-none tracking-tight">{previewNote.title || 'Untitled Document'}</h2>
                <div className="flex flex-wrap gap-2">
                  {previewNote.tags.map(t => <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-md">#{t}</span>)}
                </div>
              </div>
              <button onClick={() => setPreviewNote(null)} className="p-3 bg-slate-50 dark:bg-stone-800 rounded-full hover:bg-slate-100 transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <div className="prose prose-xl dark:prose-invert max-w-none text-slate-600 dark:text-stone-300 leading-relaxed font-serif" dangerouslySetInnerHTML={{ __html: previewNote.content }} />

            <footer className="mt-16 pt-8 border-t border-slate-100 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <p>Sync at {new Date(previewNote.createdAt).toLocaleString()}</p>
              <button
                onClick={() => { setPreviewNote(null); setEditingNote(previewNote); setIsEditorOpen(true); }}
                className="text-brand-500 hover:text-brand-600 transition-colors"
              >
                Edit Document
              </button>
            </footer>
          </div>
        </div>
      )}

      {isEditorOpen && <NoteEditor note={editingNote} onSave={handleSave} onClose={() => setIsEditorOpen(false)} />}
    </div>
  );
};

export default NotesPage;