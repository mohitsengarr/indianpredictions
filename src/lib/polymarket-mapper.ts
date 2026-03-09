/**
 * Maps Polymarket Gamma API market objects → our internal Market type.
 *
 * Since Polymarket is US-focused and uses USD, we treat the probability
 * price (0–1) directly as our yes/no price. Volume/liquidity are stored
 * as-is (USD); formatters render them in context.
 */

import { Market, MarketCategory } from './types';
import { PolymarketMarket } from './polymarket-api';

/** Best-effort category mapping from Polymarket tags / text */
function inferCategory(market: PolymarketMarket): MarketCategory {
  const text = [
    market.question ?? '',
    ...(market.tags?.map((t) => t.label ?? '') ?? []),
    market.category ?? '',
  ]
    .join(' ')
    .toLowerCase();

  if (/cricket|ipl|bcci|t20|odi|test match|india.*(win|tour)|match/.test(text)) return 'cricket';
  if (/bitcoin|crypto|eth|blockchain|upi|web3|token|defi|nft/.test(text)) return 'crypto';
  if (/election|vote|president|prime minister|minister|politics|parliament|senate|congress|modi|trump|biden|harris/.test(text)) return 'politics';
  if (/movie|film|box office|bollywood|oscar|emmy|award|celebrity|music|album|series/.test(text)) return 'entertainment';
  if (/gdp|inflation|rate|fed|rbi|nifty|stock|nasdaq|dow|market|economy|cpi|recession|bank/.test(text)) return 'economy';

  // Default to crypto as Polymarket has lots of those
  return 'crypto';
}

/** Generate a synthetic price history from the current price */
function syntheticPriceHistory(yesPrice: number) {
  const points: { time: string; yes: number; no: number }[] = [];
  let price = Math.max(0.05, Math.min(0.95, yesPrice - 0.1 + Math.random() * 0.05));
  for (let i = 30; i >= 0; i--) {
    price = Math.max(0.05, Math.min(0.95, price + (Math.random() - 0.48) * 0.035));
    points.push({
      time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      yes: parseFloat(price.toFixed(2)),
      no: parseFloat((1 - price).toFixed(2)),
    });
  }
  // Anchor last point to actual current price
  points[points.length - 1].yes = yesPrice;
  points[points.length - 1].no = parseFloat((1 - yesPrice).toFixed(2));
  return points;
}

export function mapPolymarketToMarket(pm: PolymarketMarket): Market | null {
  // We need at least 2 tokens (YES / NO) for a binary market
  if (!pm.tokens || pm.tokens.length < 2) return null;

  // Find YES / NO tokens
  const yesToken = pm.tokens.find((t) => t.outcome?.toLowerCase() === 'yes') ?? pm.tokens[0];
  const noToken = pm.tokens.find((t) => t.outcome?.toLowerCase() === 'no') ?? pm.tokens[1];

  const yesPrice = parseFloat(String(yesToken.price ?? 0.5));
  const noPrice = parseFloat(String(noToken.price ?? 1 - yesPrice));

  // Skip degenerate markets
  if (yesPrice <= 0 || yesPrice >= 1) return null;

  const endDate = pm.endDate ?? '';
  const startDate = pm.startDate ?? new Date().toISOString();

  // Derive 24h change: we don't have historical OHLC from this endpoint,
  // so we synthesise a small random change capped at ±10%
  const change24h = parseFloat(((Math.random() * 10 - 5)).toFixed(1));

  // Volume: Polymarket uses USD. We display as-is, formatter will label USD.
  const volume = parseFloat(String(pm.volume ?? pm.volume24hr ?? 0));
  const liquidity = parseFloat(String(pm.liquidity ?? 0));

  // Estimate traders from liquidity / avg trade size (~$50)
  const traders = liquidity > 0 ? Math.round(liquidity / 50) : Math.round(volume / 80);

  return {
    id: pm.id,
    title: pm.question,
    description: pm.description ?? pm.question,
    category: inferCategory(pm),
    status: pm.closed ? 'closed' : pm.active ? 'live' : 'draft',
    yesPrice,
    noPrice,
    volume,
    liquidity,
    traders,
    change24h,
    closesAt: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: endDate || new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionCriteria: `This market resolves YES if the stated outcome occurs. Resolution source: ${pm.resolutionSource ?? 'Polymarket Admin'}.`,
    resolutionSource: pm.resolutionSource ?? 'Polymarket',
    resolutionSourceUrl: `https://polymarket.com/event/${pm.slug ?? pm.id}`,
    contextNote: undefined,
    createdAt: startDate,
    priceHistory: syntheticPriceHistory(yesPrice),
  };
}

export function mapPolymarketsToMarkets(pms: PolymarketMarket[]): Market[] {
  return pms.map(mapPolymarketToMarket).filter((m): m is Market => m !== null);
}
