import type { GongAdapter } from './gong';
import type { GongCall, GongTranscript } from '@/types';
import callsData from '@/data/calls.json';
import transcriptsData from '@/data/transcripts.json';

const calls = callsData as GongCall[];
const transcripts = transcriptsData as Record<string, GongTranscript>;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockGong: GongAdapter = {
  async listCalls({ clientId, limit = 20 }) {
    await delay(200 + Math.random() * 200);
    return calls
      .filter(c => c.clientId === clientId)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
      .slice(0, limit);
  },

  async getCall(callId) {
    await delay(150 + Math.random() * 150);
    return calls.find(c => c.id === callId) ?? null;
  },

  async getTranscript(callId) {
    await delay(200 + Math.random() * 200);
    return transcripts[callId] ?? null;
  },

  async search(query) {
    await delay(250 + Math.random() * 200);
    const q = query.toLowerCase();
    return calls.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.aiSummary.toLowerCase().includes(q) ||
      c.topics.some(t => t.toLowerCase().includes(q))
    );
  },
};
