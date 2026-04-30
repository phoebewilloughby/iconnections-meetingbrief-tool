'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RefreshCw, CalendarPlus, FileEdit, ExternalLink, ChevronRight, TrendingUp, TrendingDown, Minus, ArrowUpRight, FileText, Phone } from 'lucide-react';
import { adapters } from '@/adapters';
import { generateBrief } from '@/lib/brief-generator';
import { shortDate, relativeDate, formatDuration, formatCurrency } from '@/lib/formatters';
import { getFirmById, getContactsByFirm } from '@/lib/search';
import firmsData from '@/data/firms.json';
import subscriptionsData from '@/data/subscriptions.json';
import healthData from '@/data/health.json';
import briefsData from '@/data/briefs.json';
import newsData from '@/data/news.json';
import notesData from '@/data/notes.json';
import csmData from '@/data/csms.json';
import activityData from '@/data/activity.json';
import connectionsData from '@/data/connections.json';
import eventsData from '@/data/events.json';
import type { Firm, GongCall, HubSpotNote, BriefOutput, HealthScore, NewsItem, CSM, Subscription } from '@/types';
import { cn } from '@/lib/utils';

// Recharts sparkline
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

const allFirms = firmsData as Firm[];
const subscriptions = subscriptionsData as Subscription[];
const health = healthData as Record<string, HealthScore>;
const briefs = briefsData as Record<string, BriefOutput>;
const allNews = newsData as NewsItem[];
const allNotes = notesData as HubSpotNote[];
const csms = csmData as CSM[];
const allActivity = activityData as Record<string, { logins: { date: string; count: number }[] }>;
const allConnections = connectionsData as Record<string, { counterpartyName: string; introducedAt: string }[]>;

interface EventAttendanceRaw {
  eventId: string;
  eventName: string;
  date: string;
  attendances: { clientId: string; attendeesFromFirm: string[]; meetingsTaken: number }[];
}
const allEvents = eventsData as EventAttendanceRaw[];

type Tab = 'overview' | 'calls' | 'notes' | 'details';

function SentimentDot({ sentiment }: { sentiment: string }) {
  const map: Record<string, string> = { positive: '#4A7C59', neutral: '#C19A4A', negative: '#B5564E' };
  return <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: map[sentiment] ?? '#6B6B6B' }} />;
}

function HealthBadge({ band }: { band: string }) {
  const map: Record<string, { label: string; className: string }> = {
    healthy:  { label: 'Healthy',  className: 'health-healthy' },
    watch:    { label: 'Watch',    className: 'health-watch' },
    'at-risk':{ label: 'At Risk',  className: 'health-at-risk' },
  };
  const { label, className } = map[band] ?? map.healthy;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{label}</span>;
}

function Delta({ value }: { value: string }) {
  const isPos = value.startsWith('+');
  const isNeg = value.startsWith('-');
  return (
    <span className={cn('text-xs font-medium flex items-center gap-0.5', isPos ? 'text-[#4A7C59]' : isNeg ? 'text-[#B5564E]' : 'text-[#6B6B6B]')}>
      {isPos ? <TrendingUp size={10} /> : isNeg ? <TrendingDown size={10} /> : <Minus size={10} />}
      {value}
    </span>
  );
}

