import { useEffect, useRef, useState, useCallback } from 'react';

export interface LiveCryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  quoteVolume: number;
  lastUpdated: number;
}

interface BinanceTickerData {
  s: string;  // symbol
  c: string;  // current price
  P: string;  // price change percent
  p: string;  // price change
  h: string;  // high 24h
  l: string;  // low 24h
  v: string;  // volume
  q: string;  // quote volume
}

interface BinanceCombinedStream {
  stream: string;
  data: BinanceTickerData;
}

const STREAMS = [
  'btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt',
  'adausdt', 'dogeusdt', 'trxusdt', 'avaxusdt', 'dotusdt',
  'linkusdt', 'shibusdt', 'ltcusdt', 'atomusdt', 'polusdt',
].map(s => `${s}@ticker`).join('/');

const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`;

// Map Binance symbols (BTCUSDT) to our symbols (BTCUSD)
const symbolMap: Record<string, string> = {
  BTCUSDT: 'BTCUSD',
  ETHUSDT: 'ETHUSD',
  BNBUSDT: 'BNBUSD',
  SOLUSDT: 'SOLUSD',
  XRPUSDT: 'XRPUSD',
  ADAUSDT: 'ADAUSD',
  DOGEUSDT: 'DOGEUSD',
  TRXUSDT: 'TRXUSD',
  AVAXUSDT: 'AVAXUSD',
  DOTUSDT: 'DOTUSD',
  LINKUSDT: 'LINKUSD',
  SHIBUSDT: 'SHIBUSD',
  LTCUSDT: 'LTCUSD',
  ATOMUSDT: 'ATOMUSD',
  POLUSDT: 'MATICUSD', // POL trades as POLUSDT on Binance, maps to our MATICUSD
};

export function useBinanceWebSocket(): {
  prices: Map<string, LiveCryptoPrice>;
  isConnected: boolean;
  lastUpdate: Date | null;
} {
  const [prices, setPrices] = useState<Map<string, LiveCryptoPrice>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttemptRef = useRef(0);
  const bufferRef = useRef<Map<string, LiveCryptoPrice>>(new Map());
  const flushIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        reconnectAttemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg: BinanceCombinedStream = JSON.parse(event.data);
          const d = msg.data;
          const ourSymbol = symbolMap[d.s];
          if (!ourSymbol) return;

          const livePrice: LiveCryptoPrice = {
            symbol: ourSymbol,
            price: parseFloat(d.c),
            change24h: parseFloat(d.p),
            changePercent24h: parseFloat(d.P),
            high24h: parseFloat(d.h),
            low24h: parseFloat(d.l),
            volume: parseFloat(d.v),
            quoteVolume: parseFloat(d.q),
            lastUpdated: Date.now(),
          };

          // Buffer updates instead of setting state on every message
          bufferRef.current.set(ourSymbol, livePrice);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        scheduleReconnect();
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        ws.close();
      };
    } catch {
      scheduleReconnect();
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current) return;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
    reconnectAttemptRef.current += 1;
    reconnectTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) connect();
    }, delay);
  }, [connect]);

  // Flush buffered updates every 1 second
  useEffect(() => {
    flushIntervalRef.current = setInterval(() => {
      if (bufferRef.current.size > 0) {
        const buffered = new Map(bufferRef.current);
        bufferRef.current.clear();
        setPrices((prev) => {
          const next = new Map(prev);
          buffered.forEach((val, key) => next.set(key, val));
          return next;
        });
        setLastUpdate(new Date());
      }
    }, 1000);

    return () => {
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);
    };
  }, []);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { prices, isConnected, lastUpdate };
}
