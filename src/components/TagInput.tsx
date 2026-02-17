import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder = "Add tags..." }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = input.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2.5 p-3.5 bg-orange-50/30 dark:bg-stone-800 border border-transparent focus-within:border-brand-500/30 focus-within:ring-4 focus-within:ring-brand-500/10 rounded-2xl transition-all duration-300">
      {tags.map(tag => (
        <span 
          key={tag} 
          className="flex items-center gap-2 bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm border border-orange-50 dark:border-stone-600 animate-in zoom-in duration-300"
        >
          #{tag}
          <button 
            type="button"
            onClick={() => removeTag(tag)}
            className="text-slate-300 hover:text-rose-500 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-800 dark:text-stone-100 placeholder:text-slate-300 min-w-[120px] py-1"
      />
    </div>
  );
};

export default TagInput;