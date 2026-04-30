import { mockGong } from './gong.mock';
import { mockHubSpot } from './hubspot.mock';
import { mockCopilot } from './copilot.mock';
import { mockNews } from './news.mock';

// Production swap: replace any mock with a real adapter by changing one file per source.
export const adapters = {
  gong: mockGong,
  hubspot: mockHubSpot,
  copilot: mockCopilot,
  news: mockNews,
};
