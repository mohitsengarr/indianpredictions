#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Builds public/sitemap.xml from:
 *   1. Static routes (weekly changefreq)
 *   2. Blog posts — slugs + publish dates from src/data/blog-posts.ts
 *   3. Events — slugs + updatedAt from public/data/scraped-events.json
 *
 * Run in CI after the scraper so event URLs in the sitemap match the
 * current archive. Excludes utility pages (portfolio/wallet/profile) that
 * shouldn't be indexed. Host is the canonical www domain.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HOST = 'https://www.indiapredictions.com';

const todayISO = new Date().toISOString().split('T')[0];

/** Static, indexable routes with priority + change frequency. */
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'hourly' },
  { path: '/markets', priority: '0.9', changefreq: 'hourly' },
  { path: '/crypto', priority: '0.8', changefreq: 'hourly' },
  { path: '/insights', priority: '0.8', changefreq: 'daily' },
  { path: '/analytics', priority: '0.7', changefreq: 'daily' },
  { path: '/blog', priority: '0.7', changefreq: 'daily' },
  { path: '/digest', priority: '0.8', changefreq: 'weekly' },
  { path: '/cricket', priority: '0.8', changefreq: 'daily' },
  { path: '/elections', priority: '0.8', changefreq: 'daily' },
  { path: '/economy', priority: '0.8', changefreq: 'daily' },
  { path: '/bollywood', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/data', priority: '0.7', changefreq: 'daily' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
];

/** Extract { slug, lastmod } pairs from the blog-posts source file without
 *  importing it (it's TSX with imports we don't want to resolve here). */
function readBlogPosts() {
  const file = join(ROOT, 'src', 'data', 'blog-posts.ts');
  if (!existsSync(file)) return [];
  const src = readFileSync(file, 'utf-8');
  const posts = [];
  // Match each "slug: '...'" and the nearest following "publishedAt: '...'".
  const slugRe = /slug:\s*'([^']+)'/g;
  let m;
  while ((m = slugRe.exec(src)) !== null) {
    const slug = m[1];
    const after = src.slice(m.index, m.index + 600);
    const dateMatch = after.match(/publishedAt:\s*'([^']+)'/);
    const lastmod = dateMatch ? dateMatch[1].split('T')[0] : todayISO;
    posts.push({ slug, lastmod });
  }
  return posts;
}

/** Read current event archive for slugs + lastmod. */
function readEvents() {
  const file = join(ROOT, 'public', 'data', 'scraped-events.json');
  if (!existsSync(file)) return [];
  try {
    const data = JSON.parse(readFileSync(file, 'utf-8'));
    if (!Array.isArray(data)) return [];
    return data
      .filter((e) => e && e.slug)
      .map((e) => ({ slug: e.slug, lastmod: (e.updatedAt || todayISO).split('T')[0] }));
  } catch {
    return [];
  }
}

function urlEntry(loc, lastmod, priority, changefreq) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

function main() {
  const entries = [];

  for (const r of STATIC_ROUTES) {
    entries.push(urlEntry(`${HOST}${r.path}`, todayISO, r.priority, r.changefreq));
  }

  // Dedupe slugs (archive can briefly hold two stories that slugify the same)
  const seen = new Set();

  for (const post of readBlogPosts()) {
    const loc = `${HOST}/blog/${escapeXml(post.slug)}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    entries.push(urlEntry(loc, post.lastmod, '0.6', 'monthly'));
  }

  for (const ev of readEvents()) {
    const loc = `${HOST}/events/${escapeXml(ev.slug)}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    entries.push(urlEntry(loc, ev.lastmod, '0.6', 'weekly'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const outPath = join(ROOT, 'public', 'sitemap.xml');
  writeFileSync(outPath, xml);
  console.log(`Wrote sitemap with ${entries.length} URLs to ${outPath}`);
}

main();
