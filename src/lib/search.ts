import firmsData from '../../data/firms.json';
import contactsData from '../../data/contacts.json';
import type { Firm, Contact } from '@/types';

const firms = firmsData as Firm[];
const contacts = contactsData as Contact[];

export interface SearchResult {
  type: 'client' | 'contact';
  id: string;
  label: string;
  sublabel: string;
  href: string;
  firmId?: string;
  brandColor?: string;
  initials?: string;
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const firmResults: SearchResult[] = firms
    .filter(f => f.name.toLowerCase().includes(q) || f.subtype.toLowerCase().includes(q) || f.location.toLowerCase().includes(q))
    .map(f => ({
      type: 'client' as const,
      id: f.id,
      label: f.name,
      sublabel: `${f.subtype} · ${f.location}`,
      href: `/clients/${f.id}`,
      brandColor: f.brandColor,
      initials: f.initials,
    }));

  const contactResults: SearchResult[] = contacts
    .filter(c => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      return name.includes(q) || c.email.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    })
    .map(c => {
      const firm = firms.find(f => f.id === c.companyId);
      return {
        type: 'contact' as const,
        id: c.id,
        label: `${c.firstName} ${c.lastName}`,
        sublabel: `${c.title} · ${firm?.name ?? ''}`,
        href: `/contacts/${c.id}`,
        firmId: c.companyId,
        brandColor: firm?.brandColor,
        initials: `${c.firstName[0]}${c.lastName[0]}`,
      };
    });

  return [...firmResults, ...contactResults].slice(0, 12);
}

export function getAllFirms(): Firm[] {
  return firms;
}

export function getFirmById(id: string): Firm | undefined {
  return firms.find(f => f.id === id);
}

export function getContactsByFirm(firmId: string): Contact[] {
  return contacts.filter(c => c.companyId === firmId);
}

export function getContactById(id: string): Contact | undefined {
  return contacts.find(c => c.id === id);
}