// Tab components
function OverviewTab({ firm, brief, calls, notes }: { firm: Firm; brief: BriefOutput; calls: GongCall[]; notes: HubSpotNote[] }) {
  const firmNews = allNews.filter(n => brief.newsItems.includes(n.id));
  const briefNotes = allNotes.filter(n => brief.recentNotes.includes(n.id));

  const loginData = (allActivity[firm.id]?.logins ?? [])
    .slice(-14)
    .map(d => ({ date: d.date.slice(5), value: d.count }));

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      {/* Section A — Talking Points */}
      <div>
        <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Talking Points</h3>
        <div className="space-y-3">
          {brief.talkingPoints.map((tp, i) => (
            <div key={i} className="bg-white rounded-xl p-5 talking-point-card border border-[#E5E5E5]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#F5F0F7] flex items-center justify-center text-xs font-semibold text-[#6A2B7E] flex-shrink-0 mt-0.5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A0A0A] leading-snug">{tp.headline}</p>
                    <p className="text-sm text-[#2A2A2A] mt-1.5 leading-relaxed">{tp.rationale}</p>
                  </div>
                </div>
                <Link
                  href={tp.source.type === 'call' ? `/clients/${firm.id}/calls/${tp.source.id}` : tp.source.type === 'note' ? `/clients/${firm.id}/notes/${tp.source.id}` : '#'}
                  className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[#F5F0F7] text-[#6A2B7E] hover:bg-[#E8DFF0] transition-colors whitespace-nowrap"
                >
                  {tp.source.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B — Last Touchpoint */}
      <div>
        <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Last Touchpoint</h3>
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[#0A0A0A]">
              You spoke {relativeDate(brief.lastTouchpoint.date)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0F7] text-[#6A2B7E] capitalize">
              {brief.lastTouchpoint.type}
            </span>
          </div>
          <ul className="space-y-1.5 mb-4">
            {brief.lastTouchpoint.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#2A2A2A]">
                <span className="w-1 h-1 rounded-full bg-[#B89BC4] mt-2 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          {brief.lastTouchpoint.openFollowUps.length > 0 && (
            <div className="border-t border-[#E5E5E5] pt-3">
              <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">Open follow-ups</p>
              <ul className="space-y-1">
                {brief.lastTouchpoint.openFollowUps.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#2A2A2A]">
                    <span className="w-3 h-3 rounded border border-[#E5E5E5] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {brief.lastTouchpoint.sourceCallId && (
            <Link
              href={`/clients/${firm.id}/calls/${brief.lastTouchpoint.sourceCallId}`}
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#6A2B7E] hover:underline"
            >
              View full call <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Section C — Platform Activity */}
      <div>
        <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Platform Activity (last 30 days)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Logins',             value: brief.platformActivity.logins,            delta: brief.platformActivity.loginDelta },
            { label: 'Meetings Attended',   value: brief.platformActivity.meetingsAttended,  delta: brief.platformActivity.meetingsDelta },
            { label: 'Meetings Requested',  value: brief.platformActivity.meetingsRequested, delta: brief.platformActivity.meetingsDelta },
            { label: 'Profile Views',       value: brief.platformActivity.profileViews,      delta: brief.platformActivity.profileViewsDelta },
          ].map(tile => (
            <div key={tile.label} className="bg-white rounded-xl p-4 border border-[#E5E5E5]">
              <div className="text-2xl font-bold text-[#0A0A0A] tracking-tight">{tile.value}</div>
              <Delta value={tile.delta} />
              <div className="text-xs text-[#6B6B6B] mt-1">{tile.label}</div>
            </div>
          ))}
        </div>
        {loginData.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5]">
            <p className="text-xs font-medium text-[#6B6B6B] mb-3">Login activity</p>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={loginData}>
                <defs>
                  <linearGradient id="lgActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6A2B7E" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6A2B7E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#6A2B7E" strokeWidth={1.5} fill="url(#lgActivity)" dot={false} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <div className="bg-white border border-[#E5E5E5] rounded-lg px-2 py-1 text-xs shadow-sm">
                        {payload[0].value} logins
                      </div>
                    ) : null
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Section D — News */}
      {firmNews.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Firm in the News</h3>
          <div className="space-y-2">
            {firmNews.map(n => (
              <div key={n.id} className="bg-white rounded-xl p-4 border border-[#E5E5E5] hover:border-[#B89BC4] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#6A2B7E]">{n.source}</span>
                      <span className="text-xs text-[#6B6B6B] mono">{shortDate(n.publishedAt)}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0A0A0A] leading-snug">{n.headline}</p>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">{n.summary}</p>
                  </div>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#6A2B7E] flex-shrink-0 mt-1">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section E — Recent Notes */}
      {briefNotes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Recent Notes</h3>
          <div className="space-y-2">
            {briefNotes.map(note => {
              const author = csms.find(c => c.id === note.authorId);
              return (
                <Link
                  key={note.id}
                  href={`/clients/${firm.id}/notes/${note.id}`}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#E5E5E5] hover:border-[#B89BC4] transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ backgroundColor: author?.avatarColor ?? '#6B6B6B', fontSize: '10px' }}
                  >
                    {author?.initials ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-[#0A0A0A]">{author?.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#F5F0F7] text-[#6A2B7E] capitalize">{note.type.replace('_', ' ')}</span>
                      <span className="text-xs text-[#6B6B6B] mono">{shortDate(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed">
                      {note.content.replace(/#{1,3}\s/g, '').replace(/\*\*/g, '').slice(0, 120)}…
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href={`/clients/${firm.id}?tab=notes`} className="mt-2 inline-flex items-center gap-1 text-xs text-[#6A2B7E] hover:underline">
            View all notes <ChevronRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}

function CallsTab({ firm, calls }: { firm: Firm; calls: GongCall[] }) {
  return (
    <div className="py-6 space-y-3">
      {calls.length === 0 && (
        <div className="text-center py-12 text-[#6B6B6B] text-sm">No calls recorded yet.</div>
      )}
      {calls.map(call => (
        <Link
          key={call.id}
          href={`/clients/${firm.id}/calls/${call.id}`}
          className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[#E5E5E5] hover:border-[#B89BC4] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-[#0A0A0A]">{call.title}</p>
              <SentimentDot sentiment={call.sentiment} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#6B6B6B]">
              <span className="mono">{shortDate(call.scheduledStart)}</span>
              <span>·</span>
              <span>{formatDuration(call.duration)}</span>
              <span>·</span>
              <span>{call.participants.filter(p => p.affiliation === 'external').length} external</span>
            </div>
            <p className="mt-2 text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed">{call.aiSummary}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {call.topics.slice(0, 3).map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0F7] text-[#6A2B7E]">{t}</span>
              ))}
            </div>
          </div>
          <ChevronRight size={16} className="text-[#6B6B6B] flex-shrink-0 mt-1" />
        </Link>
      ))}
    </div>
  );
}

function NotesTab({ firm, notes }: { firm: Firm; notes: HubSpotNote[] }) {
  return (
    <div className="py-6 space-y-3">
      {notes.length === 0 && (
        <div className="text-center py-12 text-[#6B6B6B] text-sm">No notes recorded yet.</div>
      )}
      {notes.map(note => {
        const author = csms.find(c => c.id === note.authorId);
        return (
          <Link
            key={note.id}
            href={`/clients/${firm.id}/notes/${note.id}`}
            className="block bg-white rounded-xl border border-[#E5E5E5] hover:border-[#B89BC4] transition-colors overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#F5F0F7]">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ backgroundColor: author?.avatarColor ?? '#6B6B6B', fontSize: '10px' }}
              >
                {author?.initials ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-[#0A0A0A]">{author?.name}</span>
                <span className="text-xs text-[#6B6B6B] ml-2">{relativeDate(note.createdAt)}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0F7] text-[#6A2B7E] capitalize">
                {note.type.replace('_', ' ')}
              </span>
            </div>
            <div className="px-5 py-3 text-xs text-[#2A2A2A] leading-relaxed line-clamp-3">
              {note.content.replace(/#{1,3}\s/g, '').replace(/\*\*/g, '').replace(/\n/g, ' ')}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function DetailsTab({ firm }: { firm: Firm }) {
  const sub = subscriptions.find(s => s.clientId === firm.id);
  const h = health[firm.id];
  const contacts = getContactsByFirm(firm.id);

  // 90-day login chart
  const loginData = (allActivity[firm.id]?.logins ?? []).slice(-30).map(d => ({ date: d.date.slice(5), v: d.count }));
  const connections = allConnections[firm.id] ?? [];
  const firmEvents = allEvents.flatMap(e => e.attendances.filter(a => a.clientId === firm.id).map(a => ({ ...e, ...a })));

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Left — 60% */}
      <div className="md:col-span-3 space-y-4">
        {/* Firm card */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ backgroundColor: firm.brandColor, fontSize: '14px' }}
            >
              {firm.initials}
            </div>
            <div>
              <h3 className="font-semibold text-[#0A0A0A]">{firm.name}</h3>
              <p className="text-sm text-[#6B6B6B]">{firm.subtype} · {firm.aum}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[
              ['Location', firm.location],
              ['Founded', String(firm.founded)],
              ['Employees', String(firm.employees)],
              ['Strategy', firm.primaryStrategy],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-[#6B6B6B]">{k}</p>
                <p className="font-medium text-[#0A0A0A] mono text-xs">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#2A2A2A] leading-relaxed">{firm.description}</p>
        </div>

        {/* Key contacts */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
          <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Key Contacts</h4>
          <div className="space-y-2">
            {contacts.map(contact => (
              <Link
                key={contact.id}
                href={`/contacts/${contact.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F0F7] transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: firm.brandColor, fontSize: '10px' }}
                >
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A0A0A]">{contact.firstName} {contact.lastName}</p>
                  <p className="text-xs text-[#6B6B6B]">{contact.title}</p>
                </div>
                <ChevronRight size={14} className="text-[#6B6B6B] flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right — 40% */}
      <div className="md:col-span-2 space-y-4">
        {/* Subscription */}
        {sub && (
          <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
            <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Subscription</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Tier</span>
                <span className="font-semibold text-[#6A2B7E]">{sub.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">ARR</span>
                <span className="font-medium mono">{formatCurrency(sub.arr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Start</span>
                <span className="mono text-xs">{shortDate(sub.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Renewal</span>
                <span className="mono text-xs">{shortDate(sub.renewalDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B6B6B]">Status</span>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                  sub.status === 'Active' ? 'health-healthy' : sub.status === 'At Risk' ? 'health-at-risk' : 'bg-[#F5F5F5] text-[#6B6B6B]'
                )}>{sub.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Health score */}
        {h && (
          <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Health Score</h4>
              <HealthBadge band={h.band} />
            </div>
            <div className="text-3xl font-bold text-[#0A0A0A] mb-2">{h.score}</div>
            <div className="space-y-1">
              {h.reasons.map((r, i) => (
                <p key={i} className="text-xs text-[#6B6B6B] flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#B89BC4] mt-1.5 flex-shrink-0" />
                  {r}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Events attended */}
        {firmEvents.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
            <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Events Attended</h4>
            <div className="space-y-2">
              {firmEvents.map((e: any, i: number) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-[#0A0A0A]">{e.eventName}</p>
                    <p className="text-xs text-[#6B6B6B]">{e.meetingsTaken} meetings</p>
                  </div>
                  <span className="text-xs mono text-[#6B6B6B]">{shortDate(e.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connections */}
        {connections.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
            <h4 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Platform Connections</h4>
            <div className="space-y-2">
              {connections.slice(0, 5).map((conn: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#0A0A0A]">{conn.counterpartyName}</span>
                  <span className="text-xs text-[#6B6B6B] mono">{shortDate(conn.introducedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientProfilePage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as Tab) ?? 'overview';

  const firm = allFirms.find(f => f.id === clientId);
  const sub = subscriptions.find(s => s.clientId === clientId);
  const h = health[clientId];
  const contacts = getContactsByFirm(clientId);
  const primaryContact = contacts[0];

  const [calls, setCalls] = useState<GongCall[]>([]);
  const [notes, setNotes] = useState<HubSpotNote[]>([]);
  const [brief, setBrief] = useState<BriefOutput | null>(briefs[clientId] ?? null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(tab as Tab);

  useEffect(() => {
    if (!clientId) return;
    adapters.gong.listCalls({ clientId }).then(setCalls);
    adapters.hubspot.listNotes(clientId).then(setNotes);
  }, [clientId]);

  if (!firm) {
    return (
      <AppShell>
        <div className="p-8 text-center text-[#6B6B6B]">Client not found.</div>
      </AppShell>
    );
  }

  const csm = csmData.find((c: CSM) => c.id === firm.csmId) as CSM | undefined;
  const latestCall = calls[0];

  async function handleRefreshBrief() {
    setLoadingBrief(true);
    try {
      const fresh = await generateBrief({ clientId, meetingDate: new Date() });
      setBrief(fresh);
    } finally {
      setLoadingBrief(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'calls',    label: `Previous Calls${calls.length ? ` (${calls.length})` : ''}` },
    { id: 'notes',    label: `Notes${notes.length ? ` (${notes.length})` : ''}` },
    { id: 'details',  label: 'Company Details' },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-[#FAFAF9]/90 backdrop-blur-sm border-b border-[#E5E5E5] -mx-6 px-6 pt-6 pb-0 no-print">
          {/* Hero band */}
          <div className="hero-gradient rounded-2xl px-6 py-5 mb-0 text-white flex items-start gap-4 flex-wrap">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', fontSize: '16px', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {firm.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight">{firm.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-white/80">{firm.type}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{firm.aum}</span>
              </div>
              {primaryContact && (
                <Link href={`/contacts/${primaryContact.id}`} className="mt-1 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                    {primaryContact.firstName[0]}{primaryContact.lastName[0]}
                  </span>
                  {primaryContact.firstName} {primaryContact.lastName} · {primaryContact.title}
                  <ChevronRight size={12} />
                </Link>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshBrief}
                  disabled={loadingBrief}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#6A2B7E] text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-60"
                >
                  <RefreshCw size={12} className={loadingBrief ? 'animate-spin' : ''} />
                  {loadingBrief ? 'Generating…' : 'Refresh Brief'}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors">
                  <CalendarPlus size={12} />
                  Schedule
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors">
                  <FileEdit size={12} />
                  Add Note
                </button>
              </div>
              {latestCall && (
                <Link
                  href={`/clients/${firm.id}/calls/${latestCall.id}`}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Last call: {relativeDate(latestCall.scheduledStart)} ›
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 mt-4">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium transition-colors border-b-2',
                  activeTab === t.id
                    ? 'border-[#6A2B7E] text-[#6A2B7E]'
                    : 'border-transparent text-[#6B6B6B] hover:text-[#0A0A0A]'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && brief && (
          <OverviewTab firm={firm} brief={brief} calls={calls} notes={notes} />
        )}
        {activeTab === 'overview' && !brief && (
          <div className="py-12 text-center text-[#6B6B6B] text-sm">No brief available. Click &ldquo;Refresh Brief&rdquo; to generate one.</div>
        )}
        {activeTab === 'calls' && <CallsTab firm={firm} calls={calls} />}
        {activeTab === 'notes' && <NotesTab firm={firm} notes={notes} />}
        {activeTab === 'details' && <DetailsTab firm={firm} />}
      </div>
    </AppShell>
  );
}
