/**
 * Vercel Edge Function — /api/market-og?id=<marketId>
 *
 * Crawler-only renderer for /market/:id. vercel.json rewrites *social-crawler*
 * requests here (matched by User-Agent); humans fall through to the normal SPA.
 * Returns the real index.html shell with per-market <title> / OG / Twitter meta
 * injected, so shared links render a rich preview with the live odds image
 * (/api/og). Not cloaking: the SPA hydrates to the same content for everyone;
 * this just gives non-JS crawlers the meta they can't get client-side.
 */
export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://gcmugkbvfizcnkrhwjzz.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbXVna2J2Zml6Y25rcmh3anp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzkzMjYsImV4cCI6MjA5MTk1NTMyNn0.HCHWmqZh1cUY8ik-Mcvvg0yZxc4bbK8yngLDlLXNyA0';
const SITE = 'https://www.indiapredictions.com';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';

  // Always start from the real SPA shell so the page still works if anything
  // below fails. Custom UA so this self-fetch can't be mistaken for a crawler.
  let html: string;
  try {
    const shell = await fetch(new URL('/index.html', url.origin), {
      headers: { 'user-agent': 'indiapredictions-og-meta' },
    });
    html = await shell.text();
  } catch {
    return new Response('', { status: 302, headers: { location: `${SITE}/market/${id}` } });
  }

  try {
    if (id) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/polymarket_cache?id=eq.${encodeURIComponent(id)}&select=data`,
        { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
      );
      const rows = (await r.json()) as Array<{ data?: { title?: string; yesPrice?: number } }>;
      const m = rows?.[0]?.data;
      if (m?.title) {
        const yesPct = Math.round((m.yesPrice ?? 0) * 100);
        const title = esc(`${m.title} — ${yesPct}% YES | India Predictions`);
        const desc = esc(
          `Live odds: "${m.title}" is at ${yesPct}% YES on India Predictions. Free, no signup — aggregated from Polymarket, updated every 5 min.`,
        );
        const img = `${SITE}/api/og?id=${encodeURIComponent(id)}`;
        const canonical = `${SITE}/market/${id}`;

        html = html
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
          .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`)
          .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
          // The shell we fetched is the homepage prerender, which already carries
          // a homepage canonical + og:url. REPLACE them (don't append a second
          // og:url — crawlers use the first one) so they point at this market.
          .replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`);
      }
    }
  } catch {
    /* serve the unmodified shell on any error */
  }

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=600',
    },
  });
}
