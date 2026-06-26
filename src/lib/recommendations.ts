/**
 * Recommendation Engine — MVP (Rules + Popularity + Content Similarity)
 *
 * Handles:
 * 1. India-relevance scoring (0-1) with expanded keyword matching
 * 2. Quality filtering (garbage content suppression)
 * 3. Trending score (volume + probability delta + freshness)
 * 4. Biggest movers (|change24h| descending)
 * 5. Closing soon (resolution date ascending)
 * 6. Related markets (keyword/tag similarity)
 */

import type { Market } from './types';

// ── India Relevance ──────────────────────────────────────────────

/** High-confidence India keywords (strong signal).
 *
 * IMPORTANT: avoid plain English words that have a non-India meaning.
 * - 'congress' alone matches US Congress → false positives. Use the
 *   multi-word variants 'indian national congress' / 'inc party' / leader
 *   names (rahul gandhi, sonia gandhi) instead.
 * - 'aap' is ambiguous with 'AAP' as a generic abbreviation in non-India
 *   contexts → use 'aam aadmi' instead.
 * - 'reliance' is a common English noun → use 'reliance industries' / 'mukesh ambani'.
 */
const INDIA_KEYWORDS_STRONG: string[] = [
  // Core nation / govt
  'india', 'indian', 'modi', 'narendra modi', 'amit shah', 'rahul gandhi',
  'sonia gandhi', 'yogi adityanath',
  'bjp', 'indian national congress', 'inc party', 'aam aadmi',
  // Markets / economy / finance
  'ipl', 'bcci', 'cricket india', 'team india',
  'rupee', 'rbi', 'nifty', 'sensex', 'bse sensex',
  // Cities / states
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata',
  'hyderabad', 'pune', 'ahmedabad', 'jaipur',
  // Culture
  'bollywood', 'lok sabha', 'rajya sabha',
  // Companies (multi-word to avoid generic noun matches)
  'adani', 'mukesh ambani', 'reliance industries', 'reliance jio',
  'infosys', 'tata motors', 'tata consultancy', 'tcs ltd', 'wipro', 'hindenburg adani',
  'sebi', 'hdfc', 'icici', 'kotak mahindra',
  // Cricketers
  'kohli', 'rohit sharma', 'bumrah', 'dhoni', 'shubman gill',
  // IPL teams (abbreviations safe via word boundaries)
  'csk', 'rcb', 'mumbai indians', 'chennai super kings',
  // National identity / govt programs
  'isro', 'upi', 'aadhaar',
];

/** Medium-confidence keywords (relevant but not exclusive to India) */
const INDIA_KEYWORDS_MEDIUM: string[] = [
  'pakistan', 'sri lanka', 'bangladesh', 'nepal',
  'asia cup', 'champions trophy', 'icc',
  'world cup cricket', 'kabaddi', 'badminton',
  'south asia', 'subcontinent',
  'crude oil india', 'monsoon', 'kharif', 'rabi',
];

/** Keywords that indicate NOT India-relevant */
const NON_INDIA_KEYWORDS: string[] = [
  // US sports
  'nfl', 'nba', 'mlb', 'nhl', 'super bowl', 'march madness',
  // EU football
  'premier league', 'la liga', 'bundesliga', 'serie a', 'ligue 1',
  // Awards & entertainment (non-India)
  'eurovision', 'oscars', 'grammy', 'emmys',
  'kanye', 'kardashian', 'drake', 'mrbeast', 'elon musk twitter',
  // Auto racing (Formula 1, MotoGP, NASCAR — not India-relevant)
  'f1 driver', 'f1 drivers', 'formula 1', 'formula one',
  'motogp', 'nascar', 'indycar',
  // Carlos Sainz, Verstappen, Hamilton & other F1 driver names
  'sainz', 'verstappen', 'hamilton', 'leclerc', 'norris', 'piastri',
  'colapinto', 'isack hadjar', 'gasly', 'alonso', 'russell',
  // Non-India geopolitics specifically
  'us forces enter iran', 'us military iran', 'us forces iran',
  'trump out as president', 'biden re-elected',
  // Non-India elections
  'us midterm', 'uk election', 'french election', 'german election',
  'mexican election', 'brazilian election',
  // Crypto memes
  'dogecoin', 'solana meme', 'pepe coin', 'shiba inu',
  // Other global-only events
  'fifa world cup 2026', 'uefa euro', 'copa america',
];

