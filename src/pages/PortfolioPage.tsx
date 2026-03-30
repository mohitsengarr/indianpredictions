import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { POSITIONS, USER } from '@/lib/mock-data';
import { formatINR, formatPercent } from '@/lib/formatters';
import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'open' | 'settled'>('open');
  const [showDemo, setShowDemo] = useState(false);

  useSEO({
    title: "My Portfolio – Open Positions & P&L",
    description: "Track your prediction market positions, P&L, and settled markets on India Predictions.",
    canonical: "/portfolio",
  });

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
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">Track Your Predictions</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Sign in to track your prediction accuracy, build your portfolio, and compete on the leaderboard. Coming soon.
        </p>
        <Link
          to="/markets"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Browse Markets
        </Link>

        {/* Demo toggle */}
        <div className="mt-12 border-t border-border pt-8">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDemo ? 'Hide' : 'Show'} sample portfolio (demo data)
          </button>

          {showDemo && (
            <div className="mt-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Sample Data — Not Real
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Balance', value: formatINR(USER.balance) },
                  { label: 'Win Rate', value: `${USER.winRate}%` },
                  { label: 'Trades', value: `${USER.tradesCount}` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-lg border border-border p-3">
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    <div className="font-display font-bold text-sm">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-center">
                {(['open', 'settled'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {t === 'open' ? `Open (${openPositions.length})` : `Settled (${settledPositions.length})`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="bg-card rounded-lg border border-border p-4 opacity-70"
                  >
                    <h3 className="font-display font-semibold text-sm leading-snug pr-4 mb-2">
                      {pos.marketTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        pos.side === 'yes' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {pos.side.toUpperCase()} × {pos.shares}
                      </span>
                      <span className={`ml-auto font-medium flex items-center gap-1 ${
                        pos.pnl >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {pos.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatINR(pos.pnl)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
