import { useEffect, useRef, useState } from 'react';
import { Market } from '@/lib/types';
import { formatINR, formatPercent, formatProbability, timeUntil } from '@/lib/formatters';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLivePrice } from '@/contexts/LivePricesContext';

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
  const noPct  = Math.round(noPrice * 100);

  return (
    <button
      onClick={() => navigate(`/market/${market.id}`)}
      className={`group w-full text-left bg-white rounded-xl border border-border shadow-card p-4 transition-all duration-200 ease-out
        hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-0.5 active:scale-[0.98]
        overflow-hidden relative
        ${cardFlash === 'up' ? 'price-flash-up' : cardFlash === 'down' ? 'price-flash-down' : ''}`}
    >
      {/* Live pulse dot */}
      {livePrice && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success opacity-80" />
        </span>
      )}

      {/* Category chip + time */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${catColor}`}>
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1 pr-4">
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

      {!compact && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {market.traders.toLocaleString('en-IN')}
          </span>
          <span>Vol: {formatINR(market.volume)}</span>
          <span className={`flex items-center gap-0.5 font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(market.change24h)}
          </span>
        </div>
      )}
    </button>
  );
};

export default MarketCard;