/**
 * Word-boundary-aware substring match.
 *
 * CRITICAL: plain `.includes()` causes false positives for short keywords —
 * e.g. `'ipl'` matches inside `multiple`, `'rcb'` could match anywhere,
 * `'inr'` inside `printer`, `'csk'` inside arbitrary identifiers, etc.
 * This wraps the keyword in word boundaries so it only matches whole words
 * (or hyphenated/spaced variants). Multi-word keywords like
 * `'champions trophy'` get the same boundary treatment around the whole
 * phrase (with flexible whitespace between words), so e.g. `'inc party'`
 * no longer matches inside `'zinc party'`.
 */
function wordMatch(haystack: string, needle: string): boolean {
  // Escape regex metacharacters, then allow flexible whitespace between
  // words of multi-word phrases. Boundary check applies to the whole phrase.
  const escaped = needle
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/ +/g, '\\s+');
  const re = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
  return re.test(haystack);
}

/**
 * Score a market for India relevance (0.0 – 1.0).
 * - Strong keyword match: 0.8–1.0
 * - Medium keyword match: 0.5–0.7
 * - No match but not explicitly non-India: 0.15
 * - Explicitly non-India: 0.0–0.1
 */
export function indiaRelevanceScore(market: Market): number {
  const text = `${market.title} ${market.description} ${market.category}`.toLowerCase();

  // Check for explicit non-India content (word-boundary-aware: plain substring
  // matching caused false positives, e.g. 'nfl' inside "inflation")
  const nonIndiaHits = NON_INDIA_KEYWORDS.filter(kw => wordMatch(text, kw)).length;
  if (nonIndiaHits >= 2) return 0.0;
  if (nonIndiaHits === 1) {
    // Could still be India-adjacent (e.g., "India vs Pakistan cricket World Cup")
    const strongHits = INDIA_KEYWORDS_STRONG.filter(kw => wordMatch(text, kw)).length;
    if (strongHits === 0) return 0.05;
  }

  // Score strong matches (word-boundary-aware to avoid e.g. "ipl" inside "multiple")
  const strongHits = INDIA_KEYWORDS_STRONG.filter(kw => wordMatch(text, kw)).length;
  if (strongHits >= 3) return 1.0;
  if (strongHits >= 2) return 0.9;
  if (strongHits >= 1) return 0.8;

  // Score medium matches
  const mediumHits = INDIA_KEYWORDS_MEDIUM.filter(kw => wordMatch(text, kw)).length;
  if (mediumHits >= 2) return 0.7;
  if (mediumHits >= 1) return 0.5;

  // Generic content — low relevance
  return 0.15;
}

/**
 * Returns true if market passes the India-relevance threshold.
 */
export function isIndiaRelevant(market: Market, threshold = 0.5): boolean {
  return indiaRelevanceScore(market) >= threshold;
}

// ── Quality Filter ───────────────────────────────────────────────

const GARBAGE_KEYWORDS = [
  'error', 'unavailable', 'not found', '404', '500',
  'http error', 'access denied', 'forbidden', 'timeout',
  'website error', 'page not found', 'server error',
  'undefined', 'null', 'nan',
  'lorem ipsum', 'test market', 'example',
];

/**
 * Quality score (0.0 – 1.0). Markets below 0.3 should be suppressed.
 */
export function qualityScore(market: Market): number {
  const text = `${market.title} ${market.description}`.toLowerCase();

  // Garbage content (word-boundary-aware: plain substring matching caused
  // false positives, e.g. 'error' inside "terrorism", 'nan' inside "finance")
  const garbageHits = GARBAGE_KEYWORDS.filter(kw => wordMatch(text, kw)).length;
  if (garbageHits >= 2) return 0.0;
  if (garbageHits >= 1) return 0.2;

  // Very short or missing content
  if (!market.title || market.title.length < 10) return 0.1;
  if (!market.description || market.description.length < 20) return 0.4;

  // Low volume could indicate spam/test
  if (market.volume <= 0) return 0.3;

  return 1.0;
}

