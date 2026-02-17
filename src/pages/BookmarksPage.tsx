import React, { useState, useMemo, useEffect } from 'react';
import { Bookmark } from '../../types';
import TagInput from '../components/TagInput';
import { fetchUrlMetadata } from '../../services/geminiService';

interface BookmarksPageProps {
  bookmarks: Bookmark[];
  availableTags: string[];
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'isFavorite'>) => void;
  onUpdate: (id: string, updates: Partial<Bookmark>) => void;
  onDelete: (id: string) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ bookmarks, availableTags, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const [formUrl, setFormUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isModalOpen]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.url.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || b.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [bookmarks, search, selectedTag]);

  const pinnedBookmarks = useMemo(() => filteredBookmarks.filter(b => b.isPinned), [filteredBookmarks]);
  const otherBookmarks = useMemo(() => filteredBookmarks.filter(b => !b.isPinned), [filteredBookmarks]);

  const handleUrlBlur = async () => {
    if (formUrl && !formTitle && !editingBookmark) {
      setIsFetching(true);
      const metadata = await fetchUrlMetadata(formUrl);
      setFormTitle(metadata.title);
      setFormDescription(metadata.description);
      setIsFetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBookmark) {
      onUpdate(editingBookmark.id, { url: formUrl, title: formTitle, description: formDescription, tags: formTags });
    } else {
      onAdd({ url: formUrl, title: formTitle, description: formDescription, tags: formTags });
    }
    setIsModalOpen(false);
  };

  const BookmarkCard = ({ bookmark: b }: { bookmark: Bookmark; key?: React.Key }) => (
    <div key={b.id} className={`premium-card group rounded-[2.5rem] p-10 flex flex-col h-full relative overflow-hidden transition-all duration-500 border ${b.isPinned ? 'border-brand-300 ring-1 ring-brand-100 bg-brand-50/20 dark:bg-stone-800/50' : 'border-slate-100 dark:border-stone-800'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-16 h-16 bg-slate-50 dark:bg-stone-800 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <button onClick={() => onUpdate(b.id, { isPinned: !b.isPinned })} className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${b.isPinned ? 'text-brand-600 bg-white dark:bg-stone-700 shadow-sm' : 'text-slate-300 hover:text-brand-500'}`}><svg className="w-5 h-5" fill={b.isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg></button>
          <button onClick={() => onUpdate(b.id, { isFavorite: !b.isFavorite })} className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${b.isFavorite ? 'text-rose-500 bg-white dark:bg-stone-700 shadow-sm' : 'text-slate-300 hover:text-rose-500'}`}><svg className="w-5 h-5" fill={b.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
        </div>
      </div>

      <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-black text-2xl text-slate-900 dark:text-stone-100 mb-4 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors tracking-tight relative z-10 leading-tight">{b.title}</a>
      <p className="text-slate-500 dark:text-stone-400 text-base leading-relaxed line-clamp-3 mb-10 font-medium relative z-10">{b.description}</p>

      <div className="mt-auto pt-8 border-t border-slate-50 dark:border-stone-800 flex items-center justify-between relative z-10">
        <div className="flex flex-wrap gap-2">
          {b.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">#{t}</span>)}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditingBookmark(b); setFormUrl(b.url); setFormTitle(b.title); setFormDescription(b.description); setFormTags(b.tags); setIsModalOpen(true); }} className="p-3 bg-slate-50 dark:bg-stone-800 text-brand-500 hover:text-brand-600 rounded-2xl transition-all duration-300 shadow-sm hover:scale-110"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
          <button
            onClick={() => onDelete(b.id)}
            className="p-3 bg-rose-50/30 dark:bg-rose-950/20 text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-2xl transition-all duration-300 shadow-sm hover:scale-110"
            title="Archive Link"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-24 space-y-24 animate-in fade-in duration-700">
      <section className="space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-stone-100 tracking-tighter leading-none">Capture the <br /><span className="text-brand-500 drop-shadow-sm">infinite web.</span></h2>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-stone-400 font-medium leading-relaxed max-w-xl">A sophisticated collection of resources and tools curated for your digital path.</p>
          </div>
          <button
            onClick={() => { setEditingBookmark(null); setFormUrl(''); setFormTitle(''); setFormDescription(''); setFormTags([]); setIsModalOpen(true); }}
            className="group relative px-12 py-6 bg-brand-500 text-white rounded-[2.5rem] font-black shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center justify-center gap-4"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            <span className="relative z-10 text-lg">Archive Link</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 group w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-[3rem] blur opacity-5 group-focus-within:opacity-10 transition duration-700"></div>
            <div className="relative bg-white dark:bg-stone-900 border border-slate-100 dark:border-stone-800/50 rounded-[2.5rem] px-10 flex items-center shadow-premium transition-all duration-500 group-focus-within:shadow-xl">
              <svg className="w-7 h-7 text-slate-300 mr-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search through saved resources..."
                className="w-full py-7 bg-transparent text-xl text-slate-800 dark:text-stone-100 font-semibold outline-none placeholder:text-slate-200 dark:placeholder:text-stone-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar py-3 px-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${!selectedTag ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/20' : 'bg-white dark:bg-stone-900 border border-slate-50 dark:border-stone-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
            >
              All
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${selectedTag === tag ? 'bg-brand-500 text-white shadow-xl' : 'bg-white dark:bg-stone-900 border border-slate-50 dark:border-stone-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {pinnedBookmarks.length > 0 && (
        <section className="space-y-12 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center gap-5">
            <div className="w-2 h-10 bg-brand-500 rounded-full shadow-lg shadow-brand-500/30"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-stone-100 uppercase tracking-widest">Essential Links</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {pinnedBookmarks.map(b => <BookmarkCard key={b.id} bookmark={b} />)}
          </div>
        </section>
      )}

      <section className="space-y-12 animate-in slide-in-from-bottom-24 duration-1000">
        <div className="flex items-center gap-5">
          <div className="w-2 h-10 bg-slate-100 dark:bg-stone-800 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-stone-100 uppercase tracking-widest">Web Archives</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {otherBookmarks.map(b => <BookmarkCard key={b.id} bookmark={b} />)}
          {filteredBookmarks.length === 0 && (
            <div className="col-span-full py-48 flex flex-col items-center justify-center text-center space-y-10">
              <div className="w-40 h-40 bg-slate-50 dark:bg-stone-900/50 rounded-[4rem] flex items-center justify-center float-animation shadow-inner">
                <svg className="w-16 h-16 text-slate-200 dark:text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div className="space-y-3">
                <h4 className="text-3xl font-black text-slate-800 dark:text-stone-200 tracking-tight">The archive is silent</h4>
                <p className="text-lg text-slate-400 font-medium">No bookmarks found matching your criteria.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 lg:p-12">
          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-stone-900 rounded-[4rem] w-full max-w-xl relative shadow-2xl animate-in zoom-in slide-in-from-bottom-12 duration-700 overflow-hidden border border-slate-100/10">
            <form onSubmit={handleSubmit} className="p-12 lg:p-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-stone-100 mb-16 tracking-tighter leading-none">{editingBookmark ? 'Update Resource' : 'Archive New Link'}</h2>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resource URL</label>
                  <div className="relative group">
                    <input required type="url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} onBlur={handleUrlBlur} className="w-full px-10 py-6 bg-slate-50 dark:bg-stone-800/50 border-none rounded-[2rem] focus:ring-4 focus:ring-brand-500/20 text-slate-800 dark:text-stone-100 font-bold outline-none transition-all placeholder:text-slate-200" placeholder="https://mindvault.app/resource" />
                    {isFetching && <div className="absolute right-8 top-1/2 -translate-y-1/2"><div className="w-6 h-6 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Display Title</label>
                  <input required type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-10 py-6 bg-slate-50 dark:bg-stone-800/50 border-none rounded-[2rem] focus:ring-4 focus:ring-brand-500/20 text-slate-800 dark:text-stone-100 font-bold outline-none transition-all placeholder:text-slate-200" placeholder="Web Page Title" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quick Tags</label>
                  <TagInput tags={formTags} onTagsChange={setFormTags} placeholder="Enter to add tag..." />
                </div>
                <div className="flex gap-6 pt-12">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-slate-50 dark:bg-stone-800 rounded-[2rem] font-black text-slate-400 dark:text-stone-500 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 py-6 bg-brand-500 text-white rounded-[2rem] font-black shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">Confirm Archive</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;