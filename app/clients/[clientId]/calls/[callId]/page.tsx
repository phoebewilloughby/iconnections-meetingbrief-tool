'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ChevronLeft, Clock, Users, ChevronDown, ChevronRight as ChevronR } from 'lucide-react';
import { adapters } from '@/adapters';
import { shortDate, formatDuration } from '@/lib/formatters';
import type { GongCall, GongTranscript } from '@/types';
import { cn } from '@/lib/utils';

function SentimentBadge({ s }: { s: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    positive: { label: 'Positive', bg: '#EFF5F0', text: '#2E5E3A' },
    neutral:  { label: 'Neutral',  bg: '#FFF8EC', text: '#7A5E1A' },
    negative: { label: 'Negative', bg: '#FFF0EF', text: '#7A3028' },
  };
  const { label, bg, text } = map[s] ?? map.neutral;
  return (
    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: bg, color: text }}>
      {label}
    </span>
  );
}

export default function CallDetailPage({ params }: { params: Promise<{ clientId: string; callId: string }> }) {
  const { clientId, callId } = use(params);
  const [call, setCall] = useState<GongCall | null>(null);
  const [transcript, setTranscript] = useState<GongTranscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      adapters.gong.getCall(callId),
      adapters.gong.getTranscript(callId),
    ]).then(([c, t]) => {
      setCall(c);
      setTranscript(t);
      setLoading(false);
    });
  }, [callId]);

  if (loading) {
    return (
      <AppShell>
        <div className="p-8 text-center text-[#6B6B6B]">
          <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            <div className="h-8 bg-[#E5E5E5] rounded-xl" />
            <div className="h-4 bg-[#E5E5E5] rounded w-2/3" />
            <div className="h-32 bg-[#E5E5E5] rounded-xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!call) {
    return (
      <AppShell>
        <div className="p-8 text-center text-[#6B6B6B]">Call not found.</div>
      </AppShell>
    );
  }

  // Group transcript by speaker for toggle
  const speakers = Array.from(new Set(transcript?.segments.map(s => s.speaker) ?? []));

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Back */}
        <div className="py-4">
          <Link href={`/clients/${clientId}`} className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#6A2B7E] transition-colors">
            <ChevronLeft size={16} />
            Back to client
          </Link>
        </div>

        {/* Decorative waveform */}
        <div className="hero-gradient rounded-2xl px-6 py-5 mb-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-lg font-semibold">{call.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                <span className="mono">{shortDate(call.scheduledStart)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {formatDuration(call.duration)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Users size={13} /> {call.participants.length}</span>
              </div>
            </div>
            <SentimentBadge s={call.sentiment} />
          </div>

          {/* Decorative waveform bars */}
          <div className="mt-4 flex items-center gap-0.5 h-8 opacity-30">
            {Array.from({ length: 80 }, (_, i) => (
              <div
                key={i}
                className="flex-1 bg-white rounded-sm"
                style={{ height: `${20 + Math.sin(i * 0.5) * 12 + Math.random() * 8}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Summary */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
              <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">AI Summary</h3>
              <p className="text-sm text-[#2A2A2A] leading-relaxed">{call.aiSummary}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {call.topics.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0F7] text-[#6A2B7E]">{t}</span>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
              <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {call.participants.map(p => (
                  <span
                    key={p.email}
                    className={cn(
                      'text-xs px-3 py-1 rounded-full font-medium',
                      p.affiliation === 'internal'
                        ? 'bg-[#F5F0F7] text-[#6A2B7E]'
                        : 'bg-[#F5F5F5] text-[#2A2A2A]'
                    )}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Transcript */}
            {transcript && transcript.segments.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                <div className="px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Full Transcript</h3>
                  <span className="text-xs text-[#6B6B6B]">{transcript.segments.length} segments</span>
                </div>
                <div>
                  {transcript.segments.map((seg, i) => {
                    const isInternal = call.participants.find(p => p.name === seg.speaker)?.affiliation === 'internal';
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex gap-3 px-5 py-4 border-b border-[#F5F0F7] last:border-b-0',
                          isInternal ? 'transcript-internal' : 'transcript-external'
                        )}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: isInternal ? '#6A2B7E' : '#5B7FB1', fontSize: '10px' }}
                        >
                          {seg.speaker.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#2A2A2A] mb-1">{seg.speaker}</p>
                          <p className="text-sm text-[#2A2A2A] leading-relaxed">{seg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {transcript && transcript.segments.length === 0 && (
              <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] text-center text-sm text-[#6B6B6B]">
                Transcript not available for this call.
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#E5E5E5]">
              <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Jump to Topic</h4>
              <div className="space-y-1">
                {call.topics.map(t => (
                  <button key={t} className="flex items-center gap-2 w-full text-left text-xs text-[#2A2A2A] px-2 py-1.5 rounded-lg hover:bg-[#F5F0F7] transition-colors">
                    <ChevronR size={12} className="text-[#B89BC4]" />
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E5E5E5]">
              <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-2">Call Info</h4>
              <div className="space-y-2 text-xs text-[#6B6B6B]">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="mono font-medium text-[#0A0A0A]">{formatDuration(call.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sentiment</span>
                  <span className="capitalize font-medium text-[#0A0A0A]">{call.sentiment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants</span>
                  <span className="font-medium text-[#0A0A0A]">{call.participants.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
