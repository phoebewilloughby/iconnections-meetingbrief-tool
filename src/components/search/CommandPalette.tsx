'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, User, X } from 'lucide-react';
import { searchAll, type SearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RECENTS_KEY = 'ic_recent_searches';

function getRecents(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function addRecent(query: string) {
  const recents = getRecents().filter(r => r !== query);
  localStorage.setItem(RECENTS_KEY, JSON.stringify([query, ...recents].slice(0, 5)));
}

export function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setRecents(getRecents());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchAll(query));
      setSelected(0);
    } else {
      setResults([]);
    }
  }, [query]);

  function navigate(href: string, label: string) {
    addRecent(label);
    router.push(href);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      navigate(results[selected].href, results[selected].label);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 no-print"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5E5]">
          <Search size={18} className="text-[#6B6B6B] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search clients, firms, or contacts…"
            className="flex-1 text-sm outline-none text-[#0A0A0A] placeholder:text-[#6B6B6B] bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#6B6B6B] hover:text-[#0A0A0A]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query && recents.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">Recent searches</p>
              {recents.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(r)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm text-[#2A2A2A] hover:bg-[#F5F0F7] transition-colors"
                >
                  <Search size={14} className="text-[#6B6B6B]" />
                  {r}
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="px-2 py-2">
              {results.map((result, i) => (
                <button
                  key={result.id}
                  onClick={() => navigate(result.href, result.label)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors',
                    i === selected ? 'bg-[#F5F0F7]' : 'hover:bg-[#F5F0F7]/60'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ backgroundColor: result.brandColor || '#6A2B7E', fontSize: '11px' }}
                  >
                    {result.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0A0A0A] truncate">{result.label}</div>
                    <div className="text-xs text-[#6B6B6B] truncate">{result.sublabel}</div>
                  </div>
                  <div className="flex-shrink-0">
                    {result.type === 'client'
                      ? <Building2 size={14} className="text-[#B89BC4]" />
                      : <User size={14} className="text-[#B89BC4]" />
                    }
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[#6B6B6B]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!query && recents.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-[#6B6B6B]">Start typing to search across 12 clients and 45 contacts</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-[#E5E5E5] flex items-center gap-4 text-xs text-[#6B6B6B]">
          <span><kbd className="font-mono bg-[#F5F0F7] px-1 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-[#F5F0F7] px-1 rounded">↵</kbd> select</span>
          <span><kbd className="font-mono bg-[#F5F0F7] px-1 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
