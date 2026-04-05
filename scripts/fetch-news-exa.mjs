#!/usr/bin/env node
/**
 * fetch-news-exa.mjs
 * Fetches breaking India news via Exa API across key categories,
 * writes to public/data/breaking-news.json and optionally upserts to Supabase.
 * Designed to run every 12 hours via cron.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const EXA_API_KEY = process.env.EXA_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!EXA_API_KEY) {
  console.error('EXA_API_KEY is required');
  process.exit(1);
}

// ── Category queries ──
const QUERIES = [
  { key: 'markets',     query: 'India stock market Sensex Nifty breaking news today' },
  { key: 'economy',     query: 'India economy RBI GDP inflation breaking news' },
  { key: 'politics',    query: 'India politics government elections breaking news' },
  { key: 'sports',      query: 'India cricket IPL sports breaking news today' },
  { key: 'geopolitics', query: 'India foreign policy international relations breaking news' },
  { key: 'technology',  query: 'India startups technology AI funding breaking news' },
  { key: 'regulation',  query: 'India SEBI RBI fintech crypto regulation breaking news' },
  { key: 'energy',      query: 'India oil energy infrastructure breaking news' },
];

// ── Exa search ──
async function exaSearch(query, numResults = 5) {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': EXA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      type: 'auto',
      category: 'news',
      num_results: numResults,
      contents: {
        text: { max_characters: 3000 },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Exa API error ${res.status}: ${text.substring(0, 200)}`);
    return [];
  }

  const data = await res.json();
  return data.results ?? [];
}

// ── Extract structured event from Exa result ──
function parseResult(result, category) {
  const title = result.title?.trim();
  if (!title || title.length < 10) return null;

  // Extract first 2-3 sentences as summary
  const text = result.text ?? '';
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
  const summary = sentences.slice(0, 3).join(' ').substring(0, 500);

  if (!summary || summary.length < 30) return null;

  return {
    id: `exa-${Buffer.from(result.url).toString('base64url').substring(0, 20)}`,
    title: title.substring(0, 120),
    summary,
    category,
    source: result.url,
    publishedDate: result.publishedDate ?? new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

// ── Deduplicate by title similarity ──
function dedup(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main ──
async function main() {
  console.log(`[${new Date().toISOString()}] Starting Exa breaking news fetch...`);

  const allArticles = [];

  for (const { key, query } of QUERIES) {
    console.log(`  Fetching: ${key}...`);
    try {
      const results = await exaSearch(query, 5);
      const parsed = results.map(r => parseResult(r, key)).filter(Boolean);
      allArticles.push(...parsed);
      console.log(`    → ${parsed.length} articles`);
    } catch (err) {
      console.error(`    ✗ ${key}: ${err.message}`);
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  const unique = dedup(allArticles);
  console.log(`\nTotal: ${allArticles.length} raw → ${unique.length} unique articles`);

  // Load existing and merge (keep last 48 hours)
  const outPath = join(ROOT, 'public', 'data', 'breaking-news.json');
  let existing = [];
  if (existsSync(outPath)) {
    try {
      existing = JSON.parse(readFileSync(outPath, 'utf-8'));
    } catch { /* ignore */ }
  }

  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const merged = dedup([
    ...unique,
    ...existing.filter(a => new Date(a.fetchedAt).getTime() > cutoff),
  ]);

  // Sort by publishedDate descending
  merged.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  // Keep top 100
  const final = merged.slice(0, 100);

  writeFileSync(outPath, JSON.stringify(final, null, 2));
  console.log(`Wrote ${final.length} articles to ${outPath}`);

  // Optionally upsert to Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { error } = await supabase
        .from('breaking_news')
        .upsert(final.map(a => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          category: a.category,
          source_url: a.source,
          published_at: a.publishedDate,
          fetched_at: a.fetchedAt,
        })), { onConflict: 'id' });

      if (error) console.error('Supabase upsert error:', error.message);
      else console.log('Upserted to Supabase successfully');
    } catch (err) {
      console.error('Supabase upsert skipped:', err.message);
    }
  }

  console.log(`[${new Date().toISOString()}] Done.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
