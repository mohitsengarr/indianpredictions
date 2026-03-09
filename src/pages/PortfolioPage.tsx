import { POSITIONS, USER } from '@/lib/mock-data';
import { formatINR, formatPercent } from '@/lib/formatters';
import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'open' | 'settled'>('open');

  const openPositions = POSITIONS.filter((p) => p.status === 'open');
  const settledPositions = POSITIONS.filter((p) => p.status === 'settled');
  const positions = tab === 'open' ? openPositions : settledPositions;

  const openPnl = openPositions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="pb-24 lg:pb-8">
      <div className="bg-secondary px-4 lg:px-8 pt-12 lg:pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={10}>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-secondary-foreground mb-4">Portfolio</h1>
          </AnimateIn>

          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Balance', value: formatINR(USER.balance), color: '' },
              { label: 'Open P&L', value: `${openPnl >= 0 ? '+' : ''}${formatINR(openPnl)}`, color: openPnl >= 0 ? 'text-success' : 'text-destructive' },
              { label: 'Win Rate', value: `${USER.winRate}%`, color: '' },
              { label: 'Total Trades', value: `${USER.tradesCount}`, color: '', extraClass: 'hidden lg:block' },
            ].map((stat, i) => (
              <AnimateIn key={stat.label} delay={0.1 + i * 0.07} scale className={stat.extraClass || ''}>
                <div className="bg-secondary-foreground/10 rounded-lg p-3 lg:p-4">
                  <div className="text-[10px] lg:text-xs text-secondary-foreground/60 uppercase tracking-wide">{stat.label}</div>
                  <div className={`font-display font-bold text-secondary-foreground lg:text-lg ${stat.color}`}>{stat.value}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-4 space-y-4">
        <AnimateIn delay={0.2} direction="left" distance={16}>
          <div className="flex gap-2">
            {(['open', 'settled'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-250 ease-out active:scale-95 ${
                  tab === t ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t === 'open' ? `Open (${openPositions.length})` : `Settled (${settledPositions.length})`}
              </button>
            ))}
          </div>
        </AnimateIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-3" staggerDelay={0.07} baseDelay={0.25}>
          {positions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8 col-span-full">No {tab} positions</p>
          ) : (
            positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => navigate(`/market/${pos.marketId}`)}
                className="group w-full text-left bg-card rounded-lg border border-border p-4 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-sm leading-snug pr-4 text-foreground transition-colors duration-200 group-hover:text-primary">
                    {pos.marketTitle}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    pos.side === 'yes' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {pos.side.toUpperCase()} × {pos.shares}
                  </span>
                  <span className="text-muted-foreground">Avg: ₹{pos.avgPrice.toFixed(2)}</span>
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
        </StaggerChildren>
      </div>
    </div>
  );
};

export default PortfolioPage;
