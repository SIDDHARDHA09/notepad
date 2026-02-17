
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './src/components/Layout';
import NotesPage from './src/pages/NotesPage';
import BookmarksPage from './src/pages/BookmarksPage';
import { Note, Bookmark, AppState, Toast } from './types';

const STORAGE_KEY = 'mindvault_data_v2';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { notes: [], bookmarks: [], tags: [], theme: 'light' };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Apply theme to HTML element
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const allTags = useMemo(() => {
    const noteTags = state.notes.flatMap(n => n.tags);
    const bookmarkTags = state.bookmarks.flatMap(b => b.tags);
    return Array.from(new Set([...noteTags, ...bookmarkTags])).sort();
  }, [state.notes, state.bookmarks]);

  // CRUD Operations
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'isFavorite'>) => {
    const now = Date.now();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      isPinned: false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    setState(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)
    }));
  };

  const deleteNote = (id: string) => {
    const noteToDelete = state.notes.find(n => n.id === id);
    if (!noteToDelete) return;

    const originalNotes = state.notes;
    setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));

    addToast({
      message: `Note "${noteToDelete.title || 'Untitled'}" deleted`,
      type: 'delete',
      onUndo: () => {
        setState(prev => ({ ...prev, notes: originalNotes }));
      }
    });
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'isFavorite'>) => {
    const now = Date.now();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      isPinned: false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    setState(prev => ({ ...prev, bookmarks: [newBookmark, ...prev.bookmarks] }));
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    setState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.map(b => b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b)
    }));
  };

  const deleteBookmark = (id: string) => {
    const bookmarkToDelete = state.bookmarks.find(b => b.id === id);
    if (!bookmarkToDelete) return;

    const originalBookmarks = state.bookmarks;
    setState(prev => ({ ...prev, bookmarks: prev.bookmarks.filter(b => b.id !== id) }));

    addToast({
      message: `Bookmark "${bookmarkToDelete.title}" deleted`,
      type: 'delete',
      onUndo: () => {
        setState(prev => ({ ...prev, bookmarks: originalBookmarks }));
      }
    });
  };

  return (
    <HashRouter>
      <Layout toasts={toasts} removeToast={removeToast} theme={state.theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route
            path="/notes"
            element={
              <NotesPage
                notes={state.notes}
                onAdd={addNote}
                onUpdate={updateNote}
                onDelete={deleteNote}
                availableTags={allTags}
              />
            }
          />
          <Route
            path="/bookmarks"
            element={
              <BookmarksPage
                bookmarks={state.bookmarks}
                onAdd={addBookmark}
                onUpdate={updateBookmark}
                onDelete={deleteBookmark}
                availableTags={allTags}
              />
            }
          />
          <Route path="/" element={<Navigate to="/notes" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
