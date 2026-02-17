
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export type VaultItemType = 'note' | 'bookmark';

export interface AppState {
  notes: Note[];
  bookmarks: Bookmark[];
  tags: string[];
  theme: 'light' | 'dark';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'delete';
  onUndo?: () => void;
}
