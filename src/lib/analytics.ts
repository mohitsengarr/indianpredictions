/**
 * Lightweight Analytics — Anonymous Session Tracking + Event Logging
 *
 * Tracks user interactions client-side and sends them to Supabase.
 * No PII collected — uses anonymous visitor_id stored in localStorage.
 *
 * Events tracked:
 * - page_view: page loads
 * - market_click: clicks on market cards
 * - category_click: category tab selections
 * - share_click: social share button clicks
 * - polymarket_click: outbound clicks to Polymarket
 * - newsletter_submit: newsletter form submissions
 * - scroll_milestone: scroll depth milestones (25%, 50%, 75%, 100%)
 */

import { supabase } from './supabase';

// ── Visitor Identity ─────────────────────────────────────────────

function generateId(): string {
  return 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

// In-memory fallbacks for when localStorage/sessionStorage throw
// (e.g. Safari private mode, storage disabled). Analytics must never
// break the calling code path (it runs inside onClick handlers).
let memoryVisitorId: string | null = null;
let memorySessionId: string | null = null;
let memorySessionTs = 0;

function getVisitorId(): string {
  const key = 'ip_visitor_id';
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = memoryVisitorId ?? generateId();
      localStorage.setItem(key, id);
    }
    memoryVisitorId = id;
    return id;
  } catch {
    if (!memoryVisitorId) memoryVisitorId = generateId();
    return memoryVisitorId;
  }
}

function getSessionId(): string {
  const key = 'ip_session_id';
  const tsKey = 'ip_session_ts';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  try {
    const existingId = sessionStorage.getItem(key);
    const lastTs = parseInt(sessionStorage.getItem(tsKey) ?? '0', 10);

    if (existingId && Date.now() - lastTs < SESSION_TIMEOUT) {
      sessionStorage.setItem(tsKey, String(Date.now()));
      memorySessionId = existingId;
      memorySessionTs = Date.now();
      return existingId;
    }

    const newId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    sessionStorage.setItem(key, newId);
    sessionStorage.setItem(tsKey, String(Date.now()));
    memorySessionId = newId;
    memorySessionTs = Date.now();
    return newId;
  } catch {
    const now = Date.now();
    if (!memorySessionId || now - memorySessionTs >= SESSION_TIMEOUT) {
      memorySessionId = 's_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    }
    memorySessionTs = now;
    return memorySessionId;
  }
}

// ── Event Types ──────────────────────────────────────────────────

export type AnalyticsEventType =
  | 'page_view'
  | 'market_click'
  | 'category_click'
  | 'share_click'
  | 'polymarket_click'
  | 'newsletter_submit'
  | 'scroll_milestone'
  | 'watchlist_add'
  | 'digest_view';

interface AnalyticsEvent {
  visitor_id: string;
  session_id: string;
  event_type: AnalyticsEventType;
  page_url: string;
  market_id?: string;
  category?: string;
  extra?: Record<string, string | number>;
  geo_country?: string;
  geo_region?: string;
  timestamp: string;
}

// ── Buffered Event Queue ─────────────────────────────────────────

let eventBuffer: AnalyticsEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 5000; // Flush every 5 seconds
const FLUSH_SIZE = 10; // Or when 10 events accumulate

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(flushEvents, FLUSH_INTERVAL);
}

async function flushEvents() {
  flushTimeout = null;
  if (eventBuffer.length === 0) return;

  const batch = [...eventBuffer];
  eventBuffer = [];

  try {
    const { error } = await supabase.from('analytics_events').insert(batch);
    if (error) {
      console.warn('[Analytics] Failed to flush:', error.message);
      // Re-queue failed events (max 50 to prevent memory leak)
      eventBuffer = [...batch.slice(-25), ...eventBuffer].slice(0, 50);
    }
  } catch (err) {
    console.warn('[Analytics] Flush error:', err);
  }
}

/**
 * Synchronous flush for page-hide scenarios (tab close, navigation away).
 * The async supabase-js insert is unreliable here because the browser may
 * kill the request. Use navigator.sendBeacon when available (survives page
 * unload), else fetch with keepalive: true.
 */
