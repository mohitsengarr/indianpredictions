import { useState, useEffect } from 'react';
import { Market } from '@/lib/types';
import { fetchPolymarkets } from '@/lib/polymarket-api';
import { mapPolymarketsToMarkets } from '@/lib/polymarket-mapper';
import { MARKETS as FALLBACK_MARKETS } from '@/lib/mock-data';

interface UseMarketsResult {
  markets: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** India-related keywords to filter from Polymarket */
const INDIA_KEYWORDS = [
  'india', 'indian', 'modi', 'bjp', 'congress', 'ipl', 'cricket', 'bcci',
  'rupee', 'inr', 'rbi', 'nifty', 'sensex', 'mumbai', 'delhi', 'bollywood',
  'lok sabha', 'rajya sabha', 'pakistan', 'sri lanka', 'icc', 'asia cup',
  'champions trophy', 'world cup cricket', 'rohit', 'kohli', 'bumrah',
  'rahul', 'hindenburg', 'adani', 'reliance', 'infosys', 'tata',
];

export function isIndiaRelated(question: string, tags?: { label: string }[]): boolean {
  const text = [
    question,
    ...(tags?.map((t) => t.label) ?? []),
  ].join(' ').toLowerCase();

  return INDIA_KEYWORDS.some((kw) => text.includes(kw));
}

// Module-level cache
let cachedMarkets: Market[] | null = null;
let cachedIndiaMarkets: Market[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useMarkets(): UseMarketsResult {
  const [markets, setMarkets] = useState<Market[]>(cachedMarkets ?? FALLBACK_MARKETS);
  const [loading, setLoading] = useState(!cachedMarkets);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (cachedMarkets && Date.now() - cacheTimestamp < CACHE_TTL) {
      setMarkets(cachedMarkets);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPolymarkets({ limit: 100, active: true, closed: false, order: 'volume24hr' })
      .then((raw) => {
        if (cancelled) return;
        const mapped = mapPolymarketsToMarkets(raw);
        if (mapped.length > 0) {
          cachedMarkets = mapped;
          cacheTimestamp = Date.now();
          setMarkets(mapped);
        } else {
          setMarkets(FALLBACK_MARKETS);
        }
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useMarkets] Failed to fetch from Polymarket:', err);
        setError(err.message ?? 'Failed to fetch markets');
        setMarkets(cachedMarkets ?? FALLBACK_MARKETS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { markets, loading, error, refetch: () => setTick((t) => t + 1) };
}

/** Hook that fetches India-specific trending markets from Polymarket */
export function useIndiaMarkets(): {
  markets: Market[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [markets, setMarkets] = useState<Market[]>(cachedIndiaMarkets ?? FALLBACK_MARKETS);
  const [loading, setLoading] = useState(!cachedIndiaMarkets);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (cachedIndiaMarkets && Date.now() - cacheTimestamp < CACHE_TTL) {
      setMarkets(cachedIndiaMarkets);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Fetch a large batch sorted by volume so India markets surface
    fetchPolymarkets({ limit: 200, active: true, closed: false, order: 'volume24hr' })
      .then((raw) => {
        if (cancelled) return;

        // Filter to India-related markets
        const indiaRaw = raw.filter((m) => isIndiaRelated(m.question ?? '', m.tags));
        const mapped = mapPolymarketsToMarkets(indiaRaw.length > 0 ? indiaRaw : raw);

        // Sort by volume descending
        mapped.sort((a, b) => b.volume - a.volume);

        const result = mapped.length > 0 ? mapped : FALLBACK_MARKETS;
        cachedIndiaMarkets = result;
        setMarkets(result);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useIndiaMarkets] Failed:', err);
        setError(err.message ?? 'Failed to fetch India markets');
        setMarkets(cachedIndiaMarkets ?? FALLBACK_MARKETS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { markets, loading, error, refetch: () => setTick((t) => t + 1) };
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
