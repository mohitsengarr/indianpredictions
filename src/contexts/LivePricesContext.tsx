import React, { createContext, useContext, useEffect, useRef } from 'react';

/** 
 * LivePrices context is now a no-op — prices are kept fresh by the
 * pg_cron job writing into polymarket_cache every 5 minutes.
 * The context is kept so MarketCard doesn't need changing.
 */

export interface LivePrice {
  yesPrice: number;
  noPrice: number;
}

type PriceMap = Map<string, LivePrice>;

const LivePricesContext = createContext<PriceMap>(new Map());
const RegisterContext = createContext<(id: string) => void>(() => {});

export function LivePricesProvider({ children }: { children: React.ReactNode }) {
  return (
    <LivePricesContext.Provider value={new Map()}>
      <RegisterContext.Provider value={() => {}}>
        {children}
      </RegisterContext.Provider>
    </LivePricesContext.Provider>
  );
}

/** No-op — prices come from the DB cache now */
export function useLivePrice(_marketId: string): LivePrice | undefined {
  return undefined;
}
