'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Search, Settings, ChevronRight,
  ChevronDown, FileText, Clock, Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import firmsData from '@/data/firms.json';
import type { Firm } from '@/types';

const firms = firmsData as Firm[];
const phoebeClients = firms.filter(f => f.csmId === 'csm-phoebe');

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

function NavItem({ href, icon: Icon, label, collapsed, active, children }: NavItemProps) {
  return (
    <div>
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 py-2 rounded-lg text-sm transition-colors border-l-2',
          collapsed ? 'px-3 justify-center' : 'px-3',
          active
            ? 'border-[#6A2B7E] bg-white/10 text-white font-medium'
            : 'border-transparent text-white/60 hover:text-white hover:bg-white/8'
        )}
      >
        <Icon size={17} className="flex-shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
      {!collapsed && children}
    </div>
  );
}

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [clientsOpen, setClientsOpen] = useState(
    pathname.startsWith('/clients')
  );

  const clientMatch = pathname.match(/^\/clients\/([^/]+)/);
  const activeClientId = clientMatch?.[1] ?? null;
  const activeClient = activeClientId ? firms.find(f => f.id === activeClientId) : null;

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full transition-all duration-200 bg-[#3D1849]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 py-5 border-b border-white/10 hover:bg-white/5 transition-colors flex-shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">iC</span>
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm tracking-tight">iConnections</span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">

        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} active={isActive('/dashboard', true)} />

        <NavItem href="/clients" icon={FileText} label="Briefs" collapsed={collapsed} active={isActive('/clients') && !activeClient} />

        {/* My Clients — expandable */}
        <div>
          {collapsed ? (
            <Link
              href="/clients"
              className={cn(
                'flex items-center justify-center py-2 px-3 rounded-lg text-sm transition-colors border-l-2',
                pathname.startsWith('/clients')
                  ? 'border-[#6A2B7E] bg-white/10 text-white font-medium'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/8'
              )}
            >
              <Users size={17} />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setClientsOpen(o => !o)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors border-l-2',
                  pathname.startsWith('/clients')
                    ? 'border-[#6A2B7E] bg-white/10 text-white font-medium'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/8'
                )}
              >
                <Users size={17} className="flex-shrink-0" />
                <span className="flex-1 text-left truncate">My Clients</span>
                <ChevronDown
                  size={14}
                  className={cn('flex-shrink-0 transition-transform duration-150', clientsOpen ? 'rotate-180' : '')}
                />
              </button>

              {clientsOpen && (
                <div className="mt-1 ml-4 border-l border-white/10 pl-3 space-y-0.5">
                  {phoebeClients.slice(0, 5).map(firm => (
                    <Link
                      key={firm.id}
                      href={`/clients/${firm.id}`}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors',
                        pathname.startsWith(`/clients/${firm.id}`)
                          ? 'text-white bg-white/10'
                          : 'text-white/50 hover:text-white hover:bg-white/8'
                      )}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: firm.brandColor, fontSize: '7px' }}
                      >
                        {firm.initials}
                      </div>
                      <span className="truncate">{firm.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/clients"
                    className="block px-2 py-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Client sub-nav when inside a client page */}
        {!collapsed && activeClient && (
          <div className="pt-2">
            <div className="mx-1 border-t border-white/10 mb-2" />
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Current client</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 mb-1">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: activeClient.brandColor, fontSize: '8px' }}
              >
                {activeClient.initials}
              </div>
              <span className="text-white text-xs font-medium truncate">{activeClient.name}</span>
            </div>
            <div className="ml-4 border-l border-white/10 pl-3 space-y-0.5">
              {[
                { label: 'Overview',        href: `/clients/${activeClientId}`,             exact: true },
                { label: 'Previous Calls',  href: `/clients/${activeClientId}?tab=calls` },
                { label: 'Notes',           href: `/clients/${activeClientId}?tab=notes` },
                { label: 'Company Details', href: `/clients/${activeClientId}?tab=details` },
              ].map(item => {
                const active = item.exact
                  ? pathname === `/clients/${activeClientId}` && !pathname.includes('/calls/') && !pathname.includes('/notes/')
                  : false;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-2 py-1.5 rounded text-xs transition-colors',
                      active ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/8'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <NavItem href="/search" icon={Search} label="Search" collapsed={collapsed} active={isActive('/search', true)} />

        <NavItem href="/search" icon={Clock} label="Recent" collapsed={collapsed} active={false} />

      </nav>

      {/* Bottom section — user + settings */}
      <div className="px-2 pb-3 border-t border-white/10 pt-3 flex-shrink-0 space-y-0.5">
        <NavItem href="/settings" icon={Settings} label="Settings" collapsed={collapsed} active={isActive('/settings', true)} />

        {/* User identity */}
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors mt-1',
            collapsed ? 'justify-center' : ''
          )}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: '#6A2B7E' }}
          >
            PW
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Phoebe Willoughby</p>
              <p className="text-[10px] text-white/40 truncate">Senior CSM</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
