import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sparkline } from '@/components/MarketCard';
import { formatINR, formatProbability, timeUntil } from '@/lib/formatters';
import type { Market } from '@/lib/types';

const SITE = 'https://www.indiapredictions.com';

/**
 * Standalone, chrome-less odds card meant to be iframed on third-party sites
 * (the embeddable-widget backlink play). Rendered outside the app shell by the
 * Chrome switch in App.tsx, so there's no sidebar/footer here.
 *
 * Fetches a single market row directly (not the whole cache) to stay light on
 * publishers' pages. Set noindex so these don't compete with real pages.
 */
const EmbedPage = () => {
  const { id } = useParams<{ id: string }>();
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) { setLoading(false); return; }
      const { data } = await supabase
        .from('polymarket_cache')
        .select('data')
        .eq('id', id)
        .maybeSingle();
      if (!cancelled) {
        if (data?.data) setMarket(data.data as unknown as Market);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Embeds must not be indexed (avoid duplicate-content bloat vs. the real pages).
  useEffect(() => {
    document.title = market ? `${market.title} — live odds` : 'India Predictions';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
  }, [market]);

  const marketUrl = `${SITE}/market/${id}`;
  const yesPct = market ? Math.round(market.yesPrice * 100) : 0;

  return (
    <div className="p-2 bg-transparent">
      <div className="w-full max-w-[380px] mx-auto bg-card border border-border rounded-xl p-4 shadow-sm">
        {/* Header: brand (links to site) + live dot */}
        <div className="flex items-center justify-between mb-2.5">
          <a href={SITE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
            <img src="/favicon.svg" alt="India Predictions" className="w-5 h-5 rounded" width={20} height={20} />
            <span className="text-xs font-extrabold tracking-tight text-foreground">India<span className="text-primary">Predictions</span></span>
          </a>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> LIVE
          </span>
        </div>

        {loading && !market ? (
          <div className="space-y-2 animate-pulse" aria-hidden>
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-2 bg-muted rounded w-full mt-3" />
          </div>
        ) : market ? (
          <a href={marketUrl} target="_blank" rel="noopener noreferrer" className="block group">
            <p className="text-sm font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">{market.title}</p>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-success font-extrabold text-lg leading-none">
                {formatProbability(market.yesPrice)} <span className="text-[11px] font-semibold text-muted-foreground">YES</span>
              </span>
              <span className="text-destructive font-bold text-sm">{formatProbability(market.noPrice)} NO</span>
            </div>
            <div className="flex rounded overflow-hidden h-2 mt-1.5">
              <div style={{ width: `${yesPct}%`, background: 'hsl(var(--success))' }} />
              <div style={{ width: `${100 - yesPct}%`, background: 'hsl(var(--destructive))' }} />
            </div>
            <Sparkline market={market} />
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
              <span>{formatINR(market.volume)} vol · {timeUntil(market.closesAt)}</span>
              <span className="text-primary font-semibold group-hover:underline">View full market →</span>
            </div>
          </a>
        ) : (
          <a href={SITE} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold text-primary py-2">
            See live India prediction markets →
          </a>
        )}
      </div>
    </div>
  );
};

export default EmbedPage;