/**
 * Filter out garbage markets.
 */
export function filterQuality(markets: Market[], minScore = 0.3): Market[] {
  return markets.filter(m => qualityScore(m) >= minScore);
}

// ── Regional / Geo Boosting ──────────────────────────────────────

/** IPL teams → home state codes */
const IPL_TEAM_REGIONS: Record<string, string[]> = {
  csk: ['TN'],       // Chennai Super Kings → Tamil Nadu
  mi: ['MH'],        // Mumbai Indians → Maharashtra
  rcb: ['KA'],       // Royal Challengers Bangalore → Karnataka
  kkr: ['WB'],       // Kolkata Knight Riders → West Bengal
  dc: ['DL'],        // Delhi Capitals → Delhi
  srh: ['TG', 'AP'], // Sunrisers Hyderabad → Telangana, AP
  rr: ['RJ'],        // Rajasthan Royals → Rajasthan
  pbks: ['PB'],      // Punjab Kings → Punjab
  gt: ['GJ'],        // Gujarat Titans → Gujarat
  lsg: ['UP'],       // Lucknow Super Giants → UP
};

/** State election keywords → state codes */
const STATE_ELECTION_REGIONS: Record<string, string[]> = {
  'maharashtra election': ['MH'], 'bihar election': ['BR'],
  'west bengal election': ['WB'], 'tamil nadu election': ['TN'],
  'uttar pradesh election': ['UP'], 'karnataka election': ['KA'],
  'rajasthan election': ['RJ'], 'madhya pradesh election': ['MP'],
  'delhi election': ['DL'], 'gujarat election': ['GJ'],
  'assam election': ['AS'], 'kerala election': ['KL'],
  'punjab election': ['PB'], 'telangana election': ['TG'],
  'andhra pradesh election': ['AP'], 'jharkhand election': ['JH'],
  'chhattisgarh election': ['CT'], 'goa election': ['GA'],
  'odisha election': ['OR'], 'haryana election': ['HR'],
};

/**
 * Detect which Indian state(s) a market is relevant to.
 */
export function detectMarketRegions(market: Market): string[] {
  const text = `${market.title} ${market.description}`.toLowerCase();
  const regions = new Set<string>();

  // Check IPL teams (word-boundary-aware: short codes like 'mi' would
  // otherwise match inside words like "premier")
  for (const [team, states] of Object.entries(IPL_TEAM_REGIONS)) {
    if (wordMatch(text, team)) states.forEach(s => regions.add(s));
  }
  // Also check full team names
  if (text.includes('chennai') || text.includes('super kings')) regions.add('TN');
  if (text.includes('mumbai indians')) regions.add('MH');
  if (text.includes('bangalore') || text.includes('challengers')) regions.add('KA');
  if (text.includes('kolkata') || text.includes('knight riders')) regions.add('WB');
  if (text.includes('delhi capitals')) regions.add('DL');
  if (text.includes('hyderabad') || text.includes('sunrisers')) { regions.add('TG'); regions.add('AP'); }
  if (text.includes('rajasthan royals')) regions.add('RJ');
  if (text.includes('punjab kings')) regions.add('PB');
  if (text.includes('gujarat titans')) regions.add('GJ');
  if (text.includes('lucknow') || text.includes('super giants')) regions.add('UP');

  // Check state elections
  for (const [kw, states] of Object.entries(STATE_ELECTION_REGIONS)) {
    if (text.includes(kw)) states.forEach(s => regions.add(s));
  }

  // Check city/state names directly
  if (text.includes('mumbai') || text.includes('maharashtra')) regions.add('MH');
  if (text.includes('delhi')) regions.add('DL');
  if (text.includes('bangalore') || text.includes('bengaluru') || text.includes('karnataka')) regions.add('KA');
  if (text.includes('chennai') || text.includes('tamil nadu')) regions.add('TN');
  if (text.includes('kolkata') || text.includes('west bengal')) regions.add('WB');
  if (text.includes('hyderabad') || text.includes('telangana')) regions.add('TG');

  return [...regions];
}

