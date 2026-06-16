import { useCallback, useEffect, useState } from 'react';

/**
 * Recently viewed markets — a lightweight history rail so returning visitors
 * can jump back to markets they just looked at. Persisted in localStorage,
 * shared across tabs and components via a tiny pub-sub so the homepage rail
 * updates live as markets are opened. Mirrors the resilience pattern of
 * useWatchlist (localStorage as source of truth, in-memory fallback only when
 * storage is unavailable — Safari private mode / SSR prerender).
 */

const STORAGE_KEY = 'ip_recently_viewed_v1';
const MAX_ITEMS = 12;
const listeners = new Set<() => void>();
let memoryFallback: string[] | null = null;

function read(): string[] {
  // localStorage is the source of truth so cross-tab `storage` events reflect
  // real changes. memoryFallback is only used when storage is unavailable
  // (Safari private mode / SSR prerender) — otherwise a local write would
  // shadow localStorage and break cross-tab sync.
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

export function useRecentlyViewed() {
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

  const record = useCallback((id: string) => {
    const current = read();
    // Move id to the front, de-dupe, cap at MAX_ITEMS.
    const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX_ITEMS);
    write(next);
  }, []);

  return { recent: ids, record };
}
