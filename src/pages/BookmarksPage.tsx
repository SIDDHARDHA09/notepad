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

  // Reset form when modal opens/closes or editing state changes
  useEffect(() => {
    if (!isModalOpen) {
      setEditingBookmark(null);
      setFormUrl('');
      setFormTitle('');
      setFormDescription('');
      setFormTags([]);
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
      try {
        const metadata = await fetchUrlMetadata(formUrl);
        setFormTitle(metadata.title);
        setFormDescription(metadata.description);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      } finally {
        setIsFetching(false);
      }
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

  const openModal = (bookmark?: Bookmark) => {
    if (bookmark) {
      setEditingBookmark(bookmark);
      setFormUrl(bookmark.url);
      setFormTitle(bookmark.title);
      setFormDescription(bookmark.description);
      setFormTags(bookmark.tags);
    }
    setIsModalOpen(true);
  };

  const BookmarkCard = ({ bookmark: b }: { bookmark: Bookmark; key?: React.Key }) => (
    <div key={b.id} className="group relative break-inside-avoid mb-6">
      <div className={`
        relative overflow-hidden rounded-[2rem] transition-all duration-500
        bg-white dark:bg-stone-900 
        border border-slate-200 dark:border-stone-800
        hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2
        ${b.isPinned ? 'ring-2 ring-brand-500/20 bg-brand-50/30 dark:bg-stone-800/50' : ''}
      `}>
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="p-8 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
              ${b.isPinned ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 rotate-3' : 'bg-slate-100 dark:bg-stone-800 text-slate-400 dark:text-stone-500 group-hover:bg-brand-500 group-hover:text-white'}
            `}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate(b.id, { isPinned: !b.isPinned }); }}
                className={`p-2 rounded-xl transition-colors ${b.isPinned ? 'text-brand-500 bg-brand-50' : 'text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-stone-800'}`}
                title="Pin Bookmark"
              >
                <svg className="w-5 h-5" fill={b.isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openModal(b); }}
                className="p-2 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-stone-800 transition-colors"
                title="Edit Bookmark"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <a href={b.url} target="_blank" rel="noopener noreferrer" className="block mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 leading-tight mb-2 line-clamp-2">{b.title}</h3>
            <p className="text-sm text-slate-500 dark:text-stone-400 line-clamp-3 leading-relaxed">{b.description}</p>
          </a>

          {/* Footer */}
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 dark:border-stone-800/50">
            <div className="flex gap-2 flex-wrap">
              {b.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(b.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full"
              title="Delete Bookmark"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
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
            Digital <br />
            <span className="text-slate-900 dark:text-stone-100">Sanctuary.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
            Curate your corner of the internet. A beautiful collection of things that inspire, educate, and matter to you.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="group relative px-10 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            <span className="group-hover:text-white transition-colors">Save Resource</span>
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
              placeholder="Search by title, url or tag..."
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

      {/* Bookmarks Grid */}
      <div className="columns-1 md:columns-2 xl:columns-3 gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
        {/* Mapping filtered bookmarks directly to handle sorting visually in one flow if preferred, or keeping split */}
        {pinnedBookmarks.map(b => (
          <BookmarkCard key={b.id} bookmark={b} />
        ))}
        {otherBookmarks.map(b => (
          <BookmarkCard key={b.id} bookmark={b} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-slate-50 dark:bg-stone-800/50 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <svg className="w-12 h-12 text-slate-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-playfair font-bold text-slate-900 dark:text-stone-100 mb-2">It's quiet here.</h3>
          <p className="text-slate-500">Add a new bookmark or adjust your filters to find what you're looking for.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-slate-100 dark:border-stone-800 flex justify-between items-center bg-slate-50/50 dark:bg-stone-950/30">
              <h2 className="text-3xl font-playfair font-bold text-slate-900 dark:text-stone-100">{editingBookmark ? 'Edit Resource' : 'New Archive'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-stone-800 text-slate-400 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Address (URL)</label>
                <div className="relative">
                  <input
                    required
                    type="url"
                    value={formUrl}
                    onBlur={handleUrlBlur}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-slate-50 dark:bg-stone-950/50 border border-slate-200 dark:border-stone-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-stone-100 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  />
                  {isFetching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What is this resource called?"
                  className="w-full bg-slate-50 dark:bg-stone-950/50 border border-slate-200 dark:border-stone-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-stone-100 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tags</label>
                <TagInput tags={formTags} onTagsChange={setFormTags} placeholder="Enter to add tag..." />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1"
                >
                  {editingBookmark ? 'Save Changes' : 'AddTo Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;