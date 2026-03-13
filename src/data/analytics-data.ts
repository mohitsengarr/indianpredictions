// McKinsey-style analytics data derived from trending events

export interface SectorScore {
  sector: string;
  score: number;
  change: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface EventImpact {
  event: string;
  shortName: string;
  markets: number;
  currency: number;
  inflation: number;
  consumer: number;
  employment: number;
}

export interface ProbabilityBucket {
  range: string;
  count: number;
  fill: string;
}

export interface CorrelationLink {
  source: string;
  target: string;
  strength: number;
}

export interface TimelineItem {
  date: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

export interface VolatilityPoint {
  date: string;
  vix: number;
  marketVol: number;
}

export interface TopMover {
  event: string;
  change: number;
  current: number;
  direction: 'up' | 'down';
}

export interface WaterfallItem {
  name: string;
  value: number;
  cumulative: number;
  fill: string;
}

export interface EconomicMetric {
  label: string;
  value: string;
  numValue: number;
  change: number;
  unit: string;
  sparkline: number[];
}

export interface CategoryRadar {
  category: string;
  activity: number;
  volume: number;
  sentiment: number;
  volatility: number;
  fullMark: 100;
}

// ── Overall Market Sentiment ──
export const MARKET_SENTIMENT = {
  overall: 38, // 0-100, below 50 = bearish
  label: 'Cautious',
  bullish: 28,
  neutral: 34,
  bearish: 38,
  drivers: [
    'West Asia crisis dragging sentiment',
    'VIX up 100% in 30 days',
    'FII outflows accelerating',
    'RBI holding steady provides floor',
  ],
};

// ── Sector Scores ──
export const SECTOR_SCORES: SectorScore[] = [
  { sector: 'IT & Tech', score: 62, change: -4.2, sentiment: 'neutral' },
  { sector: 'Banking', score: 55, change: -2.8, sentiment: 'neutral' },
  { sector: 'Energy', score: 71, change: 8.5, sentiment: 'bullish' },
  { sector: 'Auto', score: 38, change: -7.1, sentiment: 'bearish' },
  { sector: 'FMCG', score: 58, change: 1.2, sentiment: 'neutral' },
  { sector: 'Metals', score: 34, change: -9.3, sentiment: 'bearish' },
  { sector: 'Pharma', score: 64, change: 3.1, sentiment: 'bullish' },
  { sector: 'Realty', score: 42, change: -5.4, sentiment: 'bearish' },
];

// ── Category Radar Data ──
export const CATEGORY_RADAR: CategoryRadar[] = [
  { category: 'Markets', activity: 92, volume: 85, sentiment: 35, volatility: 88, fullMark: 100 },
  { category: 'Politics', activity: 78, volume: 72, sentiment: 55, volatility: 65, fullMark: 100 },
  { category: 'Sports', activity: 85, volume: 90, sentiment: 82, volatility: 45, fullMark: 100 },
  { category: 'Geopolitics', activity: 95, volume: 68, sentiment: 22, volatility: 92, fullMark: 100 },
  { category: 'Tech', activity: 65, volume: 45, sentiment: 70, volatility: 38, fullMark: 100 },
  { category: 'Entertainment', activity: 55, volume: 35, sentiment: 75, volatility: 28, fullMark: 100 },
];

// ── Event Impact Heatmap ──
export const EVENT_IMPACTS: EventImpact[] = [
  { event: 'Stock Market Crash', shortName: 'Market Crash', markets: -85, currency: -60, inflation: 20, consumer: -40, employment: -15 },
  { event: 'RBI Rate Decision', shortName: 'RBI Policy', markets: 30, currency: 25, inflation: -15, consumer: 20, employment: 10 },
  { event: 'US-India Trade Deal', shortName: 'Trade Deal', markets: 45, currency: 35, inflation: -10, consumer: 30, employment: 40 },
  { event: 'Gold Rally', shortName: 'Gold Rally', markets: 15, currency: -20, inflation: 25, consumer: -10, employment: 0 },
  { event: 'State Elections', shortName: 'Elections', markets: -20, currency: -10, inflation: 5, consumer: -5, employment: 15 },
  { event: 'West Asia Crisis', shortName: 'West Asia', markets: -70, currency: -55, inflation: 65, consumer: -45, employment: -25 },
  { event: 'IPL 2026', shortName: 'IPL Season', markets: 10, currency: 0, inflation: 5, consumer: 60, employment: 35 },
  { event: 'Tech Ecosystem', shortName: 'Tech/Startups', markets: 25, currency: 10, inflation: 0, consumer: 15, employment: 55 },
];

// ── Probability Distribution ──
export const PROBABILITY_DISTRIBUTION: ProbabilityBucket[] = [
  { range: '0-20%', count: 3, fill: '#ef4444' },
  { range: '20-40%', count: 5, fill: '#f97316' },
  { range: '40-60%', count: 8, fill: '#eab308' },
  { range: '60-80%', count: 6, fill: '#22c55e' },
  { range: '80-100%', count: 2, fill: '#06b6d4' },
];

// ── Market Correlations ──
export const CORRELATION_LINKS: CorrelationLink[] = [
  { source: 'Oil Price', target: 'Nifty', strength: -0.78 },
  { source: 'Oil Price', target: 'Inflation', strength: 0.85 },
  { source: 'Oil Price', target: 'Rupee', strength: -0.72 },
  { source: 'Nifty', target: 'FII Flows', strength: 0.82 },
  { source: 'RBI Policy', target: 'Rupee', strength: 0.65 },
  { source: 'RBI Policy', target: 'Bond Yields', strength: -0.71 },
  { source: 'Inflation', target: 'RBI Policy', strength: 0.88 },
  { source: 'FII Flows', target: 'Rupee', strength: 0.75 },
  { source: 'Gold Price', target: 'Inflation', strength: 0.62 },
  { source: 'Elections', target: 'Nifty', strength: -0.45 },
  { source: 'West Asia', target: 'Oil Price', strength: 0.92 },
  { source: 'Trade Deal', target: 'Nifty', strength: 0.58 },
];

export const CORRELATION_NODES = [
  'Oil Price', 'Nifty', 'Inflation', 'Rupee', 'RBI Policy',
  'FII Flows', 'Bond Yields', 'Gold Price', 'Elections', 'West Asia', 'Trade Deal',
];

// ── Timeline Events ──
export const TIMELINE_EVENTS: TimelineItem[] = [
  { date: '2026-03-14', event: 'RBI MPC Minutes Release', importance: 'medium', category: 'Economy' },
  { date: '2026-03-16', event: 'Rajya Sabha Elections (37 seats)', importance: 'high', category: 'Politics' },
  { date: '2026-03-19', event: 'Bollywood 4-Way Clash', importance: 'low', category: 'Entertainment' },
  { date: '2026-03-21', event: 'US Fed Rate Decision', importance: 'high', category: 'Economy' },
  { date: '2026-03-28', event: 'IPL 2026 Season Opens', importance: 'high', category: 'Sports' },
  { date: '2026-04-01', event: 'FY27 Begins / New Tax Rules', importance: 'medium', category: 'Economy' },
  { date: '2026-04-08', event: 'RBI MPC April Decision', importance: 'high', category: 'Economy' },
  { date: '2026-04-15', event: 'Q4 FY26 Results Season', importance: 'medium', category: 'Markets' },
  { date: '2026-05-01', event: 'State Election Phase 1', importance: 'high', category: 'Politics' },
  { date: '2026-05-15', event: 'GDP Q4 FY26 Data Release', importance: 'medium', category: 'Economy' },
];

// ── Economic Health Scorecard ──
export const ECONOMIC_METRICS: EconomicMetric[] = [
  { label: 'GDP Growth', value: '7.4%', numValue: 7.4, change: 0.1, unit: '%', sparkline: [6.8, 7.0, 7.1, 7.2, 7.3, 7.4] },
  { label: 'CPI Inflation', value: '2.1%', numValue: 2.1, change: -0.4, unit: '%', sparkline: [4.2, 3.8, 3.2, 2.8, 2.5, 2.1] },
  { label: 'Repo Rate', value: '5.25%', numValue: 5.25, change: 0, unit: '%', sparkline: [6.5, 6.25, 6.0, 5.75, 5.5, 5.25] },
  { label: 'Sensex', value: '72,450', numValue: 72450, change: -5.2, unit: 'pts', sparkline: [78200, 77100, 76000, 74800, 73200, 72450] },
  { label: 'Rupee/USD', value: '87.42', numValue: 87.42, change: -2.1, unit: 'INR', sparkline: [84.5, 85.1, 85.8, 86.3, 86.9, 87.42] },
  { label: 'Brent Crude', value: '$101.3', numValue: 101.3, change: 14.8, unit: 'USD', sparkline: [82, 85, 88, 92, 97, 101.3] },
  { label: 'Gold (INR/10g)', value: '1,64,500', numValue: 164500, change: 8.2, unit: 'INR', sparkline: [148000, 152000, 155000, 158000, 161000, 164500] },
];

// ── Top Movers ──
export const TOP_MOVERS: TopMover[] = [
  { event: 'Nifty Recovery >24K', change: -27, current: 38, direction: 'down' },
  { event: 'Iran-US Ceasefire', change: -18, current: 22, direction: 'down' },
  { event: 'RBI Rate Cut (June)', change: 12, current: 45, direction: 'up' },
  { event: 'IPL Starts On Time', change: -8, current: 72, direction: 'down' },
  { event: 'Gold >$5,500 Q2', change: 15, current: 58, direction: 'up' },
  { event: 'BJP Wins 3+ States', change: 5, current: 42, direction: 'up' },
  { event: 'Oil >$120 Q2', change: 22, current: 31, direction: 'up' },
  { event: 'Startup Funding >$15B', change: -6, current: 35, direction: 'down' },
];

// ── Sector Impact Waterfall ──
export const WATERFALL_DATA: WaterfallItem[] = [
  { name: 'Baseline', value: 100, cumulative: 100, fill: '#64748b' },
  { name: 'West Asia', value: -18, cumulative: 82, fill: '#ef4444' },
  { name: 'Oil Surge', value: -12, cumulative: 70, fill: '#ef4444' },
  { name: 'FII Outflows', value: -8, cumulative: 62, fill: '#f97316' },
  { name: 'Trade Deal', value: 10, cumulative: 72, fill: '#22c55e' },
  { name: 'RBI Stability', value: 6, cumulative: 78, fill: '#22c55e' },
  { name: 'IPL Boost', value: 5, cumulative: 83, fill: '#06b6d4' },
  { name: 'Tech Growth', value: 4, cumulative: 87, fill: '#8b5cf6' },
  { name: 'Net Impact', value: 87, cumulative: 87, fill: '#eab308' },
];

// ── Volatility Index ──
export const VOLATILITY_DATA: VolatilityPoint[] = [
  { date: 'Jan 1', vix: 12.5, marketVol: 14.2 },
  { date: 'Jan 15', vix: 13.1, marketVol: 15.0 },
  { date: 'Feb 1', vix: 11.8, marketVol: 13.5 },
  { date: 'Feb 15', vix: 14.2, marketVol: 16.8 },
  { date: 'Mar 1', vix: 16.5, marketVol: 19.2 },
  { date: 'Mar 5', vix: 19.2, marketVol: 22.5 },
  { date: 'Mar 8', vix: 23.4, marketVol: 28.1 },
  { date: 'Mar 10', vix: 22.8, marketVol: 26.3 },
  { date: 'Mar 12', vix: 19.8, marketVol: 24.5 },
  { date: 'Mar 13', vix: 19.8, marketVol: 23.8 },
];

// ── Market Pulse Ticker Data ──
export const MARKET_PULSE_DATA = [
  { label: 'Sensex', value: '72,450', change: -2.1 },
  { label: 'Nifty 50', value: '22,124', change: -1.8 },
  { label: 'Gold', value: '$5,265', change: 1.4 },
  { label: 'Brent Crude', value: '$101.3', change: 3.2 },
  { label: 'USD/INR', value: '87.42', change: -0.3 },
  { label: 'India VIX', value: '19.80', change: -15.0 },
  { label: 'Silver', value: '$94.50', change: 2.1 },
  { label: 'Nifty Bank', value: '48,320', change: -1.5 },
];
