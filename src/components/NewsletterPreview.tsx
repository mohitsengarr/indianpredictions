/**
 * Mock email preview card shown next to the newsletter signup form.
 * Gives users a visual preview of what the weekly briefing looks like.
 */
import { TrendingUp, BarChart3, Zap } from 'lucide-react';

const NewsletterPreview = ({ className = '' }: { className?: string }) => (
  <div className={`bg-background border border-border rounded-lg p-3 shadow-sm max-w-xs ${className}`}>
    {/* Email header */}
    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-[10px] font-bold text-primary">IP</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold text-foreground truncate">India Predictions Weekly</p>
        <p className="text-[7px] text-muted-foreground">Mon, 7 Apr 2026 &middot; 3 min read</p>
      </div>
    </div>

    {/* Email body preview */}
    <div className="mt-2 space-y-2">
      <p className="text-[8px] font-bold text-foreground">This week's top moves:</p>

      {/* Mini probability shifts */}
      <div className="space-y-1">
        {[
          { event: 'RBI Rate Cut (June)', change: '+12%', dir: 'up' },
          { event: 'Oil crosses $120/bbl Q2', change: '+22%', dir: 'up' },
          { event: 'Nifty Recovery >24K', change: '-27%', dir: 'down' },
        ].map((item) => (
          <div key={item.event} className="flex items-center justify-between bg-muted/50 rounded px-1.5 py-1">
            <span className="text-[7px] text-foreground font-medium truncate flex-1">{item.event}</span>
            <span className={`text-[7px] font-bold flex items-center gap-0.5 ${
              item.dir === 'up' ? 'text-success' : 'text-destructive'
            }`}>
              <TrendingUp className={`w-2 h-2 ${item.dir === 'down' ? 'rotate-180' : ''}`} />
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Mini chart placeholder */}
      <div className="bg-muted/30 rounded p-1.5">
        <div className="flex items-center gap-1 mb-1">
          <BarChart3 className="w-2 h-2 text-muted-foreground" />
          <span className="text-[6px] text-muted-foreground font-medium">Weekly chart: India VIX trend</span>
        </div>
        <svg viewBox="0 0 100 20" className="w-full h-3" preserveAspectRatio="none">
          <path
            d="M0 15 L15 12 L30 14 L45 8 L60 10 L75 6 L90 8 L100 5"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Insight teaser */}
      <div className="flex items-start gap-1 bg-secondary/5 rounded px-1.5 py-1 border-l-2 border-secondary/30">
        <Zap className="w-2 h-2 text-secondary mt-0.5 shrink-0" />
        <p className="text-[7px] text-muted-foreground leading-tight">
          <span className="font-semibold text-foreground">Insight:</span> Markets price RBI cut at 71% but economists consensus is only 45%...
        </p>
      </div>
    </div>
  </div>
);

export default NewsletterPreview;
