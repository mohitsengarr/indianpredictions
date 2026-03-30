import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TRENDING_EVENTS, TrendingEvent } from '@/data/trending-events';

interface UseTrendingEventsResult {
  events: TrendingEvent[];
  loading: boolean;
  error: string | null;
  lastScraped: string | null;
  refetch: () => void;
}

let cachedEvents: TrendingEvent[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/** Try fetching from Supabase DB first */
async function fetchEventsFromDB(): Promise<TrendingEvent[]> {
  const { data, error } = await supabase
    .from('trending_events_cache')
    .select('data, scraped_at')
    .order('scraped_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('No cached events');

  return data.map((row) => row.data as TrendingEvent);
}

/** Fallback: fetch from local JSON file (written by Firecrawl cron) */
async function fetchEventsFromJSON(): Promise<TrendingEvent[]> {
  const res = await fetch('/data/scraped-events.json');
  if (!res.ok) throw new Error(`JSON fetch failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('Empty JSON');
  return data as TrendingEvent[];
}

/** Try DB → JSON file → hardcoded fallback */
async function fetchEvents(): Promise<TrendingEvent[]> {
  // Try Supabase DB first
  try {
    return await fetchEventsFromDB();
  } catch {
    // DB failed (table may not exist), try JSON file
  }

  // Try local JSON file written by scraper
  try {
    return await fetchEventsFromJSON();
  } catch {
    // JSON not available either
  }

  // Final fallback: hardcoded events
  return TRENDING_EVENTS;
}

async function fetchLastScraped(): Promise<string | null> {
  const { data } = await supabase
    .from('polymarket_meta')
    .select('value')
    .eq('key', 'last_events_scrape')
    .single();
  return data?.value ?? null;
}

export function useTrendingEvents(): UseTrendingEventsResult {
  const [events, setEvents] = useState<TrendingEvent[]>(cachedEvents ?? TRENDING_EVENTS);
  const [loading, setLoading] = useState(!cachedEvents);
  const [error, setError] = useState<string | null>(null);
  const [lastScraped, setLastScraped] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (cachedEvents && Date.now() - cacheTimestamp < CACHE_TTL) {
      setEvents(cachedEvents);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchEvents(), fetchLastScraped()])
      .then(([resolved, scraped]) => {
        if (cancelled) return;
        // Sort: critical first, then active, upcoming, completed last
        const statusOrder: Record<string, number> = { critical: 0, active: 1, upcoming: 2, completed: 3 };
        const sorted = [...resolved].sort(
          (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
        );
        cachedEvents = sorted;
        cacheTimestamp = Date.now();
        setEvents(sorted);
        setLastScraped(scraped);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setEvents(TRENDING_EVENTS);
        setError(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { events, loading, error, lastScraped, refetch: () => setTick((t) => t + 1) };
}
