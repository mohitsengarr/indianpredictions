#!/usr/bin/env node
/**
 * scrape-firecrawl.mjs
 * Hosted Firecrawl scraper for GitHub Actions.
 * Searches 9 Indian news categories, extracts structured events,
 * writes public/data/scraped-events.json, and optionally upserts to Supabase.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!FIRECRAWL_API_KEY) {
  console.error('FIRECRAWL_API_KEY is required');
  process.exit(1);
}

// ── Category Config ──
const CATEGORIES = [
  { key: 'markets',       label: 'Markets',       emoji: '📉', query: 'India stock market Sensex Nifty latest news today' },
  { key: 'economy',       label: 'Economy',       emoji: '💰', query: 'India economy RBI monetary policy GDP inflation latest' },
  { key: 'politics',      label: 'Politics',      emoji: '🗳️', query: 'India politics elections government policy latest news' },
  { key: 'sports',        label: 'Sports',        emoji: '🏏', query: 'India cricket IPL sports latest news today' },
  { key: 'geopolitics',   label: 'Geopolitics',   emoji: '🌍', query: 'India geopolitics foreign policy international relations latest' },
  { key: 'technology',    label: 'Technology',     emoji: '💻', query: 'India startups technology AI funding latest news' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬', query: 'Bollywood box office OTT India entertainment latest' },
  { key: 'energy',        label: 'Energy',        emoji: '⛽', query: 'India oil prices energy LPG crude oil latest news' },
  { key: 'regulation',    label: 'Regulation',    emoji: '⚖️', query: 'India regulation SEBI RBI fintech crypto policy latest' },
];

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    title:                 { type: 'string', description: 'Short headline (max 80 chars)' },
    summary:               { type: 'string', description: '2-3 sentence summary' },
    keyDrivers:            { type: 'array', items: { type: 'string' }, description: '3-5 key factors' },
    mckinseyAnalysis:      { type: 'array', items: { type: 'string' }, description: '3-5 analytical points' },
    predictionMarketAngle: { type: 'string', description: 'A yes/no prediction question about this event' },
    status:                { type: 'string', enum: ['active', 'critical', 'upcoming', 'completed'] },
    imageUrl:              { type: 'string', description: 'URL of the main article hero/featured image (not logos or icons). Must be an absolute URL starting with http' },
  },
  required: ['title', 'summary', 'keyDrivers', 'mckinseyAnalysis', 'predictionMarketAngle', 'status'],
};

// ── Image quality filter ──
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('http')) return false;
  // Filter out tiny icons, logos, tracking pixels, and favicons
  const lower = url.toLowerCase();
  const rejects = ['logo', 'icon', 'favicon', 'pixel', 'tracking', '1x1', 'badge', 'avatar', 'sprite', '.svg', 'back.png'];
  return !rejects.some(r => lower.includes(r));
}

// ── Firecrawl Search ──
async function firecrawlSearch(query) {
  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      limit: 3,
      scrapeOptions: {
        formats: ['json', 'markdown'],
        jsonOptions: {
          prompt: 'Extract the main news event from this page relevant to India. For imageUrl, find the main hero/featured image of the article — not logos, icons, or ads.',
          schema: JSON_SCHEMA,
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firecrawl API error ${res.status}: ${text.substring(0, 200)}`);
  }

  const data = await res.json();
  return data.data ?? data.results ?? data.web ?? [];
}

// ── Helpers ──
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/^-|-$/g, '');
}

// Extract first large image URL from markdown content
function extractImageFromMarkdown(markdown) {
  if (!markdown) return null;
  const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  while ((match = imgRegex.exec(markdown)) !== null) {
    if (isValidImageUrl(match[1])) return match[1];
  }
  return null;
}

function buildEvent(json, sourceUrl, category, index, markdown) {
  const id = `evt-scrape-${category.key}-${index}`;
  const slug = slugify(json.title || 'untitled');
  const now = new Date().toISOString();

  // Try JSON-extracted image first, then fall back to markdown image
  let imageUrl = isValidImageUrl(json.imageUrl) ? json.imageUrl : null;
  if (!imageUrl) {
    imageUrl = extractImageFromMarkdown(markdown);
  }

  return {
    id,
    slug,
    title: json.title || 'Untitled Event',
    category: category.key,
    status: json.status || 'active',
    summary: json.summary || '',
    imageUrl: imageUrl || undefined,
    keyDrivers: json.keyDrivers || [],
    mckinseyAnalysis: json.mckinseyAnalysis || [],
    predictionMarketAngle: json.predictionMarketAngle || '',
    categoryLabel: category.label,
    categoryEmoji: category.emoji,
    updatedAt: now,
  };
}

// ── Main ──
async function main() {
  console.log('🔍 Starting Firecrawl scrape across 9 categories...\n');
  const allEvents = [];

  // Run searches in batches of 3 for parallelism without rate-limiting
  for (let i = 0; i < CATEGORIES.length; i += 3) {
    const batch = CATEGORIES.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map(cat => firecrawlSearch(cat.query).then(r => ({ cat, results: r })))
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error(`  ❌ Failed: ${result.reason.message}`);
        continue;
      }

      const { cat, results: searchResults } = result.value;
      let eventIndex = 1;

      for (const item of searchResults) {
        const json = item.json ?? item.extract ?? item;
        if (!json || !json.title) continue;

        const markdown = item.markdown || item.content || '';
        const event = buildEvent(json, item.url || item.sourceURL || '', cat, eventIndex, markdown);
        allEvents.push(event);
        console.log(`  ✅ [${cat.key}] ${event.title} ${event.imageUrl ? '📷' : '⬜'}`);
        eventIndex++;
      }
    }
  }

  console.log(`\n📊 Total events scraped: ${allEvents.length}`);

  // Write JSON file
  const jsonPath = join(__dirname, '..', 'public', 'data', 'scraped-events.json');
  writeFileSync(jsonPath, JSON.stringify(allEvents, null, 2));
  console.log(`📁 Written to ${jsonPath}`);

  // Optional: Supabase upsert
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

      const rows = allEvents.map(e => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        category: e.category,
        status: e.status,
        summary: e.summary,
        image_url: e.imageUrl || null,
        data: e,
        source_url: null,
        scraped_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('trending_events_cache')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.log(`⚠️  Supabase upsert skipped: ${error.message}`);
      } else {
        console.log(`🗄️  Upserted ${rows.length} events to Supabase`);
      }

      await supabase.from('polymarket_meta').upsert([
        { key: 'last_events_scrape', value: new Date().toISOString(), updated_at: new Date().toISOString() },
        { key: 'total_scraped_events', value: String(allEvents.length), updated_at: new Date().toISOString() },
      ], { onConflict: 'key' });

    } catch (e) {
      console.log(`⚠️  Supabase optional step failed: ${e.message}`);
    }
  }

  console.log('\n✅ Scrape complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
