import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Filter } from 'lucide-react';
import firmsData from '@/data/firms.json';
import subscriptionsData from '@/data/subscriptions.json';
import healthData from '@/data/health.json';
import callsData from '@/data/calls.json';
import type { Firm, Subscription, HealthScore, GongCall } from '@/types';
import { shortDate } from '@/lib/formatters';

const firms = firmsData as Firm[];
const subscriptions = subscriptionsData as Subscription[];
const health = healthData as Record<string, HealthScore>;
const calls = callsData as GongCall[];

function HealthBadge({ band }: { band: string }) {
  const map: Record<string, { label: string; className: string }> = {
    healthy:  { label: 'Healthy',  className: 'health-healthy' },
    watch:    { label: 'Watch',    className: 'health-watch' },
    'at-risk':{ label: 'At Risk',  className: 'health-at-risk' },
  };
  const { label, className } = map[band] ?? map.healthy;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{label}</span>
  );
}

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

export default function ClientsPage() {
  const allocators = firms.filter(f => f.type === 'Allocator');
  const managers = firms.filter(f => f.type === 'Manager');

  function renderRow(firm: Firm) {
    const sub = subscriptions.find(s => s.clientId === firm.id);
    const h = health[firm.id];
    const latestCall = calls
      .filter(c => c.clientId === firm.id)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())[0];

    return (
      <Link
        key={firm.id}
        href={`/clients/${firm.id}`}
        className="flex items-center gap-4 px-6 py-4 hover:bg-[#F5F0F7]/40 transition-colors border-b border-[#E5E5E5] last:border-b-0"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
          style={{ backgroundColor: firm.brandColor, fontSize: '11px' }}
        >
          {firm.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[#0A0A0A] truncate">{firm.name}</div>
          <div className="text-xs text-[#6B6B6B]">{firm.subtype} · {firm.location} · {firm.aum}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {sub && <TierBadge tier={sub.tier} />}
          {h && <HealthBadge band={h.band} />}
        </div>
        {latestCall && (
          <div className="hidden md:block text-xs text-[#6B6B6B] mono">
            {shortDate(latestCall.scheduledStart)}
          </div>
        )}
      </Link>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight">My Clients</h1>
            <p className="text-sm text-[#6B6B6B] mt-1">{firms.length} firms across your portfolio</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E5] text-sm text-[#6B6B6B] hover:border-[#B89BC4] hover:text-[#0A0A0A] transition-colors">
            <Filter size={14} />
            Filter
          </button>
        </div>

        {/* Allocators */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Allocators ({allocators.length})</h2>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            {allocators.map(renderRow)}
          </div>
        </div>

        {/* Managers */}
        <div>
          <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Managers ({managers.length})</h2>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            {managers.map(renderRow)}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
