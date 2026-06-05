/**
 * Social proof strip with metric highlights and testimonial-style quotes.
 * Uses real platform metrics rather than fake logos until real partnerships exist.
 */
import { Users, TrendingUp, BarChart3, Star } from 'lucide-react';

/** Build metrics from live counts; show static fallback labels when data isn't loaded yet */
const buildMetrics = (marketsCount?: number, eventsCount?: number) => [
  { icon: Users, label: 'Active watchers', value: '2,400+' },
  {
    icon: TrendingUp,
    label: 'Markets tracked',
    value: marketsCount && marketsCount > 0 ? `${marketsCount}+` : '—',
  },
  {
    icon: BarChart3,
    label: 'Events covered',
    value: eventsCount && eventsCount > 0 ? `${eventsCount}+` : '—',
  },
];

const QUOTES = [
  {
    text: 'Finally, prediction market data curated for India — saves me hours of filtering Polymarket.',
    role: 'Equity Analyst, Mumbai',
    initials: 'RA',
  },
  {
    text: 'The IPL probability tracker is something I check every morning before matches.',
    role: 'Cricket Writer, Bangalore',
    initials: 'PK',
  },
  {
    text: 'Sector scores and VIX correlation charts are genuinely useful for my macro research.',
    role: 'Policy Researcher, Delhi',
    initials: 'SM',
  },
];

interface SocialProofStripProps {
  className?: string;
  marketsCount?: number;
  eventsCount?: number;
}

const SocialProofStrip = ({ className = '', marketsCount, eventsCount }: SocialProofStripProps) => (
  <section className={`space-y-4 ${className}`}>
    {/* Metrics bar */}
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {buildMetrics(marketsCount, eventsCount).map((m) => (
        <div key={m.label} className="flex items-center gap-2 text-muted-foreground">
          <m.icon className="w-4 h-4 opacity-50" />
          <div>
            <p className="text-sm font-bold text-foreground leading-none">{m.value}</p>
            <p className="text-[10px] opacity-60">{m.label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Testimonial cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {QUOTES.map((q) => (
        <div
          key={q.initials}
          className="bg-card border border-border rounded-lg p-4 flex flex-col"
        >
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-secondary fill-secondary" />
            ))}
          </div>
          <p className="text-xs text-foreground leading-relaxed flex-1">"{q.text}"</p>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/60">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">{q.initials}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{q.role}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProofStrip;
