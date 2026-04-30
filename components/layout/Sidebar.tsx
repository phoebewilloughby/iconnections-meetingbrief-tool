'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Search, Clock, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import firmsData from '@/data/firms.json';
import type { Firm } from '@/types';

const firms = firmsData as Firm[];
const recentFirms = firms.filter(f => f.csmId === 'csm-phoebe').slice(0, 5);

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Clients', href: '/clients', icon: Users },
  { label: 'Search', href: '/search', icon: Search },
];

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      'sidebar-bg flex flex-col h-full transition-all duration-200',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-5 border-b border-white/10 hover:bg-white/5 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">iC</span>
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm tracking-tight">iConnections</span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
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

        {/* Recent */}
        {!collapsed && (
          <div className="pt-4">
            <p className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Recent</p>
            {recentFirms.map(firm => (
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
      <div className="px-2 pb-4 border-t border-white/10 pt-3">
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
