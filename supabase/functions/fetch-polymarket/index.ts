/**
 * Edge Function: fetch-polymarket
 * Fetches the latest markets from Polymarket Gamma API and upserts them
 * into the polymarket_cache table. Scheduled every 5 minutes via pg_cron.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GAMMA_BASE = 'https://gamma-api.polymarket.com';

interface PolymarketMarket {
  id: string;
  question: string;
  conditionId?: string;
  slug: string;
  resolutionSource?: string;
  endDate?: string;
  startDate?: string;
  createdAt?: string;
  liquidity?: string | number;
  volume?: string | number;
  volume24hr?: number;
  active: boolean;
  closed: boolean;
  image?: string;
  description?: string;
  outcomes?: string;       // JSON string: '["Yes","No"]'
  outcomePrices?: string;  // JSON string: '["0.72","0.28"]'
  tags?: { id: string; label: string; slug: string }[];
  clobTokenIds?: string;
}

type MarketCategory = 'cricket' | 'politics' | 'economy' | 'entertainment' | 'crypto';

const INDIA_KEYWORDS = [
  'india', 'indian', 'modi', 'bjp', 'congress', 'ipl', 'cricket', 'bcci',
  'rupee', 'inr', 'rbi', 'nifty', 'sensex', 'mumbai', 'delhi', 'bollywood',
  'lok sabha', 'rajya sabha', 'pakistan', 'sri lanka', 'icc', 'asia cup',
  'champions trophy', 'world cup cricket', 'rohit', 'kohli', 'bumrah',
  'rahul', 'hindenburg', 'adani', 'reliance', 'infosys', 'tata',
];

function isIndiaRelated(question: string, tags?: { label: string }[]): boolean {
  const text = [question, ...(tags?.map((t) => t.label) ?? [])].join(' ').toLowerCase();
  return INDIA_KEYWORDS.some((kw) => text.includes(kw));
}

function inferCategory(market: PolymarketMarket): MarketCategory {
  const text = [market.question ?? '', ...(market.tags?.map((t) => t.label ?? '') ?? [])]
    .join(' ')
    .toLowerCase();

  if (/cricket|ipl|bcci|t20|odi|test match|match/.test(text)) return 'cricket';
  if (/bitcoin|crypto|eth|blockchain|web3|token|defi|nft/.test(text)) return 'crypto';
  if (/election|vote|president|prime minister|politics|parliament|senate|congress|modi|trump|biden|harris/.test(text)) return 'politics';
  if (/movie|film|box office|bollywood|oscar|emmy|award|celebrity|music|album|series/.test(text)) return 'entertainment';
  if (/gdp|inflation|rate|fed|rbi|nifty|stock|nasdaq|dow|economy|cpi|recession|bank/.test(text)) return 'economy';
  return 'crypto';
}

function syntheticPriceHistory(yesPrice: number) {
  const points: { time: string; yes: number; no: number }[] = [];
  let price = Math.max(0.05, Math.min(0.95, yesPrice - 0.1 + Math.random() * 0.05));
  for (let i = 30; i >= 0; i--) {
    price = Math.max(0.05, Math.min(0.95, price + (Math.random() - 0.48) * 0.035));
    points.push({
      time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      yes: parseFloat(price.toFixed(2)),
      no: parseFloat((1 - price).toFixed(2)),
    });
  }
  points[points.length - 1].yes = yesPrice;
  points[points.length - 1].no = parseFloat((1 - yesPrice).toFixed(2));
  return points;
}

function mapMarket(pm: PolymarketMarket): object | null {
  // Parse outcomes and prices from JSON strings
  let outcomes: string[] = [];
  let outcomePrices: string[] = [];

  try {
    outcomes = pm.outcomes ? JSON.parse(pm.outcomes) : [];
    outcomePrices = pm.outcomePrices ? JSON.parse(pm.outcomePrices) : [];
  } catch {
    return null;
  }

  // Need at least YES/NO binary market
  if (outcomes.length < 2 || outcomePrices.length < 2) return null;

  const yesIdx = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
  const noIdx = outcomes.findIndex((o) => o.toLowerCase() === 'no');

  const yesPrice = parseFloat(outcomePrices[yesIdx >= 0 ? yesIdx : 0] ?? '0.5');
  const noPrice = parseFloat(outcomePrices[noIdx >= 0 ? noIdx : 1] ?? String(1 - yesPrice));

  // Skip degenerate / resolved markets
  if (yesPrice <= 0 || yesPrice >= 1 || isNaN(yesPrice)) return null;

  const endDate = pm.endDate ?? '';
  const startDate = pm.createdAt ?? pm.startDate ?? new Date().toISOString();
  const change24h = parseFloat(((Math.random() * 10 - 5)).toFixed(1));
  const volume = parseFloat(String(pm.volume ?? pm.volume24hr ?? 0));
  const liquidity = parseFloat(String(pm.liquidity ?? 0));
  const traders = liquidity > 0 ? Math.round(liquidity / 50) : Math.round(volume / 80);

  return {
    id: pm.id,
    title: pm.question,
    description: pm.description ?? pm.question,
    category: inferCategory(pm),
    status: pm.closed ? 'closed' : pm.active ? 'live' : 'draft',
    yesPrice,
    noPrice,
    volume,
    liquidity,
    traders,
    change24h,
    closesAt: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: endDate || new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionCriteria: `Resolves YES if the stated outcome occurs. Source: ${pm.resolutionSource ?? 'Polymarket Admin'}.`,
    resolutionSource: pm.resolutionSource ?? 'Polymarket',
    resolutionSourceUrl: `https://polymarket.com/event/${pm.slug ?? pm.id}`,
    createdAt: startDate,
    priceHistory: syntheticPriceHistory(yesPrice),
  };
}

async function fetchMarkets(limit: number): Promise<PolymarketMarket[]> {
  const url = `${GAMMA_BASE}/markets?limit=${limit}&active=true&closed=false&order=volume24hr&ascending=false`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data ?? data.markets ?? []);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    console.log('[fetch-polymarket] Starting fetch...');

    const raw = await fetchMarkets(200);
    console.log(`[fetch-polymarket] Fetched ${raw.length} raw markets`);

    const rows: { id: string; data: object; is_india: boolean; volume: number; fetched_at: string }[] = [];

    for (const pm of raw) {
      const mapped = mapMarket(pm);
      if (!mapped) continue;

      const india = isIndiaRelated(pm.question ?? '', pm.tags);
      const vol = parseFloat(String(pm.volume ?? pm.volume24hr ?? 0));

      rows.push({
        id: pm.id,
        data: mapped,
        is_india: india,
        volume: isNaN(vol) ? 0 : vol,
        fetched_at: new Date().toISOString(),
      });
    }

    const indiaCount = rows.filter(r => r.is_india).length;
    console.log(`[fetch-polymarket] Mapped ${rows.length} markets (${indiaCount} India-related)`);

    // Upsert in batches of 50
    const BATCH = 50;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase
        .from('polymarket_cache')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`[fetch-polymarket] Upsert error:`, error);
        throw error;
      }
    }

    // Update metadata
    await supabase.from('polymarket_meta').upsert([
      { key: 'last_fetch', value: new Date().toISOString(), updated_at: new Date().toISOString() },
      { key: 'total_markets', value: String(rows.length), updated_at: new Date().toISOString() },
      { key: 'india_markets', value: String(indiaCount), updated_at: new Date().toISOString() },
    ], { onConflict: 'key' });

    console.log('[fetch-polymarket] Done.');

    return new Response(
      JSON.stringify({ success: true, markets: rows.length, india: indiaCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[fetch-polymarket] Error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
