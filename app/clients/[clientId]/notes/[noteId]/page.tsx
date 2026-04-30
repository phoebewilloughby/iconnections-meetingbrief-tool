'use client';

import { use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import notesData from '@/data/notes.json';
import csmData from '@/data/csms.json';
import type { HubSpotNote, CSM } from '@/types';
import { shortDate, relativeDate } from '@/lib/formatters';

const notes = notesData as HubSpotNote[];
const csms = csmData as CSM[];

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-semibold text-[#0A0A0A] mt-4 first:mt-0">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-lg font-semibold text-[#0A0A0A]">{line.slice(2)}</h1>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-semibold text-[#0A0A0A] mt-3">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ') || line.match(/^\d+\. /)) {
          const text = line.replace(/^-\s/, '').replace(/^\d+\.\s/, '');
          return (
            <li key={i} className="text-sm text-[#2A2A2A] flex items-start gap-2 leading-relaxed list-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89BC4] mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            </li>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-sm text-[#2A2A2A] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        );
      })}
    </div>
  );
}

export default function NoteDetailPage({ params }: { params: Promise<{ clientId: string; noteId: string }> }) {
  const { clientId, noteId } = use(params);
  const note = notes.find(n => n.id === noteId);
  const author = csms.find(c => c.id === note?.authorId);

  if (!note) {
    return (
      <AppShell>
        <div className="p-8 text-center text-[#6B6B6B]">Note not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <div className="py-4">
          <Link href={`/clients/${clientId}?tab=notes`} className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#6A2B7E] transition-colors">
            <ChevronLeft size={16} />
            Back to notes
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {author && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: author.avatarColor, fontSize: '10px' }}
                >
                  {author.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[#0A0A0A]">{author?.name ?? 'Unknown'}</p>
                <p className="text-xs text-[#6B6B6B]">{shortDate(note.createdAt)} · {relativeDate(note.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0F7] text-[#6A2B7E] capitalize">
                {note.type.replace('_', ' ')}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-[#F5F0F7] text-[#6B6B6B] hover:text-[#6A2B7E] transition-colors">
                <Edit size={14} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-[#FFF0EF] text-[#6B6B6B] hover:text-[#B5564E] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {renderMarkdown(note.content)}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
