'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 px-6 py-3 bg-white border-b border-[#E5E5E5] text-xs">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-[#6B6B6B]" />}
            {crumb.href && !isLast ? (
              <Link href={crumb.href} className="text-[#6A2B7E] hover:underline font-medium">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-[#0A0A0A] font-medium' : 'text-[#6B6B6B]'}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
