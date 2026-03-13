export type EventCategory =
  | 'markets'
  | 'economy'
  | 'politics'
  | 'sports'
  | 'geopolitics'
  | 'technology'
  | 'entertainment'
  | 'regulation'
  | 'energy';

export type EventStatus = 'active' | 'critical' | 'upcoming' | 'completed';

export interface TrendingEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  summary: string;
  imageUrl?: string;
  keyDrivers?: string[];
  keyDataPoints?: { label: string; value: string }[];
  keyDetails?: string[];
  keyTrends?: string[];
  keyReleases?: string[];
  keyBattles?: { state: string; detail: string }[];
  impactOnIndia?: string[];
  mckinseyAnalysis: string[];
  impactProbability?: string;
  predictionMarketAngle: string;
  categoryLabel: string;
  categoryEmoji: string;
  updatedAt: string;
}

export const TRENDING_EVENTS: TrendingEvent[] = PLACEHOLDER_CONTENT

export const EVENT_CATEGORIES: {
  value: EventCategory | 'all';
  label: string;
  emoji: string;
}[] = [
  { value: 'all', label: 'All Events', emoji: '🔥' },
  { value: 'markets', label: 'Markets', emoji: '📉' },
  { value: 'economy', label: 'Economy', emoji: '🏦' },
  { value: 'politics', label: 'Politics', emoji: '🗳️' },
  { value: 'sports', label: 'Sports', emoji: '🏏' },
  { value: 'geopolitics', label: 'Geopolitics', emoji: '🌍' },
  { value: 'technology', label: 'Technology', emoji: '💻' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'regulation', label: 'Regulation', emoji: '⚖️' },
  { value: 'energy', label: 'Energy', emoji: '⛽' },
];
