import type { MarketCategory } from '@/lib/types';
import type { EventCategory } from '@/data/trending-events';

/**
 * SEO category hub configs. Each hub is a keyword-targeted landing page that
 * aggregates live India-relevant markets + trending events + related blog
 * posts for one topic cluster the site doesn't yet rank for.
 *
 * NOTE: there is intentionally NO 'crypto' hub — /crypto already exists as a
 * dedicated route.
 */
export type CategoryHubSlug = 'cricket' | 'elections' | 'economy' | 'bollywood';

export interface CategoryHub {
  slug: CategoryHubSlug;
  /** SEO <title> (rendered as "<title> | India Predictions") */
  title: string;
  h1: string;
  /** <=155 chars meta description */
  metaDescription: string;
  /** Answer-first 120–150 word intro written for the target keyword */
  intro: string;
  keywords: string;
  /** Market.category values that map to this hub */
  marketCategories: MarketCategory[];
  /** TrendingEvent.category values that map to this hub */
  eventCategories: EventCategory[];
  /** 2–3 blog slugs from BLOG_POSTS that fit this topic */
  relatedBlogSlugs: string[];
}

export const CATEGORY_HUBS: CategoryHub[] = [
  {
    slug: 'cricket',
    title: 'Cricket Prediction Market India — Live IPL & Match Odds',
    h1: 'Cricket Prediction Markets in India',
    metaDescription:
      'Live cricket prediction market odds for India — IPL winners, match outcomes and player markets as crowd-sourced probabilities. Informational, not betting.',
    intro:
      'A cricket prediction market lets you read the crowd-sourced probability of a cricket outcome — who wins the IPL, which side takes a match, or whether a milestone is reached — as a live price rather than a bookmaker line. India Predictions aggregates these odds from Polymarket, scores each market for India relevance, and surfaces the ones that matter to Indian fans: IPL 2026 winner and playoff races, India national-team fixtures, and marquee player markets. Prices are shown as implied probabilities (a contract at 62 means the market thinks the outcome is 62% likely) and refresh roughly every five minutes. This is an informational tracker, not a betting platform — there is no real-money trading and no INR wagering. Use it to gauge how cricket sentiment is moving, compare it against your own read, and follow the markets the rest of India is watching.',
    keywords:
      'cricket prediction market, IPL prediction market, IPL 2026 predictions, cricket odds india, IPL winner prediction, india cricket prediction',
    marketCategories: ['cricket'],
    eventCategories: ['sports'],
    relatedBlogSlugs: [
      'ipl-2026-prediction-markets-cricket-betting',
      'ipl-2026-preview-schedule-picks-predictions',
      'ipl-2026-vs-state-elections-sports-politics-prediction-markets',
    ],
  },
  {
    slug: 'elections',
    title: 'Election Prediction Market India — Live Poll Odds',
    h1: 'Election Prediction Markets in India',
    metaDescription:
      'Live election prediction market odds for India — state polls, party seat shares and outcomes as crowd-sourced probabilities. Informational, not betting.',
    intro:
      'An election prediction market turns political outcomes into a live probability you can read at a glance — which party wins a state, whether an alliance crosses the majority mark, or how a closely fought seat tilts. India Predictions aggregates these markets from Polymarket, filters them for India relevance, and tracks the contests Indian voters and analysts care about: West Bengal, Tamil Nadu, Kerala, Assam and other state elections, plus national political questions. Each market is shown as an implied probability that updates roughly every five minutes as campaigns, alliances and news shift the odds — often faster and more accurately than static exit polls. This is an informational tracker, not a betting site: no real-money trading, no INR stakes. Use it to follow how the political crowd is pricing each race and to sanity-check headlines against what people are actually willing to back.',
    keywords:
      'election prediction market india, india election odds, state election prediction, west bengal election prediction, election forecast india, political prediction market',
    marketCategories: ['politics'],
    eventCategories: ['politics'],
    relatedBlogSlugs: [
      '2026-state-elections-prediction-market-tracker',
      'west-bengal-2026-most-consequential-election',
      'ipl-2026-vs-state-elections-sports-politics-prediction-markets',
    ],
  },
  {
    slug: 'economy',
    title: 'RBI Rate & Nifty Prediction Market India — Live Odds',
    h1: 'Economy & Markets Prediction Hub',
    metaDescription:
      'Live prediction market odds for India’s economy — RBI rate decisions, Nifty and Sensex levels, inflation and rupee as crowd-sourced probabilities.',
    intro:
      'An economy prediction market prices the questions that move Indian portfolios — will the RBI cut rates at the next MPC, where the Nifty closes, how inflation or the rupee tracks — as live, crowd-sourced probabilities. India Predictions aggregates these markets from Polymarket, scores them for India relevance, and gathers the macro questions that matter: RBI repo-rate decisions, Nifty and Sensex levels, CPI prints, crude-oil shocks and currency moves. Each market shows an implied probability (a 45 contract means a 45% chance) and refreshes about every five minutes, often reacting to data releases faster than economist surveys. This is an informational tracker, not a trading or advisory platform — no real-money positions, no INR transactions, and nothing here is financial advice. Use it to see how the market crowd is pricing RBI policy and Indian-market outcomes, then weigh that against your own analysis.',
    keywords:
      'RBI rate prediction, nifty prediction market, RBI MPC prediction, sensex prediction, india economy prediction market, inflation prediction india, rupee prediction',
    marketCategories: ['economy'],
    eventCategories: ['economy', 'markets'],
    relatedBlogSlugs: [
      'rbi-rate-decision-prediction-market-signals',
      'india-market-volatility-vix-surge-2026',
      'west-asia-crisis-impact-indian-economy-2026',
    ],
  },
  {
    slug: 'bollywood',
    title: 'Bollywood Box Office Prediction Market India — Live Odds',
    h1: 'Bollywood Prediction Markets in India',
    metaDescription:
      'Live Bollywood prediction market odds — box office collections, hit-or-flop and entertainment outcomes as crowd-sourced probabilities. Informational, not betting.',
    intro:
      'A Bollywood prediction market turns entertainment questions into live probabilities — whether a big release crosses a box-office milestone, opens as a hit or a flop, or how an awards race resolves. India Predictions aggregates these markets from Polymarket, filters them for India relevance, and surfaces the Bollywood and Indian-entertainment outcomes worth watching: opening-weekend and lifetime collection targets, hit-or-flop calls on marquee films, and other culture-driven markets. Each is shown as an implied probability that refreshes roughly every five minutes as buzz, reviews and early numbers shift sentiment. This is an informational tracker, not a betting platform — there is no real-money trading and no INR wagering. Use it to read how the crowd is pricing the next big release, compare it with the trade chatter, and follow the entertainment markets Indian audiences are talking about.',
    keywords:
      'bollywood box office prediction, bollywood prediction market, box office prediction india, hit or flop prediction, movie box office odds, bollywood collection prediction',
    marketCategories: ['entertainment'],
    eventCategories: ['entertainment'],
    relatedBlogSlugs: [
      'what-are-prediction-markets-guide-india',
      'prediction-market-analytics-data-driven-traders',
    ],
  },
];

export function getCategoryHub(slug: string | undefined): CategoryHub | undefined {
  return CATEGORY_HUBS.find((h) => h.slug === slug);
}
