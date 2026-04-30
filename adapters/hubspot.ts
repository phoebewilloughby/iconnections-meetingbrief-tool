import type { HubSpotNote, Contact, Firm } from '@/types';

export interface HubSpotAdapter {
  listNotes(clientId: string): Promise<HubSpotNote[]>;
  getNote(noteId: string): Promise<HubSpotNote | null>;
  getCompany(companyId: string): Promise<Firm | null>;
  listContacts(companyId: string): Promise<Contact[]>;
  getContact(contactId: string): Promise<Contact | null>;
}
