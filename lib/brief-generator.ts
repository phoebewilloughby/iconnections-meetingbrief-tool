import type { BriefInput, BriefOutput } from '@/types';
import briefsData from '@/data/briefs.json';

const briefs = briefsData as Record<string, BriefOutput>;

export async function generateBrief(input: BriefInput): Promise<BriefOutput> {
  const delay = 600 + Math.random() * 600;
  await new Promise(resolve => setTimeout(resolve, delay));

  const brief = briefs[input.clientId];
  if (!brief) throw new Error(`No brief found for client ${input.clientId}`);

  return {
    ...brief,
    generatedAt: new Date().toISOString(),
  };
}
