'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Search, Settings, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import firmsData from '@/data/firms.json';
import type { Firm } from '@/types';

const firms = firmsData as Firm[];
const phoebeClients = firms.filter(f => f.csmId === 'csm-phoebe');

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Clients', href: '/clients', icon: Users },
  { label: 'Search', href: '/search', icon: Search },
];

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  // Detect if we're inside a client page
  const clientMatch = pathname.match(/^\/clients\/([^/]+)/);
  const activeClientId = clientMatch?.[1] ?? null;
  const activeClient = activeClientId ? firms.find(f => f.id === activeClientId) : null;

  return (
    <aside className={cn(
      'sidebar-bg flex flex-col h-full transition-all duration-200',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-5 border-b border-white/10 hover:bg-white/5 transition-colors flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">iC</span>
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm tracking-tight">iConnections</span>
        )}
      </Link>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                active
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Client context: when inside a client page, show that client + siblings */}
        {!collapsed && activeClient && (
          <div className="pt-3">
            <div className="px-3 mb-1">
              <Link
                href="/clients"
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <ChevronLeft size={12} />
                <span>All Clients</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: activeClient.brandColor, fontSize: '8px' }}
              >
                {activeClient.initials}
              </div>
              <span className="text-white text-xs font-medium truncate">{activeClient.name}</span>
            </div>
            {/* Client sub-nav */}
            <div className="mt-1 ml-3 space-y-0.5 border-l border-white/10 pl-3">
              {[
                { label: 'Overview', href: `/clients/${activeClientId}`, exact: true },
                { label: 'Calls', href: `/clients/${activeClientId}?tab=calls` },
                { label: 'Notes', href: `/clients/${activeClientId}?tab=notes` },
                { label: 'Details', href: `/clients/${activeClientId}?tab=details` },
              ].map(sub => {
                const isOverview = sub.exact
                  ? pathname === `/clients/${activeClientId}` && !pathname.includes('/calls/') && !pathname.includes('/notes/')
                  : false;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      'block px-2 py-1.5 rounded text-xs transition-colors',
                      isOverview && sub.exact
                        ? 'text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent clients: show when NOT inside a specific client */}
        {!collapsed && !activeClient && (
          <div className="pt-4">
            <p className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">My Clients</p>
            {phoebeClients.slice(0, 8).map(firm => (
              <Link
                key={firm.id}
                href={`/clients/${firm.id}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors duration-150',
                  pathname === `/clients/${firm.id}`
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                )}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: firm.brandColor, fontSize: '9px' }}
                >
                  {firm.initials}
                </div>
                <span className="truncate">{firm.name}</span>
                <ChevronRight size={10} className="ml-auto flex-shrink-0 opacity-50" />
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 flex-shrink-0">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150',
            pathname === '/settings'
              ? 'bg-white/15 text-white font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
