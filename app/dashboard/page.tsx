import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Calendar, Clock, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import { shortDate, greetingTime, formatDuration } from '@/lib/formatters';
import firmsData from '@/data/firms.json';
import callsData from '@/data/calls.json';
import healthData from '@/data/health.json';
import subscriptionsData from '@/data/subscriptions.json';
import type { Firm, GongCall, HealthScore, Subscription } from '@/types';

const firms = firmsData as Firm[];
const calls = callsData as GongCall[];
const health = healthData as Record<string, HealthScore>;
const subscriptions = subscriptionsData as Subscription[];

const phoebeClients = firms.filter(f => f.csmId === 'csm-phoebe');

// Today's meetings: most recent calls per Phoebe client
const todaysMeetings = [
  { firmId: 'firm-aldercrest', contactName: 'Sarah Lin', contactTitle: 'Head of IR', time: '10:00 AM', type: 'Q2 Check-in' },
  { firmId: 'firm-pinehurst',  contactName: 'Robert Haines', contactTitle: 'CIO', time: '2:00 PM', type: 'Quarterly Review' },
  { firmId: 'firm-vesper',     contactName: 'Helena Bauer', contactTitle: 'Head of IR', time: '4:30 PM', type: 'Renewal Call' },
];

const recentlyViewed = phoebeClients.slice(0, 5);

const suggestedOutreach = [
  { firm: firms.find(f => f.id === 'firm-mendoza')!, reason: 'Three match-quality complaints — at risk of churning to Albourne' },
  { firm: firms.find(f => f.id === 'firm-quartzlight')!, reason: 'Profile views recovering but subscription renewal under budget pressure' },
  { firm: firms.find(f => f.id === 'firm-cobalt')!, reason: 'Standard tier quota is a bottleneck — Premium upgrade proposal pending board' },
];

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Enterprise: 'bg-[#F5F0F7] text-[#6A2B7E]',
    Premium:    'bg-[#EFF5F0] text-[#2E5E3A]',
    Standard:   'bg-[#F5F5F5] text-[#6B6B6B]',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[tier] ?? colors.Standard}`}>
      {tier}
    </span>
  );
}

function HealthDot({ band }: { band: string }) {
  const colors: Record<string, string> = { healthy: '#4A7C59', watch: '#C19A4A', 'at-risk': '#B5564E' };
  return <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: colors[band] ?? '#6B6B6B' }} />;
}

export default function DashboardPage() {
  const greeting = greetingTime();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero greeting */}
        <div className="hero-gradient rounded-2xl px-8 py-7 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{greeting}, Phoebe.</h1>
              <p className="text-white/70 mt-1 text-sm">{today}</p>
              <p className="mt-3 text-white/90">You have {todaysMeetings.length} meetings today and 2 follow-ups due.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-sm">
              <Calendar size={15} className="text-white/70" />
              <span className="text-white/80">{todaysMeetings.length} meetings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's meetings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#0A0A0A]">Today&rsquo;s Meetings</h2>
              <Link href="/clients" className="text-xs text-[#6A2B7E] hover:underline flex items-center gap-1">
                View all clients <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {todaysMeetings.map((m) => {
                const firm = firms.find(f => f.id === m.firmId)!;
                const sub = subscriptions.find(s => s.clientId === m.firmId);
                return (
                  <div key={m.firmId} className="bg-white rounded-2xl p-5 border border-[#E5E5E5] card-hover flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: firm.brandColor }}
                      >
                        {firm.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[#0A0A0A] truncate">{firm.name}</div>
                        <div className="text-xs text-[#6B6B6B]">{m.contactName} · {m.contactTitle}</div>
                      </div>
                      {sub && <TierBadge tier={sub.tier} />}
                    </div>

                    {/* Meeting info */}
                    <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{m.time}</span>
                      </div>
                      <span className="text-[#E5E5E5]">·</span>
                      <span>{m.type}</span>
                    </div>

                    <Link
                      href={`/clients/${m.firmId}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium bg-[#6A2B7E] text-white hover:bg-[#5a2470] transition-colors"
                    >
                      Open Brief
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested outreach */}
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A] mb-4">Suggested Outreach</h2>
            <div className="space-y-3">
              {suggestedOutreach.map(({ firm, reason }) => {
                const h = health[firm.id];
                const sub = subscriptions.find(s => s.clientId === firm.id);
                return (
                  <Link
                    key={firm.id}
                    href={`/clients/${firm.id}`}
                    className="block bg-white rounded-2xl p-4 border border-[#E5E5E5] card-hover"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                        style={{ backgroundColor: firm.brandColor, fontSize: '10px' }}
                      >
                        {firm.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#0A0A0A] truncate">{firm.name}</span>
                          {h && <HealthDot band={h.band} />}
                        </div>
                        <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{reason}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recently viewed */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-[#0A0A0A] mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {recentlyViewed.map(firm => {
              const latestCall = calls
                .filter(c => c.clientId === firm.id)
                .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())[0];
              const h = health[firm.id];

              return (
                <Link
                  key={firm.id}
                  href={`/clients/${firm.id}`}
                  className="bg-white rounded-2xl p-4 border border-[#E5E5E5] card-hover flex flex-col items-center gap-2 text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: firm.brandColor, fontSize: '11px' }}
                  >
                    {firm.initials}
                  </div>
                  <div className="text-xs font-medium text-[#0A0A0A] leading-tight">{firm.name}</div>
                  {latestCall && (
                    <div className="text-xs text-[#6B6B6B]">
                      Last call {shortDate(latestCall.scheduledStart)}
                    </div>
                  )}
                  {h && <HealthDot band={h.band} />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer attribution */}
        <div className="mt-12 pt-6 border-t border-[#E5E5E5] text-center">
          <p className="text-xs text-[#6B6B6B]">
            Brief generation powered by Gong, HubSpot, Copilot — last sync 4 minutes ago
          </p>
        </div>
      </div>
    </AppShell>
  );
}
