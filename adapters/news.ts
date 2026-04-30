import type { NewsItem } from '@/types';

export interface NewsAdapter {
  getRecentNews(firmId: string, days: number): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem | null>;
}
