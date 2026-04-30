'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Search, Building2, User } from 'lucide-react';
import { searchAll, getAllFirms, type SearchResult } from '@/lib/search';
import firmsData from '@/data/firms.json';
import type { Firm } from '@/types';

const firms = firmsData as Firm[];

function SearchContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const results = query.trim() ? searchAll(query) : [];

  const suggestions = firms.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight mb-6">Search</h1>

      {/* Search input */}
      <div className="flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 mb-6 focus-within:border-[#B89BC4] transition-colors">
        <Search size={18} className="text-[#6B6B6B]" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search clients, firms, or contacts…"
          className="flex-1 text-sm outline-none text-[#0A0A0A] placeholder:text-[#6B6B6B] bg-transparent"
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs font-mono bg-[#F5F0F7] border border-[#E5E5E5] rounded px-1.5 py-0.5 text-[#6B6B6B]">
          ⌘K
        </kbd>
      </div>

      {/* Results */}
      {query.trim() && results.length > 0 && (
        <div className="space-y-1">
          {results.map((result: SearchResult) => (
            <Link
              key={result.id}
              href={result.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F0F7]/60 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ backgroundColor: result.brandColor || '#6A2B7E', fontSize: '11px' }}
              >
                {result.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#0A0A0A]">{result.label}</div>
                <div className="text-xs text-[#6B6B6B]">{result.sublabel}</div>
              </div>
              {result.type === 'client'
                ? <Building2 size={14} className="text-[#B89BC4]" />
                : <User size={14} className="text-[#B89BC4]" />
              }
            </Link>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6B6B6B]">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {!query.trim() && (
        <>
          <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Suggested</p>
          <div className="space-y-1">
            {suggestions.map(firm => (
              <Link
                key={firm.id}
                href={`/clients/${firm.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F0F7]/60 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: firm.brandColor, fontSize: '11px' }}
                >
                  {firm.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0A0A0A]">{firm.name}</div>
                  <div className="text-xs text-[#6B6B6B]">{firm.subtype} · {firm.location}</div>
                </div>
                <Building2 size={14} className="text-[#B89BC4]" />
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#6B6B6B] text-center">
            Tip: Use <kbd className="font-mono bg-[#F5F0F7] px-1.5 py-0.5 rounded border border-[#E5E5E5]">⌘K</kbd> from any page for instant search
          </p>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-[#6B6B6B]">Loading…</div>}>
        <SearchContent />
      </Suspense>
    </AppShell>
  );
}
