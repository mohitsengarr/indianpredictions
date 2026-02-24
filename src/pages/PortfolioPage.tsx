import { POSITIONS, USER } from '@/lib/mock-data';
import { formatINR, formatPercent } from '@/lib/formatters';
import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'open' | 'settled'>('open');

  const openPositions = POSITIONS.filter((p) => p.status === 'open');
  const settledPositions = POSITIONS.filter((p) => p.status === 'settled');
  const positions = tab === 'open' ? openPositions : settledPositions;

  const openPnl = openPositions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="pb-24">
      <div className="bg-secondary px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-secondary-foreground mb-4">Portfolio</h1>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary-foreground/10 rounded-lg p-3">
              <div className="text-[10px] text-secondary-foreground/60 uppercase tracking-wide">Balance</div>
              <div className="font-display font-bold text-secondary-foreground">{formatINR(USER.balance)}</div>
            </div>
            <div className="bg-secondary-foreground/10 rounded-lg p-3">
              <div className="text-[10px] text-secondary-foreground/60 uppercase tracking-wide">Open P&L</div>
              <div className={`font-display font-bold ${openPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {openPnl >= 0 ? '+' : ''}{formatINR(openPnl)}
              </div>
            </div>
            <div className="bg-secondary-foreground/10 rounded-lg p-3">
              <div className="text-[10px] text-secondary-foreground/60 uppercase tracking-wide">Win Rate</div>
              <div className="font-display font-bold text-secondary-foreground">{USER.winRate}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {(['open', 'settled'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {t === 'open' ? `Open (${openPositions.length})` : `Settled (${settledPositions.length})`}
            </button>
          ))}
        </div>

        {/* Positions */}
        <div className="space-y-3">
          {positions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No {tab} positions</p>
          ) : (
            positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => navigate(`/market/${pos.marketId}`)}
                className="w-full text-left bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-sm leading-snug pr-4 text-foreground">
                    {pos.marketTitle}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    pos.side === 'yes' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {pos.side.toUpperCase()} × {pos.shares}
                  </span>
                  <span className="text-muted-foreground">
                    Avg: ₹{pos.avgPrice.toFixed(2)}
                  </span>
                  <span className={`ml-auto font-medium flex items-center gap-1 ${
                    pos.pnl >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {pos.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {formatINR(pos.pnl)} ({formatPercent(pos.pnlPercent)})
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
