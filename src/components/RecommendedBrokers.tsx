import { ExternalLink } from 'lucide-react';
import { AFFILIATES_ENABLED, BROKER_PARTNERS } from '@/data/affiliate-partners';

/**
 * Disclosed affiliate module for legal Indian investing apps. Renders nothing
 * until AFFILIATES_ENABLED is true AND at least one partner has a referral URL,
 * so it's inert until you wire in your links. On-brand for the "Indian investors
 * & policy watchers" audience without touching the no-real-money positioning.
 */
export default function RecommendedBrokers() {
  const partners = BROKER_PARTNERS.filter((p) => p.url);
  if (!AFFILIATES_ENABLED || partners.length === 0) return null;

  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-display font-bold text-base lg:text-lg">Start investing in India's markets</h2>
      <p className="text-[11px] text-muted-foreground mt-1">
        Affiliate disclosure: we may earn a commission if you open an account via these links, at no extra cost to you. Not investment advice.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {partners.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5 hover:border-primary/40 transition-colors group"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{p.blurb}</p>
            </div>
            <span className="text-xs font-semibold text-primary whitespace-nowrap inline-flex items-center gap-1 shrink-0 group-hover:underline">
              {p.cta ?? 'Open'} <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
