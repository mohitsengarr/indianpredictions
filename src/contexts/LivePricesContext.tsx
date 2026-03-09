import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fetchLatestPrices } from '@/lib/polymarket-api';

export interface LivePrice {
  yesPrice: number;
  noPrice: number;
}

type PriceMap = Map<string, LivePrice>;

const LivePricesContext = createContext<PriceMap>(new Map());

const POLL_INTERVAL = 30_000; // 30 seconds

/** Provider: polls Polymarket every 30s and stores latest prices */
export function LivePricesProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PriceMap>(new Map());
  // Accumulate all known market IDs across renders
  const marketIdsRef = useRef<Set<string>>(new Set());

  // Expose a way for cards to register their market ID
  const register = (id: string) => marketIdsRef.current.add(id);

  useEffect(() => {
    const poll = async () => {
      const ids = Array.from(marketIdsRef.current);
      if (ids.length === 0) return;
      try {
        const updated = await fetchLatestPrices(ids);
        if (updated.size > 0) {
          setPrices((prev) => {
            const next = new Map(prev);
            updated.forEach((price, id) => next.set(id, price));
            return next;
          });
        }
      } catch {
        // Silent fail – keep showing last known prices
      }
    };

    // First poll after a short delay so IDs have time to register
    const initTimer = setTimeout(poll, 3000);
    const interval = setInterval(poll, POLL_INTERVAL);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <LivePricesContext.Provider value={prices}>
      <RegisterContext.Provider value={register}>
        {children}
      </RegisterContext.Provider>
    </LivePricesContext.Provider>
  );
}

const RegisterContext = createContext<(id: string) => void>(() => {});

/** Use inside a MarketCard to get live price and register for polling */
export function useLivePrice(marketId: string): LivePrice | undefined {
  const register = useContext(RegisterContext);
  const prices = useContext(LivePricesContext);

  // Register this market ID on mount
  useEffect(() => {
    register(marketId);
  }, [marketId, register]);

  return prices.get(marketId);
}
