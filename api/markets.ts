/**
 * Vercel Edge Function — /api/markets
 *
 * Public JSON feed of live India prediction markets. Freemium:
 *   - Free (no key):  up to 100 markets, attribution required, non-commercial.
 *   - Pro  (?key= or x-api-key header): up to 500, commercial use per plan.
 * Keys live in public.ip_api_keys and are validated via the ip_validate_api_key
 * RPC (SECURITY DEFINER, so the anon key can't read the table directly).
 *
 * Query params: ?scope=all (global) · ?limit=N · ?key=<apiKey>
 */
export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://gcmugkbvfizcnkrhwjzz.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbXVna2J2Zml6Y25rcmh3anp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzkzMjYsImV4cCI6MjA5MTk1NTMyNn0.HCHWmqZh1cUY8ik-Mcvvg0yZxc4bbK8yngLDlLXNyA0';
const SITE = 'https://www.indiapredictions.com';

interface MarketData {
  id: string | number;
  title?: string;
  category?: string;
  yesPrice?: number;
  noPrice?: number;
  volume?: number;
  closesAt?: string;
}

async function resolveTier(key: string): Promise<'free' | 'pro'> {
  if (!key) return 'free';
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ip_validate_api_key`, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p_key: key }),
    });
    const rows = (await r.json()) as Array<{ tier?: string }>;
    return rows?.[0]?.tier === 'pro' ? 'pro' : 'free';
  } catch {
    return 'free';
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') || req.headers.get('x-api-key') || '';
  const tier = await resolveTier(key);
  const scope = url.searchParams.get('scope') === 'all' ? 'global' : 'india';
  const maxLimit = tier === 'pro' ? 500 : 100;
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1), maxLimit);

  try {
    const indiaFilter = scope === 'india' ? '&is_india=eq.true' : '';
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/polymarket_cache?select=data${indiaFilter}&order=volume.desc&limit=500`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    );
    const rows = (await r.json()) as Array<{ data?: MarketData }>;
    const now = Date.now();

    const markets = rows
      .map((row) => row.data)
      .filter((m): m is MarketData => !!m && !!m.closesAt && new Date(m.closesAt).getTime() > now)
      .slice(0, limit)
      .map((m) => ({
        id: String(m.id),
        title: m.title,
        category: m.category,
        probabilityYes: Math.round((m.yesPrice ?? 0) * 100),
        yesPrice: m.yesPrice,
        noPrice: m.noPrice,
        volume: m.volume,
        closesAt: m.closesAt,
        url: `${SITE}/market/${m.id}`,
      }));

    const body = {
      source: 'India Predictions',
      homepage: SITE,
      tier,
      maxLimit,
      license: tier === 'pro'
        ? 'Commercial use permitted under your Pro plan.'
        : 'Free for non-commercial use with attribution to indiapredictions.com. For higher limits and commercial use, get a Pro key — see /data.',
      dataSource: 'Aggregated from Polymarket; scored for India relevance.',
      generatedAt: new Date().toISOString(),
      scope,
      count: markets.length,
      markets,
    };

    return new Response(JSON.stringify(body, null, 2), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*',
        // Vary on the key header so a header-keyed (Pro) request isn't served a
        // cached Free response; Pro responses are private (per-customer), Free
        // stays shared-cached. The reliable method is ?key= (distinct URL).
        vary: 'x-api-key',
        'cache-control': tier === 'pro'
          ? 'private, max-age=60'
          : 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'feed temporarily unavailable' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' },
    });
  }
}
