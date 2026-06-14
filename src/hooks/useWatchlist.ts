import { useCallback, useEffect, useState } from 'react';

/**
 * Watchlist ("My Markets") — lets users star markets/events so they have a
 * reason to return. Persisted in localStorage, shared across tabs and
 * components via a tiny pub-sub so every star button stays in sync.
 *
 * Polymarket keeps users coming back partly through a personal "Watchlist";
 * this is the no-account equivalent.
 */

const STORAGE_KEY = 'ip_watchlist_v1';
const listeners = new Set<() => void>();
let memoryFallback: string[] | null = null;

function read(): string[] {
  if (memoryFallback) return memoryFallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return memoryFallback ?? [];
  }
}

function write(ids: string[]) {
  memoryFallback = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* Safari private mode / blocked storage — memoryFallback still serves this session */
  }
  listeners.forEach((fn) => fn());
}

export function useWatchlist() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    const sync = () => setIds(read());
    listeners.add(sync);
    // Cross-tab updates
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) sync(); };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current];
    write(next);
  }, []);

  const isWatched = useCallback((id: string) => ids.includes(id), [ids]);

  return { watchlist: ids, toggle, isWatched, count: ids.length };
}
