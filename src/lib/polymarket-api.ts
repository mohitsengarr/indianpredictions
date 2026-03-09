/**
 * Polymarket Gamma API integration
 * Base: https://gamma-api.polymarket.com (public, no auth required)
 *
 * Browser requests are routed through corsproxy.io to bypass CORS restrictions.
 */

const GAMMA_BASE = 'https://gamma-api.polymarket.com';
const CLOB_BASE = 'https://clob.polymarket.com';

// Public CORS proxy — prepend to any cross-origin URL
const CORS_PROXY = 'https://corsproxy.io/?url=';

function proxyUrl(url: string): string {
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
}

export interface PolymarketToken {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  startDate: string;
  liquidity: number;
  volume: number;
  volume24hr: number;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  questionID: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  tokens: PolymarketToken[];
  tags: { id: string; label: string; slug: string }[];
  // From events endpoint
  image?: string;
  icon?: string;
  description?: string;
  category?: string;
  // Extended fields
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
  clobTokenIds?: string[];
  competitive?: number;
  umaResolutionStatuses?: string;
  resolvedBy?: string;
  spread?: number;
}

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate: string;
  creationDate: string;
  markets: PolymarketMarket[];
  volume: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  category?: string;
  tags?: { id: string; label: string; slug: string }[];
  image?: string;
  icon?: string;
}

export interface GammaMarketsResponse {
  data?: PolymarketMarket[];
  limit?: number;
  count?: number;
  next_cursor?: string;
}

/** Fetch active markets from Polymarket Gamma API */
export async function fetchPolymarkets(params: {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  order?: string;
  ascending?: boolean;
  tag?: string;
} = {}): Promise<PolymarketMarket[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(params.limit ?? 50));
  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  searchParams.set('active', String(params.active ?? true));
  searchParams.set('closed', String(params.closed ?? false));
  searchParams.set('order', params.order ?? 'volume24hr');
  searchParams.set('ascending', String(params.ascending ?? false));
  if (params.tag) searchParams.set('tag', params.tag);

  const rawUrl = `${GAMMA_BASE}/markets?${searchParams.toString()}`;
  const res = await fetch(proxyUrl(rawUrl), {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // Gamma returns either an array or { data: [...] }
  return Array.isArray(data) ? data : (data.data ?? data.markets ?? []);
}

/** Fetch a single market by its condition ID or slug */
export async function fetchPolymarketById(id: string): Promise<PolymarketMarket | null> {
  const rawUrl = `${GAMMA_BASE}/markets/${id}`;
  const res = await fetch(proxyUrl(rawUrl), {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data ?? null;
}

/**
 * Fetch latest prices for a list of market IDs from the Gamma API.
 * Returns a map of marketId → { yesPrice, noPrice }.
 */
export async function fetchLatestPrices(
  marketIds: string[]
): Promise<Map<string, { yesPrice: number; noPrice: number }>> {
  if (marketIds.length === 0) return new Map();

  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(Math.min(marketIds.length, 100)));
  searchParams.set('active', 'true');
  searchParams.set('closed', 'false');
  // Fetch only the markets we need via id filter
  marketIds.slice(0, 50).forEach((id) => searchParams.append('id', id));

  const rawUrl = `${GAMMA_BASE}/markets?${searchParams.toString()}`;
  const res = await fetch(proxyUrl(rawUrl), { headers: { Accept: 'application/json' } });
  if (!res.ok) return new Map();

  const data = await res.json();
  const markets: PolymarketMarket[] = Array.isArray(data) ? data : (data.data ?? data.markets ?? []);

  const map = new Map<string, { yesPrice: number; noPrice: number }>();
  markets.forEach((m) => {
    if (!m.tokens || m.tokens.length < 2) return;
    const yesToken = m.tokens.find((t) => t.outcome?.toLowerCase() === 'yes') ?? m.tokens[0];
    const noToken = m.tokens.find((t) => t.outcome?.toLowerCase() === 'no') ?? m.tokens[1];
    const yesPrice = parseFloat(String(yesToken.price ?? 0));
    const noPrice = parseFloat(String(noToken.price ?? 0));
    if (yesPrice > 0) map.set(m.id, { yesPrice, noPrice });
  });

  return map;
}

/** Fetch active events (groups of related markets) */
export async function fetchPolymarketEvents(params: {
  limit?: number;
  offset?: number;
  active?: boolean;
  order?: string;
} = {}): Promise<PolymarketEvent[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(params.limit ?? 50));
  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  searchParams.set('active', String(params.active ?? true));
  searchParams.set('closed', 'false');
  searchParams.set('order', params.order ?? 'volume24hr');
  searchParams.set('ascending', 'false');

  const rawUrl = `${GAMMA_BASE}/events?${searchParams.toString()}`;
  const res = await fetch(proxyUrl(rawUrl), {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Polymarket Events API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data ?? data.events ?? []);
}
