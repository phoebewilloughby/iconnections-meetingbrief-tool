import type { GongCall, GongTranscript } from '@/types';

export interface GongAdapter {
  listCalls(params: { clientId: string; limit?: number }): Promise<GongCall[]>;
  getCall(callId: string): Promise<GongCall | null>;
  getTranscript(callId: string): Promise<GongTranscript | null>;
  search(query: string): Promise<GongCall[]>;
}