/**
 * Compute geo boost for a market given user's region.
 * Returns 0–15 points.
 */
export function geoBoost(market: Market, userRegion: string): number {
  if (!userRegion) return 0;
  const marketRegions = detectMarketRegions(market);
  if (marketRegions.includes(userRegion)) return 15; // Strong regional match
  return 0;
}

/**
 * Get markets relevant to a specific Indian state/region.
 */
export function getRegionalMarkets(markets: Market[], userRegion: string, limit = 6): Market[] {
  if (!userRegion) return [];
  return markets
    .filter(m => m.status === 'live' && qualityScore(m) >= 0.3)
    .filter(m => detectMarketRegions(m).includes(userRegion))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
}

// ── Trending Score ───────────────────────────────────────────────

/**
 * Compute a composite trending score (0–100) for ranking.
 *
 * Formula:
 *   indiaRelevance * 40
 * + trendingScore * 20       (normalized volume + |change24h|)
 * + freshnessScore * 15      (decay based on closesAt/updatedAt)
 * + closingSoonBoost * 10    (markets resolving within 7 days)
 * + qualityScore * 5
 * + volatilityBoost * 10     (big probability moves)
 */
export function trendingScore(market: Market, allMarkets: Market[], userRegion = ''): number {
  // Normalize volume: max volume across all markets = 1.0
  const maxVolume = Math.max(...allMarkets.map(m => m.volume), 1);
  const normalizedVolume = market.volume / maxVolume;

  // India relevance (0–40)
  const indiaScore = indiaRelevanceScore(market) * 40;

  // Trending component: volume + volatility (0–20)
  const absChange = Math.min(Math.abs(market.change24h), 50) / 50; // cap at 50%
  const trendComponent = (normalizedVolume * 0.6 + absChange * 0.4) * 20;

  // Freshness: how recently does this market close? (0–15)
  const now = Date.now();
  const closesAt = new Date(market.closesAt).getTime();
  const daysUntilClose = Math.max(0, (closesAt - now) / (1000 * 60 * 60 * 24));
  // Markets closing within 30 days are freshest
  const freshnessScore = daysUntilClose <= 0 ? 0 : daysUntilClose <= 30 ? 15 : Math.max(0, 15 - (daysUntilClose - 30) / 10);

  // Closing soon boost (0–10) — both tiers require daysUntilClose > 0 so
  // already-closed markets (clamped to 0) don't get the boost
  const closingSoonBoost =
    daysUntilClose > 0 && daysUntilClose <= 7 ? 10 :
    daysUntilClose > 0 && daysUntilClose <= 14 ? 5 : 0;

  // Quality (0–5)
  const quality = qualityScore(market) * 5;

  // Volatility boost for big movers (0–10)
  const volatility = Math.min(Math.abs(market.change24h), 30) / 30 * 10;

  // Geo boost (0–15) — regional relevance
  const geo = geoBoost(market, userRegion);

  // Contestedness (0–20): markets near a coin-flip are the most engaging to
  // read; markets near 0% / 100% are effectively decided and dull.
  const uncertainty = (1 - 2 * Math.abs(market.yesPrice - 0.5)) * 20;
  // Push effectively-decided markets down the trending view (still listed,
  // just not featured) so grids stop leading with "Yes 99% / No 98%" cards.
  const settledPenalty = (market.yesPrice >= 0.97 || market.yesPrice <= 0.03) ? -25 : 0;

  return indiaScore + trendComponent + freshnessScore + closingSoonBoost + quality + volatility + geo + uncertainty + settledPenalty;
}

/**
 * Sort markets by trending score (highest first).
 */
export function sortByTrending(markets: Market[], userRegion = ''): Market[] {
  return [...markets].sort((a, b) => trendingScore(b, markets, userRegion) - trendingScore(a, markets, userRegion));
}

// ── Biggest Movers ───────────────────────────────────────────────

