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

let cachedMarkets: Market[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useMarkets(): UseMarketsResult {
  const [markets, setMarkets] = useState<Market[]>(cachedMarkets ?? FALLBACK_MARKETS);
  const [loading, setLoading] = useState(!cachedMarkets);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Use cache if fresh
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
          // API returned empty — fall back to mock data
          setMarkets(FALLBACK_MARKETS);
        }
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useMarkets] Failed to fetch from Polymarket:', err);
        setError(err.message ?? 'Failed to fetch markets');
        // Keep showing existing data (either cache or fallback)
        setMarkets(cachedMarkets ?? FALLBACK_MARKETS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { markets, loading, error, refetch: () => setTick((t) => t + 1) };
}

/** Fetch a single market by id — checks cache first, then fetches */
export function useMarket(id: string | undefined): {
  market: Market | null;
  loading: boolean;
  error: string | null;
} {
  const { markets, loading, error } = useMarkets();
  const market = id ? (markets.find((m) => m.id === id) ?? null) : null;
  return { market, loading, error };
}
