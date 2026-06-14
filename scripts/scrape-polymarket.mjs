#!/usr/bin/env node
/**
 * scrape-polymarket.mjs
 * Refreshes public.polymarket_cache from Polymarket's Gamma API.
 *
 * Why this exists: the cache was previously seeded once and went stale (its
 * India markets all resolved/closed), and the app only fetched the top-300 by
 * volume — so the India view collapsed. This job pulls a large set of CURRENTLY
 * ACTIVE markets, scores each for India relevance with the same rules the app
 * uses, and keeps EVERY India-relevant market (no volume floor — India markets
 * have low volume on Polymarket) plus the top global markets by volume. That
 * maximizes India coverage while keeping the cache a sane size.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (Polymarket API is public, no key).
 */

import { createHash } from 'crypto';

const GAMMA = 'https://gamma-api.polymarket.com/markets';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const MAX_SCAN = 5000;        // how many active markets to scan (deep, to catch low-volume India ones)
const PAGE = 100;             // Gamma caps page size at 100; paginate via offset
const TOP_GLOBAL = 600;       // keep this many global markets by volume (India kept regardless)
const MIN_TOTAL = 50;         // partial-write guard

// ── India relevance (mirrors src/lib/recommendations.ts) ───────────────
const INDIA_STRONG = [
  'india', 'indian', 'modi', 'narendra modi', 'amit shah', 'rahul gandhi', 'sonia gandhi', 'yogi adityanath',
  'bjp', 'indian national congress', 'inc party', 'aam aadmi',
  'ipl', 'bcci', 'cricket india', 'team india', 'rupee', 'rbi', 'nifty', 'sensex', 'bse sensex',
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur',
  'tamil nadu', 'west bengal', 'kerala', 'karnataka', 'uttar pradesh', 'maharashtra', 'gujarat', 'bihar',
  'bollywood', 'lok sabha', 'rajya sabha',
  'adani', 'mukesh ambani', 'reliance industries', 'reliance jio', 'infosys', 'tata motors', 'tata consultancy',
  'wipro', 'hindenburg adani', 'sebi', 'hdfc', 'icici', 'kotak mahindra',
  'kohli', 'rohit sharma', 'bumrah', 'dhoni', 'shubman gill',
  'csk', 'rcb', 'mumbai indians', 'chennai super kings', 'rajasthan royals', 'kolkata knight riders',
  'isro', 'upi', 'aadhaar',
];
const INDIA_MEDIUM = [
  'pakistan', 'sri lanka', 'bangladesh', 'nepal', 'asia cup', 'champions trophy', 'icc',
  'world cup cricket', 'kabaddi', 'badminton', 'south asia', 'subcontinent', 'crude oil india', 'monsoon',
];
const NON_INDIA = [
  'nfl', 'nba', 'mlb', 'nhl', 'super bowl', 'march madness',
  'premier league', 'la liga', 'bundesliga', 'serie a', 'ligue 1',
  'eurovision', 'oscars', 'grammy', 'emmys', 'kanye', 'kardashian', 'drake', 'mrbeast', 'elon musk twitter',
  'f1 driver', 'f1 drivers', 'formula 1', 'formula one', 'motogp', 'nascar', 'indycar',
  'sainz', 'verstappen', 'hamilton', 'leclerc', 'norris', 'piastri', 'colapinto', 'isack hadjar', 'gasly', 'alonso', 'russell',
  'us forces enter iran', 'us military iran', 'us forces iran', 'trump out as president', 'biden re-elected',
  'us midterm', 'uk election', 'french election', 'german election', 'mexican election', 'brazilian election',
  'dogecoin', 'solana meme', 'pepe coin', 'shiba inu', 'fifa world cup 2026', 'uefa euro', 'copa america',
];

