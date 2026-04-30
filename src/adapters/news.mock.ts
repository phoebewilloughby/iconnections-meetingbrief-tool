import type { NewsAdapter } from './news';
import type { NewsItem } from '@/types';
import newsData from '../../data/news.json';

const allNews = newsData as NewsItem[];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockNews: NewsAdapter = {
  async getRecentNews(firmId, days) {
    await delay(200 + Math.random() * 200);
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return allNews.filter(n =>
      n.firmId === firmId && new Date(n.publishedAt) >= cutoff
    ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  async getNewsById(id) {
    await delay(100 + Math.random() * 100);
    return allNews.find(n => n.id === id) ?? null;
  },
};
