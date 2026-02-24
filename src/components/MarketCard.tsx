import { Market } from '@/lib/types';
import { formatINR, formatPercent, formatProbability, timeUntil } from '@/lib/formatters';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
  compact?: boolean;
}

const MarketCard = ({ market, compact = false }: MarketCardProps) => {
  const navigate = useNavigate();
  const cat = CATEGORY_LABELS[market.category];
  const isPositive = market.change24h >= 0;

  return (
    <button
      onClick={() => navigate(`/market/${market.id}`)}
      className="group w-full text-left bg-card rounded-lg border border-border p-4 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.98] active:shadow-none"
    >
      {/* Category + time */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeUntil(market.closesAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-sm leading-snug mb-3 text-foreground transition-colors duration-200 group-hover:text-primary">
        {market.title}
      </h3>

      {/* Price bars */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-success/10 rounded-md px-3 py-2 text-center transition-all duration-300 group-hover:bg-success/15">
          <div className="text-xs text-muted-foreground mb-0.5">Yes</div>
          <div className="font-display font-bold text-success text-lg">
            {formatProbability(market.yesPrice)}
          </div>
        </div>
        <div className="flex-1 bg-destructive/10 rounded-md px-3 py-2 text-center transition-all duration-300 group-hover:bg-destructive/15">
          <div className="text-xs text-muted-foreground mb-0.5">No</div>
          <div className="font-display font-bold text-destructive text-lg">
            {formatProbability(market.noPrice)}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {market.traders.toLocaleString('en-IN')} traders
          </span>
          <span>Vol: {formatINR(market.volume)}</span>
          <span className={`flex items-center gap-0.5 ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(market.change24h)}
          </span>
        </div>
      )}
    </button>
  );
};

export default MarketCard;