function wordMatch(haystack, needle) {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ +/g, '\\s+');
  return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`, 'i').test(haystack);
}
function indiaScore(text) {
  const t = text.toLowerCase();
  const non = NON_INDIA.filter((k) => wordMatch(t, k)).length;
  if (non >= 2) return 0;
  const strong = INDIA_STRONG.filter((k) => wordMatch(t, k)).length;
  if (non === 1 && strong === 0) return 0.05;
  if (strong >= 1) return 0.8;
  if (INDIA_MEDIUM.filter((k) => wordMatch(t, k)).length >= 1) return 0.5;
  return 0.15;
}

// ── Category inference (mirrors mapper) ────────────────────────────────
function inferCategory(text) {
  const t = text.toLowerCase();
  if (/cricket|ipl|bcci|t20|odi|test match|match/.test(t)) return 'cricket';
  if (/bitcoin|crypto|eth|blockchain|upi|web3|token|defi|nft/.test(t)) return 'crypto';
  if (/election|vote|president|prime minister|minister|politics|parliament|senate|congress|modi|assembly/.test(t)) return 'politics';
  if (/movie|film|box office|bollywood|oscar|emmy|award|celebrity|music|album|series/.test(t)) return 'entertainment';
  if (/gdp|inflation|rate|fed|rbi|nifty|stock|nasdaq|dow|market|economy|cpi|recession|bank/.test(t)) return 'economy';
  return 'crypto';
}

// Deterministic synthetic price history (seeded by id) — mirrors mapper.
function hashSeed(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return h >>> 0; }
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function priceHistory(yes, id) {
  const rand = mulberry32(hashSeed(id));
  const pts = [];
  let p = Math.max(0.05, Math.min(0.95, yes - 0.1 + rand() * 0.05));
  for (let i = 30; i >= 0; i--) {
    p = Math.max(0.05, Math.min(0.95, p + (rand() - 0.48) * 0.035));
    pts.push({ time: new Date(Date.now() - i * 864e5).toISOString(), yes: +p.toFixed(2), no: +(1 - p).toFixed(2) });
  }
  pts[pts.length - 1] = { ...pts[pts.length - 1], yes, no: +(1 - yes).toFixed(2) };
  return pts;
}

function parseJsonArr(v) { try { return Array.isArray(v) ? v : JSON.parse(v); } catch { return []; } }

function mapMarket(pm) {
  const outcomes = parseJsonArr(pm.outcomes);
  const prices = parseJsonArr(pm.outcomePrices).map(Number);
  if (outcomes.length < 2 || prices.length < 2) return null;
  const yesIdx = outcomes.findIndex((o) => String(o).toLowerCase() === 'yes');
  const yi = yesIdx >= 0 ? yesIdx : 0;
  const yesPrice = prices[yi];
  if (!(yesPrice > 0 && yesPrice < 1)) return null;
  const noPrice = +(1 - yesPrice).toFixed(4);
  const id = String(pm.id);
  const vol = Number(pm.volumeNum ?? pm.volume ?? 0);
  const liq = Number(pm.liquidityNum ?? pm.liquidity ?? 0);
  const change24h = pm.oneDayPriceChange != null ? +(Number(pm.oneDayPriceChange) * 100).toFixed(1) : 0;
  const end = pm.endDate || pm.endDateIso || new Date(Date.now() + 30 * 864e5).toISOString();
  return {
    id,
    title: pm.question,
    description: pm.description || pm.question,
    category: inferCategory(`${pm.question} ${pm.description || ''}`),
    status: pm.closed ? 'closed' : pm.active ? 'live' : 'draft',
    yesPrice, noPrice,
    volume: vol,
    liquidity: liq,
    traders: liq > 0 ? Math.round(liq / 50) : Math.round(vol / 80),
    change24h,
    closesAt: end,
    resolvesAt: end,
    resolutionCriteria: `Resolves YES if the stated outcome occurs. Source: ${pm.resolutionSource || 'Polymarket'}.`,
    resolutionSource: pm.resolutionSource || 'Polymarket',
    resolutionSourceUrl: `https://polymarket.com/event/${pm.slug || id}`,
    createdAt: pm.startDate || pm.createdAt || new Date().toISOString(),
    priceHistory: priceHistory(yesPrice, id),
  };
}

async function fetchPage(offset) {
  const url = `${GAMMA}?active=true&closed=false&order=volumeNum&ascending=false&limit=${PAGE}&offset=${offset}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Gamma ${res.status} at offset ${offset}`);
  return res.json();
}

async function main() {
  console.log(`[${new Date().toISOString()}] Scraping Polymarket (scan up to ${MAX_SCAN})...`);
  const mapped = [];
  for (let offset = 0; offset < MAX_SCAN; offset += PAGE) {
    let page;
    try { page = await fetchPage(offset); } catch (e) { console.error(`  page ${offset} failed: ${e.message}`); break; }
    if (!Array.isArray(page) || page.length === 0) break;
    for (const pm of page) { const m = mapMarket(pm); if (m) mapped.push(m); }
    process.stdout.write(`  scanned ${offset + page.length}, mapped ${mapped.length}\r`);
    if (page.length < PAGE) break;
    await new Promise((r) => setTimeout(r, 150)); // be polite
  }
  console.log('');

  // India relevance (no volume floor) + top global by volume.
  const india = [], rest = [];
  for (const m of mapped) {
    const isIndia = indiaScore(`${m.title} ${m.description} ${m.category}`) >= 0.5;
    (isIndia ? india : rest).push({ m, isIndia });
  }
  rest.sort((a, b) => b.m.volume - a.m.volume);
  const keep = [...india, ...rest.slice(0, TOP_GLOBAL)];
  const openIndia = india.filter((x) => new Date(x.m.closesAt).getTime() > Date.now()).length;
  console.log(`Mapped ${mapped.length} | India ${india.length} (open ${openIndia}) | keeping ${keep.length}`);

  if (keep.length < MIN_TOTAL) {
    console.error(`❌ Only ${keep.length} markets (min ${MIN_TOTAL}). Aborting without writing.`);
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('No Supabase creds — dry run (not writing). Set SUPABASE_URL + SUPABASE_SERVICE_KEY to upsert.');
    return;
  }

  // Upsert in batches.
  const rows = keep.map(({ m, isIndia }) => ({
    id: m.id, data: m, is_india: isIndia, volume: m.volume, fetched_at: new Date().toISOString(),
  }));
  let ok = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/polymarket_cache?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });
    if (!res.ok) { console.error(`  upsert batch ${i} failed: ${res.status} ${(await res.text()).slice(0, 200)}`); }
    else ok += batch.length;
  }
  console.log(`Upserted ${ok}/${rows.length} markets to polymarket_cache.`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
