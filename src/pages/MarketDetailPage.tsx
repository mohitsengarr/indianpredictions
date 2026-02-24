import { useParams, useNavigate } from 'react-router-dom';
import { MARKETS, CATEGORY_LABELS } from '@/lib/mock-data';
import { formatINR, formatPercent, formatProbability, timeUntil } from '@/lib/formatters';
import TradeTicket from '@/components/TradeTicket';
import MiniChart from '@/components/MiniChart';
import AnimateIn from '@/components/AnimateIn';
import { ArrowLeft, ExternalLink, Clock, Users, BarChart3, Info, TrendingUp, TrendingDown } from 'lucide-react';

const MarketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const market = MARKETS.find((m) => m.id === id);

  if (!market) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Market not found</p>
      </div>
    );
  }

  const cat = CATEGORY_LABELS[market.category];
  const isPositive = market.change24h >= 0;

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-secondary px-4 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={8} duration={0.4}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-foreground/70 mb-3 transition-colors duration-200 hover:text-secondary-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
          </AnimateIn>
          <AnimateIn delay={0.05} distance={12}>
            <span className="text-xs font-medium text-secondary-foreground/60">
              {cat?.emoji} {cat?.label}
            </span>
            <h1 className="font-display font-bold text-lg lg:text-xl text-secondary-foreground mt-1 leading-snug max-w-2xl">
              {market.title}
            </h1>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-4">
        {/* Desktop: two-column layout */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Left column – market info */}
          <div className="lg:col-span-3 space-y-4">
            {/* Price summary */}
            <AnimateIn delay={0.1} scale>
              <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                <div className="flex items-center gap-4 lg:gap-8 mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Yes Price</div>
                    <div className="font-display text-2xl lg:text-3xl font-bold text-success">
                      {formatProbability(market.yesPrice)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">No Price</div>
                    <div className="font-display text-2xl lg:text-3xl font-bold text-destructive">
                      {formatProbability(market.noPrice)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">24h</div>
                    <div className={`font-display font-bold text-lg flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatPercent(market.change24h)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Vol: {formatINR(market.volume)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {market.traders.toLocaleString('en-IN')} traders</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeUntil(market.closesAt)}</span>
                </div>
              </div>
            </AnimateIn>

            {/* Chart */}
            <AnimateIn delay={0.15}>
              <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Yes Price – 30 Days</h3>
                <MiniChart market={market} />
              </div>
            </AnimateIn>

            {/* Resolution criteria */}
            <AnimateIn delay={0.25}>
              <div className="bg-card rounded-lg border border-border p-4 lg:p-6 space-y-3">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Resolution Details
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{market.resolutionCriteria}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Source:</span>
                  <a href={market.resolutionSourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline transition-colors duration-200">
                    {market.resolutionSource}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span>Closes: {new Date(market.closesAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  <span className="mx-2">•</span>
                  <span>Resolves: {new Date(market.resolvesAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
              </div>
            </AnimateIn>

            {market.contextNote && (
              <AnimateIn delay={0.3} blur>
                <div className="bg-primary/5 rounded-lg border border-primary/10 p-4 lg:p-6">
                  <h3 className="text-xs font-semibold font-display text-primary mb-1">Why this matters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{market.contextNote}</p>
                </div>
              </AnimateIn>
            )}
          </div>

          {/* Right column – trade ticket (sticky on desktop) */}
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <TradeTicket market={market} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailPage;
