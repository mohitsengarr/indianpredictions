/** @jsxImportSource react */
/**
 * Vercel Edge Function — /api/og?id=<marketId>
 *
 * Generates a 1200x630 Open Graph share image for a single market (question +
 * live YES/NO odds + branding), so links shared on WhatsApp/X/LinkedIn/etc.
 * render a rich, on-brand card. Falls back to a generic card if the market
 * isn't found. Used as og:image by the crawler meta injected in middleware.ts.
 */
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// Public, read-only credentials (the anon key ships in the client bundle too).
const SUPABASE_URL = 'https://gcmugkbvfizcnkrhwjzz.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbXVna2J2Zml6Y25rcmh3anp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzkzMjYsImV4cCI6MjA5MTk1NTMyNn0.HCHWmqZh1cUY8ik-Mcvvg0yZxc4bbK8yngLDlLXNyA0';

export default async function handler(req: Request) {
  const id = new URL(req.url).searchParams.get('id') || '';

  let title = "India's Prediction Markets";
  let yesPct = -1;
  let category = '';

  try {
    if (id) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/polymarket_cache?id=eq.${encodeURIComponent(id)}&select=data`,
        { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
      );
      const rows = (await r.json()) as Array<{ data?: { title?: string; yesPrice?: number; category?: string } }>;
      const m = rows?.[0]?.data;
      if (m) {
        title = (m.title || title).slice(0, 110);
        yesPct = Math.round((m.yesPrice ?? 0) * 100);
        category = m.category || '';
      }
    }
  } catch {
    /* fall back to the generic card */
  }

  const noPct = yesPct >= 0 ? 100 - yesPct : -1;
  const titleSize = title.length > 80 ? 46 : title.length > 50 ? 54 : 62;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0b1b3a 0%, #12306e 100%)',
          color: '#ffffff',
          padding: '64px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800 }}>
            <span style={{ color: '#ffffff' }}>India</span>
            <span style={{ color: '#22c55e' }}>Predictions</span>
          </div>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 1, color: '#cbd5e1' }}>
            <span>{category ? category.toUpperCase() : 'PREDICTION MARKETS'}</span>
          </div>
        </div>

        {/* Question */}
        <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 800, lineHeight: 1.15 }}>
          <span>{title}</span>
        </div>

        {/* Odds */}
        {yesPct >= 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', color: '#22c55e', fontSize: 66, fontWeight: 800 }}>
                <span>{yesPct}%</span>
                <span style={{ fontSize: 28, marginLeft: 12, color: '#86efac' }}>YES</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', color: '#f87171', fontSize: 40, fontWeight: 700 }}>
                <span>{noPct}% NO</span>
              </div>
            </div>
            <div style={{ display: 'flex', width: '100%', height: 20, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', width: `${yesPct}%`, background: '#22c55e' }} />
              <div style={{ display: 'flex', width: `${noPct}%`, background: '#ef4444' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 30, color: '#cbd5e1' }}>
            <span>Live odds on cricket, elections, economy &amp; more</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
          <span>indiapredictions.com</span>
          <span>Free · No signup · Updated every 5 min</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'cache-control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400' },
    },
  );
}
