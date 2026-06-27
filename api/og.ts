/**
 * Vercel Edge Function — /api/og?id=<marketId>
 *
 * Generates a 1200x630 Open Graph share image for a single market (question +
 * live YES/NO odds + branding). Used as og:image by the crawler meta injected
 * in api/market-og.ts. Falls back to a generic card if the market isn't found.
 *
 * Built with React.createElement (no JSX) on purpose: the api/ dir is
 * type-checked without the `--jsx` flag, so JSX here fails the Vercel build.
 */
import { ImageResponse } from '@vercel/og';
import { createElement as h } from 'react';

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

  const header = h(
    'div',
    { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800 } },
      h('span', { style: { color: '#ffffff' } }, 'India'),
      h('span', { style: { color: '#22c55e' } }, 'Predictions'),
    ),
    h(
      'div',
      { style: { display: 'flex', fontSize: 22, letterSpacing: 1, color: '#cbd5e1' } },
      h('span', null, category ? category.toUpperCase() : 'PREDICTION MARKETS'),
    ),
  );

  const question = h(
    'div',
    { style: { display: 'flex', fontSize: titleSize, fontWeight: 800, lineHeight: 1.15 } },
    h('span', null, title),
  );

  const odds = yesPct >= 0
    ? h(
        'div',
        { style: { display: 'flex', flexDirection: 'column' } },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 } },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'baseline', color: '#22c55e', fontSize: 66, fontWeight: 800 } },
            h('span', null, `${yesPct}%`),
            h('span', { style: { fontSize: 28, marginLeft: 12, color: '#86efac' } }, 'YES'),
          ),
          h(
            'div',
            { style: { display: 'flex', alignItems: 'baseline', color: '#f87171', fontSize: 40, fontWeight: 700 } },
            h('span', null, `${noPct}% NO`),
          ),
        ),
        h(
          'div',
          { style: { display: 'flex', width: '100%', height: 20, borderRadius: 10, overflow: 'hidden' } },
          h('div', { style: { display: 'flex', width: `${yesPct}%`, background: '#22c55e' } }),
          h('div', { style: { display: 'flex', width: `${noPct}%`, background: '#ef4444' } }),
        ),
      )
    : h(
        'div',
        { style: { display: 'flex', fontSize: 30, color: '#cbd5e1' } },
        h('span', null, 'Live odds on cricket, elections, economy & more'),
      );

  const footer = h(
    'div',
    { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' } },
    h('span', null, 'indiapredictions.com'),
    h('span', null, 'Free · No signup · Updated every 5 min'),
  );

  const root = h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0b1b3a 0%, #12306e 100%)',
        color: '#ffffff',
        padding: '64px',
        justifyContent: 'space-between',
        fontFamily: 'sans-serif',
      },
    },
    header,
    question,
    odds,
    footer,
  );

  return new ImageResponse(root, {
    width: 1200,
    height: 630,
    headers: { 'cache-control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400' },
  });
}
