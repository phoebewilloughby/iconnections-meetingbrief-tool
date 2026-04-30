'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9]">
      {/* Sidebar — never unmounts, persists across all routes */}
      <div className="no-print flex-shrink-0 h-full">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Right column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
