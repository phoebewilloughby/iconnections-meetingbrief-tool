import type { HubSpotAdapter } from './hubspot';
import type { HubSpotNote, Contact, Firm } from '@/types';
import notesData from '../../data/notes.json';
import contactsData from '../../data/contacts.json';
import firmsData from '../../data/firms.json';

const notes = notesData as HubSpotNote[];
const contacts = contactsData as Contact[];
const firms = firmsData as Firm[];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockHubSpot: HubSpotAdapter = {
  async listNotes(clientId) {
    await delay(200 + Math.random() * 200);
    return notes
      .filter(n => n.companyId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getNote(noteId) {
    await delay(150 + Math.random() * 100);
    return notes.find(n => n.id === noteId) ?? null;
  },

  async getCompany(companyId) {
    await delay(150 + Math.random() * 150);
    return firms.find(f => f.id === companyId) ?? null;
  },

  async listContacts(companyId) {
    await delay(200 + Math.random() * 150);
    return contacts.filter(c => c.companyId === companyId);
  },

  async getContact(contactId) {
    await delay(150 + Math.random() * 100);
    return contacts.find(c => c.id === contactId) ?? null;
  },
};
