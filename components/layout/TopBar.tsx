'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/search/CommandPalette';

interface TopBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function TopBar({ collapsed, onToggle }: TopBarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="glass-nav h-14 flex items-center px-4 gap-3 z-30 no-print flex-shrink-0">
        {/* Hamburger toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#6A2B7E] hover:bg-[#F5F0F7] transition-colors flex-shrink-0"
        >
          {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Search bar */}
        <button
          onClick={() => setPaletteOpen(true)}
          className={cn(
            'flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg text-sm',
            'bg-[#F5F0F7]/60 border border-[#E5E5E5] text-[#6B6B6B]',
            'hover:border-[#B89BC4] hover:bg-[#F5F0F7] transition-colors duration-150'
          )}
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search clients, firms, or contacts…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs font-mono bg-white border border-[#E5E5E5] rounded px-1.5 py-0.5">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          {/* Notification bell */}
          <button className="relative p-1.5 rounded-lg hover:bg-[#F5F0F7] transition-colors text-[#6B6B6B] hover:text-[#2A2A2A]">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#6A2B7E] rounded-full" />
          </button>

          {/* User avatar */}
          <Link
            href="/settings"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#F5F0F7] transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: '#6A2B7E' }}>
              PW
            </div>
            <span className="text-sm font-medium text-[#2A2A2A] hidden sm:block">Phoebe</span>
            <ChevronDown size={14} className="text-[#6B6B6B] hidden sm:block" />
          </Link>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
