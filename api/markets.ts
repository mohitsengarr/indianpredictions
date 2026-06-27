/**
 * Vercel Edge Function — /api/markets
 *
 * Public, CORS-enabled JSON feed of live India prediction markets, for
 * journalists and developers to cite/embed. Free to use with attribution.
 * Query params:
 *   ?scope=all   include global markets (default: India-relevant only)
 *   ?limit=N     cap results (default 100, max 500)
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

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const scope = url.searchParams.get('scope') === 'all' ? 'global' : 'india';
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1), 500);

  try {
    const indiaFilter = scope === 'india' ? '&is_india=eq.true' : '';
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/polymarket_cache?select=data${indiaFilter}&order=volume.desc&limit=300`,
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
      license: 'Free to use with attribution to indiapredictions.com',
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
        'cache-control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'feed temporarily unavailable' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' },
    });
  }
}
