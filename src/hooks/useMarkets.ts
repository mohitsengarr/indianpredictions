import { useState, useEffect, useMemo, useRef } from 'react';
import { Market } from '@/lib/types';
import { MARKETS as FALLBACK_MARKETS } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import {
  filterQuality,
  isIndiaRelevant,
  sortByTrending,
  getBiggestMovers,
  getClosingSoon,
  getRelatedMarkets,
} from '@/lib/recommendations';

interface UseMarketsResult {
  markets: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// Module-level cache so we don't re-fetch on every re-render
let cachedAll: Market[] | null = null;
let cachedIndia: Market[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/** India-related keywords — kept for any client-side fallback filtering */
const INDIA_KEYWORDS = [
  'india', 'indian', 'modi', 'bjp', 'congress', 'ipl', 'cricket', 'bcci',
  'rupee', 'inr', 'rbi', 'nifty', 'sensex', 'mumbai', 'delhi', 'bollywood',
  'lok sabha', 'rajya sabha', 'pakistan', 'sri lanka', 'icc', 'asia cup',
  'champions trophy', 'world cup cricket', 'rohit', 'kohli', 'bumrah',
  'rahul', 'hindenburg', 'adani', 'reliance', 'infosys', 'tata',
];

export function isIndiaRelated(question: string, tags?: { label: string }[]): boolean {
  const text = [question, ...(tags?.map((t) => t.label) ?? [])].join(' ').toLowerCase();
  return INDIA_KEYWORDS.some((kw) => text.includes(kw));
}

/** Fetch all markets from the Supabase polymarket_cache table */
async function fetchAllFromDB(): Promise<{ all: Market[]; india: Market[] }> {
  const { data, error } = await supabase
    .from('polymarket_cache')
    .select('id, data, is_india, volume, fetched_at')
    .order('volume', { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('No cached markets found');

  const allRaw = data.map((row) => row.data as Market);
  // Use enhanced quality + India-relevance scoring
  const all = filterQuality(allRaw);
  const india = all.filter(m => isIndiaRelevant(m));

  return { all, india };
}

export function useMarkets(): UseMarketsResult {
  const [markets, setMarkets] = useState<Market[]>(cachedAll ?? FALLBACK_MARKETS);
  const [loading, setLoading] = useState(!cachedAll);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);
  const lastTickRef = useRef(tick);

  useEffect(() => {
    // A tick change means refetch() was called — bypass the TTL check.
    const forced = tick !== lastTickRef.current;
    lastTickRef.current = tick;

    if (!forced && cachedAll && Date.now() - cacheTimestamp < CACHE_TTL) {
      setMarkets(cachedAll);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllFromDB()
      .then(({ all, india }) => {
        if (cancelled) return;
        cachedAll = filterQuality(all.length > 0 ? all : FALLBACK_MARKETS);
        cachedIndia = filterQuality(india).length > 0 ? filterQuality(india) : null;
        cacheTimestamp = Date.now();
        setMarkets(cachedAll);
        setLastUpdated(new Date());
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useMarkets] Failed to fetch from DB:', err);
        setError(err.message ?? 'Failed to fetch markets');
        setMarkets(cachedAll ?? FALLBACK_MARKETS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { markets, loading, error, lastUpdated, refetch: () => setTick((t) => t + 1) };
}

/** Hook that returns India-specific markets from the DB cache */
export function useIndiaMarkets(): {
  markets: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
} {
  const [markets, setMarkets] = useState<Market[]>(cachedIndia ?? []);
  const [loading, setLoading] = useState(!cachedIndia);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);
  const lastTickRef = useRef(tick);

  useEffect(() => {
    // A tick change means refetch() was called — bypass the TTL check.
    const forced = tick !== lastTickRef.current;
    lastTickRef.current = tick;

    if (!forced && cachedIndia && Date.now() - cacheTimestamp < CACHE_TTL) {
      setMarkets(cachedIndia);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllFromDB()
      .then(({ all, india }) => {
        if (cancelled) return;
        cachedAll = filterQuality(all.length > 0 ? all : FALLBACK_MARKETS);
        cachedIndia = filterQuality(india);
        cacheTimestamp = Date.now();
        const result = cachedIndia;
        setMarkets(result);
        setLastUpdated(new Date());
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useIndiaMarkets] Failed:', err);
        setError(err.message ?? 'Failed to fetch India markets');
        setMarkets(cachedIndia ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { markets, loading, error, lastUpdated, refetch: () => setTick((t) => t + 1) };
}

/** Fetch a single market by id */
export function useMarket(id: string | undefined): {
  market: Market | null;
  loading: boolean;
  error: string | null;
} {
  const { markets, loading, error } = useMarkets();
  const market = id ? (markets.find((m) => m.id === id) ?? null) : null;
  return { market, loading, error };
}

/** Hook: India markets sorted by trending score */
export function useTrendingIndiaMarkets(limit = 10) {
  const { markets, loading } = useIndiaMarkets();
  const sorted = useMemo(() => sortByTrending(markets).slice(0, limit), [markets, limit]);
  return { markets: sorted, loading };
}

/** Hook: Biggest probability movers (India-relevant only) */
export function useBiggestMovers(limit = 6) {
  const { markets, loading } = useIndiaMarkets();
  const movers = useMemo(() => getBiggestMovers(markets, limit), [markets, limit]);
  return { markets: movers, loading };
}

/** Hook: Markets closing soon (India-relevant only) */
export function useClosingSoon(limit = 6) {
  const { markets, loading } = useIndiaMarkets();
  const closing = useMemo(() => getClosingSoon(markets, limit), [markets, limit]);
  return { markets: closing, loading };
}

/** Hook: Related markets for a given market */
export function useRelatedMarkets(market: Market | null, limit = 4) {
  const { markets } = useMarkets();
  const related = useMemo(
    () => market ? getRelatedMarkets(market, markets, limit) : [],
    [market, markets, limit]
  );
  return related;
}
