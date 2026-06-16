import { useEffect, useRef, useState } from 'react';
import { Market } from '@/lib/types';
import { formatINR, formatPercent, formatProbability, timeUntil } from '@/lib/formatters';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Clock, Users, ExternalLink, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLivePrice } from '@/contexts/LivePricesContext';
import { trackMarketClick, trackPolymarketClick } from '@/lib/analytics';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

/** Compact inline probability sparkline drawn from the market's price history. */
const Sparkline = ({ market }: { market: Market }) => {
  const data = market.priceHistory;
  if (!data || data.length < 2) return null;
  const prices = data.map((d) => d.yes);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 100, h = 24;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.yes - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' L ');
  const up = prices[prices.length - 1] >= prices[0];
  const color = up ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-6 mt-2" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M ${pts}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
};

interface MarketCardProps {
  market: Market;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  cricket:      'bg-blue-50 text-blue-700 border-blue-100',
  economy:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  entertainment:'bg-purple-50 text-purple-700 border-purple-100',
  crypto:       'bg-orange-50 text-orange-700 border-orange-100',
  politics:     'bg-red-50 text-red-700 border-red-100',
};

const MarketCard = ({ market, compact = false }: MarketCardProps) => {
  const navigate = useNavigate();
  const cat = CATEGORY_LABELS[market.category];
  const catColor = CATEGORY_COLORS[market.category] ?? 'bg-muted text-muted-foreground border-border';

  // Live price
  const livePrice = useLivePrice(market.id);
  const yesPrice = livePrice?.yesPrice ?? market.yesPrice;
  const noPrice  = livePrice?.noPrice  ?? market.noPrice;
  const isPositive = market.change24h >= 0;

  // Flash state
  const [cardFlash, setCardFlash] = useState<'up' | 'down' | null>(null);
  const [yesPriceFlash, setYesPriceFlash] = useState<'up' | 'down' | null>(null);
  const [noPriceFlash,  setNoPriceFlash]  = useState<'up' | 'down' | null>(null);
  const prevYesRef = useRef(yesPrice);

  useEffect(() => {
    const prev = prevYesRef.current;
    if (prev !== yesPrice) {
      const dir = yesPrice > prev ? 'up' : 'down';
      setCardFlash(dir);
      setYesPriceFlash(dir);
      setNoPriceFlash(dir === 'up' ? 'down' : 'up');
      prevYesRef.current = yesPrice;
      const t = setTimeout(() => { setCardFlash(null); setYesPriceFlash(null); setNoPriceFlash(null); }, 900);
      return () => clearTimeout(t);
    }
  }, [yesPrice]);

  const yesPct = Math.round(yesPrice * 100);
  // When prices are complementary, derive noPct from yesPct so widths always sum to 100%
  const noPct  = Math.abs(yesPrice + noPrice - 1) <= 0.02 ? 100 - yesPct : Math.round(noPrice * 100);

  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(market.id);

  const { record } = useRecentlyViewed();

  const openMarket = () => { trackMarketClick(market.id, market.category); record(market.id); navigate(`/market/${market.id}`); };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openMarket}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMarket(); } }}
      className={`group w-full text-left bg-white rounded-xl border border-border shadow-card p-4 transition-all duration-200 ease-out
        hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-0.5 active:scale-[0.98]
        overflow-hidden relative
        ${cardFlash === 'up' ? 'price-flash-up' : cardFlash === 'down' ? 'price-flash-down' : ''}`}
    >
      {/* Watchlist star (top-right) */}
      <button
        type="button"
        aria-label={watched ? 'Remove from My Markets' : 'Add to My Markets'}
        aria-pressed={watched}
        onClick={(e) => { e.stopPropagation(); toggle(market.id); }}
        className="absolute top-2.5 right-2.5 z-10 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <Star className={`w-4 h-4 transition-colors ${watched ? 'fill-secondary text-secondary' : 'text-muted-foreground/40 hover:text-secondary'}`} />
      </button>

      {/* Live pulse dot */}
      {livePrice && (
        <span className="absolute top-3 right-9 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success opacity-80" />
        </span>
      )}

      {/* Category chip + time */}
      <div className="flex items-center justify-between mb-2.5 pr-7">
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${catColor}`}>
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeUntil(market.closesAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-sm leading-snug mb-3 text-foreground line-clamp-2
        group-hover:text-primary transition-colors duration-200">
        {market.title}
      </h3>

      {/* Probability bar */}
      <div className="mb-3">
        <div className="flex rounded-lg overflow-hidden h-7 text-xs font-bold">
          <div
            className={`flex items-center justify-center text-white transition-all duration-500
              ${yesPriceFlash === 'up' ? 'price-num-up' : yesPriceFlash === 'down' ? 'price-num-down' : ''}`}
            style={{ width: `${yesPct}%`, background: 'hsl(var(--success))' }}
          >
            {yesPct >= 20 ? `Yes ${yesPct}%` : yesPct >= 10 ? `${yesPct}%` : ''}
          </div>
          <div
            className={`flex items-center justify-center text-white transition-all duration-500
              ${noPriceFlash === 'up' ? 'price-num-up' : noPriceFlash === 'down' ? 'price-num-down' : ''}`}
            style={{ width: `${noPct}%`, background: 'hsl(var(--destructive))' }}
          >
            {noPct >= 20 ? `No ${noPct}%` : noPct >= 10 ? `${noPct}%` : ''}
          </div>
        </div>
        <div className="flex justify-between mt-1.5 px-0.5">
          <span className="text-[11px] font-semibold text-success">Yes {formatProbability(yesPrice)}</span>
          <span className="text-[11px] font-semibold text-destructive">No {formatProbability(noPrice)}</span>
        </div>
      </div>

      {/* 30-day probability trend sparkline */}
      {!compact && <Sparkline market={market} />}

      {!compact && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {market.traders.toLocaleString('en-IN')}
          </span>
          <span>Vol: {formatINR(market.volume)}</span>
          {/* Visual state chip for big movers (|change| >= 5%) */}
          {Math.abs(market.change24h) >= 5 ? (
            <span className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full text-[10px] ${
              isPositive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(market.change24h)}
            </span>
          ) : (
            <span className={`flex items-center gap-0.5 font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(market.change24h)}
            </span>
          )}
        </div>
      )}

              {/* Polymarket numeric IDs don't resolve to event pages; some markets
                  store a resolutionSourceUrl pointing to the actual Polymarket event
                  page (slug-based). Prefer that; otherwise fall back to a Polymarket
                  search query on the market title so the user always lands somewhere
                  meaningful instead of a 404. */}
              <a
                href={
                  (market as { resolutionSourceUrl?: string }).resolutionSourceUrl?.startsWith('https://polymarket.com')
                    ? (market as { resolutionSourceUrl: string }).resolutionSourceUrl
                    : `https://polymarket.com/markets?_q=${encodeURIComponent(market.title)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors mt-2 inline-flex items-center gap-0.5"
                onClick={(e) => { e.stopPropagation(); trackPolymarketClick(market.id); }}
              >
                View on Polymarket <ExternalLink className="w-2.5 h-2.5" />
              </a>
    </div>
  );
};

export default MarketCard;
