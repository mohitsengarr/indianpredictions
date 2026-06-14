import { useNavigate } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import type { MarketGroup } from '@/lib/market-groups';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { formatINR, timeUntil } from '@/lib/formatters';
import { trackMarketClick } from '@/lib/analytics';

/**
 * Multi-outcome ("who will win") card — lists each outcome with its probability
 * bar, Polymarket-style. Clicking an outcome opens that underlying market.
 */
const MultiOutcomeCard = ({ group }: { group: MarketGroup }) => {
  const navigate = useNavigate();
  const cat = CATEGORY_LABELS[group.category];
  const totalTraders = group.outcomes.reduce((s, o) => s + o.market.traders, 0);

  const open = (id: string) => {
    trackMarketClick(id, group.category);
    navigate(`/market/${id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeUntil(group.closesAt)}
        </span>
      </div>

      <h3 className="font-display font-bold text-sm leading-snug mb-3 text-foreground">
        {group.question}
        <span className="text-[10px] font-semibold text-muted-foreground ml-1.5">
          · {group.outcomes.length} outcomes
        </span>
      </h3>

      {/* Outcomes */}
      <div className="space-y-1.5">
        {group.outcomes.map((o, i) => {
          const pct = Math.round(o.yesPrice * 100);
          const leader = i === 0;
          return (
            <button
              key={o.market.id}
              type="button"
              onClick={() => open(o.market.id)}
              className="w-full text-left group/outcome"
            >
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className={`font-medium truncate pr-2 ${leader ? 'text-foreground' : 'text-muted-foreground'} group-hover/outcome:text-primary transition-colors`}>
                  {o.label}
                </span>
                <span className={`font-bold tabular-nums ${leader ? 'text-success' : 'text-foreground'}`}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(pct, 2)}%`, background: leader ? 'hsl(var(--success))' : 'hsl(var(--primary) / 0.5)' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2.5 mt-2.5 border-t border-border/60">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {totalTraders.toLocaleString('en-IN')}
        </span>
        <span>Vol: {formatINR(group.volume)}</span>
      </div>
    </div>
  );
};

export default MultiOutcomeCard;