function flushEventsOnHide() {
  if (eventBuffer.length === 0) return;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    // Can't build the REST request — fall back to the async path
    flushEvents();
    return;
  }

  const batch = [...eventBuffer];
  eventBuffer = [];
  const body = JSON.stringify(batch);
  // sendBeacon can't set headers, so pass the key as a query param
  const url = `${supabaseUrl}/rest/v1/analytics_events?apikey=${encodeURIComponent(supabaseKey)}`;

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return;
    }
    // keepalive lets the request outlive the page
    fetch(url, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body,
    }).catch(() => {});
  } catch {
    // Never let analytics break unload handling
  }
}

// Flush on page hide / unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEventsOnHide();
  });
  window.addEventListener('pagehide', () => flushEventsOnHide());
}

// ── Public API ───────────────────────────────────────────────────

let _geoCountry = '';
let _geoRegion = '';

/** Set geo context (called once from GeoProvider) */
export function setAnalyticsGeo(country: string, region: string) {
  _geoCountry = country;
  _geoRegion = region;
}

/**
 * Mirror an event to GA4 via gtag. Key events (conversions) are marked in the
 * GA4 UI (Admin → Events). Safe to call before gtag loads (no-op).
 */
function sendGA4(eventType: AnalyticsEventType, data: {
  marketId?: string; category?: string; extra?: Record<string, string | number>;
}) {
  if (typeof window === 'undefined') return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== 'function') return;
  if (eventType === 'page_view') {
    g('event', 'page_view', {
      page_path: window.location.pathname,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
    return;
  }
  g('event', eventType, {
    market_id: data.marketId,
    category: data.category,
    page_path: window.location.pathname,
    ...(data.extra ?? {}),
  });
}

/** Track an analytics event */
export function trackEvent(
  eventType: AnalyticsEventType,
  data: {
    marketId?: string;
    category?: string;
    extra?: Record<string, string | number>;
  } = {}
) {
  // Mirror to GA4 (conversions are marked as key events in the GA4 UI).
  sendGA4(eventType, data);

  const event: AnalyticsEvent = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    event_type: eventType,
    page_url: window.location.pathname,
    market_id: data.marketId,
    category: data.category,
    extra: data.extra,
    geo_country: _geoCountry,
    geo_region: _geoRegion,
    timestamp: new Date().toISOString(),
  };

  eventBuffer.push(event);

  if (eventBuffer.length >= FLUSH_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

/** Track a page view */
export function trackPageView(path?: string) {
  trackEvent('page_view', {
    extra: { path: path ?? window.location.pathname },
  });
}

/** Track a market card click */
export function trackMarketClick(marketId: string, category?: string) {
  trackEvent('market_click', { marketId, category });
}

/** Track a category tab click */
export function trackCategoryClick(category: string) {
  trackEvent('category_click', { category });
}

/** Track a Polymarket outbound click */
export function trackPolymarketClick(marketId: string) {
  trackEvent('polymarket_click', { marketId });
}

/** Track newsletter signup */
export function trackNewsletterSubmit() {
  trackEvent('newsletter_submit');
}

/** Track share button click */
export function trackShareClick(platform: string, marketId?: string) {
  trackEvent('share_click', { marketId, extra: { platform } });
}

/** Track adding a market to the watchlist (key event) */
export function trackWatchlistAdd(marketId: string, category?: string) {
  trackEvent('watchlist_add', { marketId, category });
}

/** Track a weekly digest view */
export function trackDigestView(weekOf: string) {
  trackEvent('digest_view', { extra: { week_of: weekOf } });
}

// ── Scroll Tracking ──────────────────────────────────────────────

const scrollMilestones = new Set<number>();

export function initScrollTracking() {
  scrollMilestones.clear();

  const handler = () => {
    const scrollPct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    for (const milestone of [25, 50, 75, 100]) {
      if (scrollPct >= milestone && !scrollMilestones.has(milestone)) {
        scrollMilestones.add(milestone);
        trackEvent('scroll_milestone', { extra: { depth: milestone } });
      }
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}
