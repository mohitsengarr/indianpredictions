import { useState, useEffect } from 'react';

export interface BreakingNewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedDate: string;
  fetchedAt: string;
}

let cached: BreakingNewsItem[] | null = null;
let cacheTs = 0;
const TTL = 5 * 60 * 1000;

export function useBreakingNews(limit = 8) {
  const [news, setNews] = useState<BreakingNewsItem[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached && Date.now() - cacheTs < TTL) {
      setNews(cached.slice(0, limit));
      setLoading(false);
      return;
    }

    // Cache-bust every 5 minutes so CDN can't serve stale news
    const bust = Math.floor(Date.now() / (5 * 60 * 1000));
    fetch(`/data/breaking-news.json?v=${bust}`, { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: BreakingNewsItem[]) => {
        // Only show news from last 48 hours
        const cutoff = Date.now() - 48 * 60 * 60 * 1000;
        const fresh = data.filter(n => new Date(n.fetchedAt).getTime() > cutoff);
        cached = fresh;
        cacheTs = Date.now();
        setNews(fresh.slice(0, limit));
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { news, loading };
}
