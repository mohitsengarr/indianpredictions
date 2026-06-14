/**
 * Multi-outcome market grouping (Polymarket-style).
 *
 * Polymarket's most engaging cards aren't binary Yes/No — they group related
 * markets into one "who will win X?" card with each outcome's probability.
 * Our markets arrive as individual binary markets, but related ones share a
 * trailing phrase:
 *   "Will Carlos Sainz be the 2026 F1 Drivers' Champion?"
 *   "Will Franco Colapinto be the 2026 F1 Drivers' Champion?"
 *   "Will the INC win the most seats in the 2026 Tamil Nadu election?"
 *   "Will the BJP win the most seats in the 2026 Tamil Nadu election?"
 * The entity varies (prefix); the question is shared (suffix). We group by the
 * shared trailing phrase and surface each member as an outcome.
 */

import type { Market } from './types';

export interface MarketGroup {
  /** Stable id derived from the shared phrase */
  id: string;
  /** Human question, e.g. "2026 F1 Drivers' Champion" */
  question: string;
  category: Market['category'];
  /** Outcomes sorted by probability desc */
  outcomes: { market: Market; label: string; yesPrice: number }[];
  /** Total volume across the group */
  volume: number;
  /** Soonest close among members */
  closesAt: string;
}

const STOPWORD_PREFIX = /^(will|is|are|does|do|can|the|a|an)\s+/i;

function words(s: string): string[] {
  return s.replace(/\?+$/, '').trim().split(/\s+/);
}

function normWord(w: string): string {
  return w.toLowerCase().replace(/[^\w]/g, '');
}

/** Loose bucket key: last 3 words, normalized. Gathers candidates that may
 *  share a longer common question, refined below. */
function bucketKey(title: string): string {
  const w = words(title);
  if (w.length < 5) return '';
  return w.slice(-3).map(normWord).join(' ');
}

/** Longest common trailing run of words (case-insensitive) across titles.
 *  Returns the count of shared trailing words. */
function commonSuffixLen(titleWords: string[][]): number {
  if (titleWords.length === 0) return 0;
  const minLen = Math.min(...titleWords.map((w) => w.length));
  let n = 0;
  while (n < minLen) {
    const wordAt = normWord(titleWords[0][titleWords[0].length - 1 - n]);
    if (titleWords.every((w) => normWord(w[w.length - 1 - n]) === wordAt)) n++;
    else break;
  }
  return n;
}

/**
 * Group markets into multi-outcome races. Forms a group when 3+ markets share
 * a trailing question phrase (≥3 words), leaving short, distinct entity labels.
 * Handles both "Will <team> win the IPL 2026 title?" (entity at front) and
 * "Will <party> win the most seats in the 2026 Tamil Nadu election?" (long
 * shared tail) by computing the longest common suffix per bucket rather than a
 * fixed length. Markets that don't group are left for normal binary rendering.
 */
export function groupMarkets(
  markets: Market[],
  opts: { minMembers?: number; maxOutcomes?: number } = {},
): { groups: MarketGroup[]; groupedIds: Set<string> } {
  const minMembers = opts.minMembers ?? 3;
  const maxOutcomes = opts.maxOutcomes ?? 8;

  const buckets = new Map<string, Market[]>();
  for (const m of markets) {
    if (m.status !== 'live') continue;
    const key = bucketKey(m.title);
    if (!key) continue;
    const arr = buckets.get(key) ?? [];
    arr.push(m);
    buckets.set(key, arr);
  }

  const groups: MarketGroup[] = [];
  const groupedIds = new Set<string>();

  for (const [, members] of buckets) {
    if (members.length < minMembers) continue;

    const memberWords = members.map((m) => words(m.title));
    const sfxLen = commonSuffixLen(memberWords);
    if (sfxLen < 3) continue; // need a real shared question

    // Label = each title minus the shared suffix and any leading stopwords
    // ("Will the INC ..." → "INC").
    const stripStops = (s: string) => { let r = s; while (STOPWORD_PREFIX.test(r)) r = r.replace(STOPWORD_PREFIX, ''); return r.trim(); };
    const labels = memberWords.map((w) => stripStops(w.slice(0, w.length - sfxLen).join(' ')));
    const distinct = new Set(labels.map((l) => l.toLowerCase()));
    if (distinct.size < minMembers) continue;
    // Labels must read cleanly as contender names (short, non-empty).
    if (labels.some((l) => !l || l.split(/\s+/).length > 5)) continue;

    // Question = the shared trailing phrase. The dominant India case is a
    // "win ..." race → phrase it as "Who wins ..."; otherwise present the
    // shared phrase as-is (capitalized).
    const sample = memberWords[0];
    let phrase = sample.slice(sample.length - sfxLen).join(' ').replace(/\?+$/, '').trim();
    let cleanQuestion: string;
    if (/^win\b/i.test(phrase)) {
      cleanQuestion = 'Who wins ' + phrase.replace(/^win\s+/i, '');
    } else {
      cleanQuestion = phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }

    const outcomes = members
      .map((m, i) => ({ market: m, label: labels[i], yesPrice: m.yesPrice }))
      .sort((a, b) => b.yesPrice - a.yesPrice)
      .slice(0, maxOutcomes);

    outcomes.forEach((o) => groupedIds.add(o.market.id));

    groups.push({
      id: `grp-${members[0].id}`,
      question: cleanQuestion,
      category: members[0].category,
      outcomes,
      volume: members.reduce((s, m) => s + m.volume, 0),
      closesAt: members.map((m) => m.closesAt).sort()[0],
    });
  }

  groups.sort((a, b) => b.volume - a.volume);
  return { groups, groupedIds };
}