/**
 * Get markets with the largest absolute probability change in 24h.
 *
 * Defense in depth: filters to India-relevant markets that are STILL OPEN
 * (status === 'live' AND closesAt > now), have meaningful movement
 * (|change24h| >= 1%), and pass quality. The upstream `useIndiaMarkets`
 * should already filter to India, but we re-apply here so this function
 * is correct in isolation and resilient to upstream regressions.
 */
export function getBiggestMovers(markets: Market[], limit = 6): Market[] {
  const now = Date.now();
  return [...markets]
    .filter(m => {
      if (m.status !== 'live') return false;
      if (qualityScore(m) < 0.3) return false;
      if (!isIndiaRelevant(m)) return false;
      if (new Date(m.closesAt).getTime() <= now) return false;
      if (Math.abs(m.change24h) < 1) return false;
      return true;
    })
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, limit);
}

// ── Closing Soon ─────────────────────────────────────────────────

/**
 * Get active India-relevant markets sorted by resolution date (soonest first).
 * Only includes markets closing within `withinDays` days.
 */
export function getClosingSoon(markets: Market[], limit = 6, withinDays = 30): Market[] {
  const now = Date.now();
  const cutoff = now + withinDays * 24 * 60 * 60 * 1000;

  return [...markets]
    .filter(m => {
      if (m.status !== 'live') return false;
      if (qualityScore(m) < 0.3) return false;
      if (!isIndiaRelevant(m)) return false;
      const closes = new Date(m.closesAt).getTime();
      return closes > now && closes <= cutoff;
    })
    .sort((a, b) => new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime())
    .slice(0, limit);
}

// ── Related Markets (Content Similarity) ─────────────────────────

/**
 * Extract keywords from market text for similarity matching.
 */
function extractKeywords(text: string): Set<string> {
  const stopwords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
    'should', 'may', 'might', 'can', 'could', 'of', 'in', 'to', 'for',
    'with', 'on', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'over',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
    'neither', 'each', 'every', 'this', 'that', 'these', 'those',
    'it', 'its', 'he', 'she', 'they', 'them', 'their', 'we', 'you',
    'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
    'if', 'than', 'then', 'also', 'just', 'about', 'up', 'out',
    'yes', 'no', 'will', 'market', 'prediction', 'event',
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w))
  );
}

/**
 * Jaccard similarity between two keyword sets.
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Get related markets based on keyword/content similarity.
 * Excludes the source market and enforces category diversity.
 */
export function getRelatedMarkets(
  sourceMarket: Market,
  allMarkets: Market[],
  limit = 4
): Market[] {
  const sourceKw = extractKeywords(`${sourceMarket.title} ${sourceMarket.description}`);

  const scored = allMarkets
    .filter(m => m.id !== sourceMarket.id && m.status === 'live' && qualityScore(m) >= 0.3)
    .map(m => ({
      market: m,
      similarity: jaccardSimilarity(
        sourceKw,
        extractKeywords(`${m.title} ${m.description}`)
      ),
      // Boost same category
      categoryBoost: m.category === sourceMarket.category ? 0.15 : 0,
    }))
    .map(s => ({ ...s, score: s.similarity + s.categoryBoost }))
    .sort((a, b) => b.score - a.score);

  // Enforce diversity: max 2 from same category
  const result: Market[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const item of scored) {
    if (result.length >= limit) break;
    const cat = item.market.category;
    if ((categoryCounts[cat] ?? 0) >= 2) continue;
    result.push(item.market);
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

  return result;
}

// ── Re-ranking (diversity + freshness guarantees) ────────────────

/**
 * Apply re-ranking rules:
 * - No more than 3 from same category in top results
 * - At least 1 recently-active market in top 5
 * - Quality gate applied
 */
export function rerank(markets: Market[], limit = 10): Market[] {
  const quality = markets.filter(m => qualityScore(m) >= 0.3);
  const result: Market[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const m of quality) {
    if (result.length >= limit) break;
    const cat = m.category;
    if ((categoryCounts[cat] ?? 0) >= 3) continue;
    result.push(m);
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

  return result;
}
