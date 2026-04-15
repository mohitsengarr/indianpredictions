/**
 * Mini analytics dashboard preview card.
 * Shows sector scores, a correlation hint, and a time series —
 * encouraging users to click through to the full insights page.
 */
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';

const SECTORS = [
  { name: 'Energy', score: 71, color: '#22c55e' },
  { name: 'Pharma', score: 64, color: '#22c55e' },
  { name: 'IT', score: 62, color: '#eab308' },
  { name: 'Banking', score: 55, color: '#eab308' },
  { name: 'Metals', score: 34, color: '#ef4444' },
];

const AnalyticsPreview = ({ className = '' }: { className?: string }) => (
  <section className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
      {/* Left: Text + CTA */}
      <div className="lg:col-span-2 p-5 lg:p-6 flex flex-col justify-center">
        <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mb-3">
          <BarChart3 className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="font-display font-bold text-base lg:text-lg">Analytics & Insights</h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Sector scores, correlations & historical probability trends across all India-focused markets.
        </p>
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors w-fit"
        >
          Open Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Right: Mini dashboard preview */}
      <div className="lg:col-span-3 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border p-4 space-y-3">
        {/* Sector scores */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sector Scores</p>
          <div className="space-y-1.5">
            {SECTORS.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-[10px] text-foreground font-medium w-14 shrink-0">{s.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.score}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-[10px] font-bold w-6 text-right" style={{ color: s.color }}>{s.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Correlation hint */}
        <div className="flex gap-2">
          <div className="flex-1 bg-background border border-border/60 rounded-md p-2">
            <p className="text-[8px] text-muted-foreground mb-1">Top correlation</p>
            <p className="text-[10px] font-semibold text-foreground">West Asia &rarr; Oil Price</p>
            <p className="text-[9px] text-success font-bold">r = 0.92</p>
          </div>
          <div className="flex-1 bg-background border border-border/60 rounded-md p-2">
            <p className="text-[8px] text-muted-foreground mb-1">Market sentiment</p>
            <p className="text-[10px] font-semibold text-foreground">Cautious</p>
            <p className="text-[9px] text-warning font-bold">Score: 38/100</p>
          </div>
        </div>

        {/* Mini volatility chart */}
        <div className="bg-background border border-border/60 rounded-md p-2">
          <p className="text-[8px] text-muted-foreground mb-1">India VIX — 30-day trend</p>
          <svg viewBox="0 0 200 40" className="w-full h-8" preserveAspectRatio="none">
            <defs>
              <linearGradient id="analytics-vix-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 30 L20 28 L40 32 L60 25 L80 18 L100 10 L120 6 L130 8 L150 14 L170 12 L190 14 L200 14"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
            />
            <path
              d="M0 30 L20 28 L40 32 L60 25 L80 18 L100 10 L120 6 L130 8 L150 14 L170 12 L190 14 L200 14 L200 40 L0 40Z"
              fill="url(#analytics-vix-grad)"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
);

export default AnalyticsPreview;
