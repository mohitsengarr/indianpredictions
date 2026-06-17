#!/usr/bin/env node
/**
 * generate-digest.mjs
 * Builds src/data/digest.json — a weekly "India Prediction Market Digest"
 * snapshot — from the freshest available data (public/data/scraped-events.json
 * + breaking-news.json). The digest page imports this JSON statically so it
 * PRERENDERS with real content (answer-first summary + a probability table),
 * which is the format answer engines (Perplexity/ChatGPT/Google AI) cite.
 *
 * Run in CI before the build/sitemap step so the page reflects the latest scrape.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function readJson(p, fallback) {
  try { return JSON.parse(readFileSync(join(ROOT, p), 'utf-8')); } catch { return fallback; }
}

// Stable pseudo-probability — identical to EventCard.getProbability so the
// digest agrees with the event cards.
function probability(ev) {
  let hash = 0;
  const str = (ev.title || '') + (ev.id || '');
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  const base = Math.abs(hash % 60) + 20;
  if (ev.status === 'critical') return Math.min(base + 15, 92);
  if (ev.status === 'completed') return base > 50 ? 85 : 15;
  return base;
}

const CATEGORY_LABELS = {
  markets: 'Markets', economy: 'Economy', politics: 'Politics', sports: 'Cricket & Sports',
  geopolitics: 'Geopolitics', technology: 'Technology', entertainment: 'Bollywood',
  energy: 'Energy', regulation: 'Regulation', crypto: 'Crypto',
};

function main() {
  const events = readJson('public/data/scraped-events.json', []);
  const news = readJson('public/data/breaking-news.json', []);
  if (!Array.isArray(events) || events.length === 0) {
    console.error('No events to build a digest from — leaving existing digest.json.');
    process.exit(existsSync(join(ROOT, 'src/data/digest.json')) ? 0 : 1);
  }

  // Rank: critical/active first, then most recently updated. Dedup by slug
  // AND by normalized title (some events share a headline with different slugs).
  const order = { critical: 0, active: 1, upcoming: 2, completed: 3 };
  const seenSlug = new Set();
  const seenTitle = new Set();
  const ranked = [...events]
    .sort((a, b) => {
      const o = (order[a.status] ?? 9) - (order[b.status] ?? 9);
      if (o !== 0) return o;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    })
    .filter((e) => {
      if (!e.slug) return false;
      const tkey = (e.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
      if (seenSlug.has(e.slug) || seenTitle.has(tkey)) return false;
      seenSlug.add(e.slug); seenTitle.add(tkey);
      return true;
    });

  const items = ranked.slice(0, 8).map((e) => ({
    title: e.title,
    slug: e.slug,
    category: e.category,
    categoryLabel: CATEGORY_LABELS[e.category] || e.category,
    angle: (e.predictionMarketAngle || '').replace(/\s+(Yes|No)\s*$/i, '').trim(),
    probability: probability(e),
    updatedAt: e.updatedAt,
  }));

  // Answer-first summary (1–3 sentences) — what an AI engine would quote.
  const cats = [...new Set(items.map((i) => i.categoryLabel))].slice(0, 4);
  const lead = items[0];
  const summary =
    `As of this week, India Predictions is tracking ${items.length} of the most-watched ` +
    `India prediction-market questions across ${cats.join(', ')}. The single most active is ` +
    `“${lead.title}”, where the market implies roughly a ${lead.probability}% chance. ` +
    `Probabilities are crowd-sourced estimates aggregated from prediction markets, updated continuously — not financial advice.`;

  const now = new Date();
  const weekOf = now.toISOString().split('T')[0];

  const digest = {
    weekOf,
    generatedAt: now.toISOString(),
    summary,
    items,
    topNews: (Array.isArray(news) ? news : []).slice(0, 5).map((n) => ({
      title: n.title, category: n.category, source: n.source, publishedDate: n.publishedDate,
    })),
  };

  writeFileSync(join(ROOT, 'src/data/digest.json'), JSON.stringify(digest, null, 2));
  console.log(`Wrote digest for week of ${weekOf} with ${items.length} items + ${digest.topNews.length} news.`);
}

main();
