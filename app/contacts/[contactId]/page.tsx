'use client';

import { use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ChevronLeft, Mail, Phone, ExternalLink, Building2 } from 'lucide-react';
import contactsData from '@/data/contacts.json';
import firmsData from '@/data/firms.json';
import callsData from '@/data/calls.json';
import type { Contact, Firm, GongCall } from '@/types';
import { shortDate, formatDuration } from '@/lib/formatters';

const contacts = contactsData as Contact[];
const firms = firmsData as Firm[];
const calls = callsData as GongCall[];

export default function ContactPage({ params }: { params: Promise<{ contactId: string }> }) {
  const { contactId } = use(params);
  const contact = contacts.find(c => c.id === contactId);
  const firm = contact ? firms.find(f => f.id === contact.companyId) : null;

  if (!contact || !firm) {
    return (
      <AppShell>
        <div className="p-8 text-center text-[#6B6B6B]">Contact not found.</div>
      </AppShell>
    );
  }

  // Get calls involving this contact
  const contactCalls = calls.filter(c =>
    c.clientId === firm.id &&
    c.participants.some(p => p.email === contact.email)
  ).sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
   .slice(0, 5);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <div className="py-4">
          <Link href={`/clients/${firm.id}`} className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#6A2B7E] transition-colors">
            <ChevronLeft size={16} />
            Back to {firm.name}
          </Link>
        </div>

        {/* Contact card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ backgroundColor: firm.brandColor, fontSize: '18px' }}
            >
              {contact.firstName[0]}{contact.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-[#0A0A0A]">
                {contact.firstName} {contact.lastName}
              </h1>
              <p className="text-sm text-[#6B6B6B] mt-0.5">{contact.title}</p>
              <Link
                href={`/clients/${firm.id}`}
                className="flex items-center gap-1 text-sm text-[#6A2B7E] hover:underline mt-1"
              >
                <Building2 size={13} />
                {firm.name}
              </Link>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                <Mail size={14} className="text-[#6B6B6B]" />
                <a href={`mailto:${contact.email}`} className="hover:text-[#6A2B7E] transition-colors">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                <Phone size={14} className="text-[#6B6B6B]" />
                <span>{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
              <ExternalLink size={14} />
              <span>LinkedIn profile (placeholder)</span>
            </div>
          </div>
        </div>

        {/* Last interactions */}
        {contactCalls.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">
              Last Interactions
            </h2>
            <div className="space-y-2">
              {contactCalls.map(call => (
                <Link
                  key={call.id}
                  href={`/clients/${firm.id}/calls/${call.id}`}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#E5E5E5] hover:border-[#B89BC4] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0A0A0A]">{call.title}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 mono">
                      {shortDate(call.scheduledStart)} · {formatDuration(call.duration)}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mt-1 line-clamp-2">{call.aiSummary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
