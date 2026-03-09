import { useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import RiskBanner from '@/components/RiskBanner';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import { APP_CONFIG, CATEGORY_LABELS } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { Search, Bell, Zap, Clock, TrendingUp, RefreshCw, MapPin, Flame } from 'lucide-react';
import { useMarkets, useIndiaMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';

const SkeletonCard = () => (
  <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse">
    <div className="h-3 bg-muted rounded w-1/3" />
    <div className="h-4 bg-muted rounded w-full" />
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="flex gap-2 mt-2">
      <div className="flex-1 h-12 bg-muted rounded-md" />
      <div className="flex-1 h-12 bg-muted rounded-md" />
    </div>
  </div>
);

const HomePage = () => {
  useSEO({
    title: "Trending India Prediction Markets – Cricket, IPL, Economy, Crypto",
    description: "India Predictions: India's #1 opinion trading platform. Live prediction markets for IPL, cricket, RBI rates, Nifty, Bollywood box office & Bitcoin. Real-time prices in INR.",
    keywords: "India prediction market, IPL trading, cricket prediction, RBI rate prediction, Nifty prediction, Bollywood box office prediction, opinion trading India",
    canonical: "/",
  });
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { markets: allMarkets, loading: allLoading, refetch: refetchAll } = useMarkets();
  const { markets: indiaMarkets, loading: indiaLoading, refetch: refetchIndia } = useIndiaMarkets();

  const loading = allLoading || indiaLoading;

  const refetch = () => {
    refetchAll();
    refetchIndia();
  };

  // India-specific sections
  const indiaTrending = indiaMarkets.slice(0, 6);
  const indiaClosingSoon = indiaMarkets
    .filter((m) => {
      const ms = new Date(m.closesAt).getTime() - Date.now();
      return ms > 0 && ms < 7 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 3);

  // Global trending (from all markets)
  const globalTrending = [...allMarkets]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);

  // Filtered view for category/search
  const enabledMarkets = allMarkets.filter((m) =>
    APP_CONFIG.enabledCategories.includes(m.category)
  );
  const filtered = enabledMarkets.filter((m) => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pb-24 lg:pb-8">
      {/* ── Paytm-style navy gradient header ── */}
      <div className="paytm-header px-4 lg:px-8 pt-12 lg:pt-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={12} duration={0.6}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white lg:hidden tracking-tight">
                  Opinion<span className="text-secondary">Bazaar</span>
                </h1>
                <h1 className="font-display text-2xl font-extrabold text-white hidden lg:block tracking-tight">
                  Welcome back 👋
                </h1>
                <p className="text-xs lg:text-sm text-white/60 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-secondary" />
                  <span>Live prediction markets · India-first</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-40"
                  title="Refresh markets"
                >
                  <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} distance={12}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:bg-white/15"
              />
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-6 mt-4">
        <AnimateIn delay={0.15} scale>
          <RiskBanner />
        </AnimateIn>

        <AnimateIn delay={0.2} direction="left" distance={24}>
          <CategoryTabs selected={category} onSelect={setCategory} />
        </AnimateIn>

        {/* ── Default home view ─────────────────────────── */}
        {category === 'all' && !search && (
          <>
            {/* 🇮🇳 Trending in India */}
            <section>
              <AnimateIn delay={0.25}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">
                        Trending in India
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Most traded India-related events right now
                      </p>
                    </div>
                  </div>
                  {!indiaLoading && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {indiaMarkets.length} markets
                    </span>
                  )}
                </div>
              </AnimateIn>

              {indiaLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : indiaTrending.length > 0 ? (
                <StaggerChildren
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                  baseDelay={0.3}
                  staggerDelay={0.07}
                >
                  {indiaTrending.map((m) => (
                    <MarketCard key={m.id} market={m} />
                  ))}
                </StaggerChildren>
              ) : (
                /* Fallback: show global trending with a note */
                <div>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-warning" />
                    No India-specific markets found right now — showing global top markets
                  </p>
                  <StaggerChildren
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                    baseDelay={0.3}
                    staggerDelay={0.07}
                  >
                    {globalTrending.map((m) => (
                      <MarketCard key={m.id} market={m} />
                    ))}
                  </StaggerChildren>
                </div>
              )}
            </section>

            {/* ⚡ Closing Soon (India) */}
            {(indiaClosingSoon.length > 0 || indiaLoading) && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-warning" />
                    <h2 className="font-display font-semibold text-sm lg:text-base">Closing Soon</h2>
                    <span className="text-xs text-muted-foreground">India markets ending this week</span>
                  </div>
                </AnimateIn>
                {indiaLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : (
                  <StaggerChildren
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                    staggerDelay={0.08}
                  >
                    {indiaClosingSoon.map((m) => (
                      <MarketCard key={m.id} market={m} compact />
                    ))}
                  </StaggerChildren>
                )}
              </section>
            )}

            {/* 🌐 Global Trending */}
            <section>
              <AnimateIn delay={0.1}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-semibold text-sm lg:text-base">Global Top Markets</h2>
                  <span className="text-xs text-muted-foreground">Highest volume on Polymarket</span>
                </div>
              </AnimateIn>
              {allLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <StaggerChildren
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                  staggerDelay={0.07}
                >
                  {globalTrending.map((m) => (
                    <MarketCard key={m.id} market={m} />
                  ))}
                </StaggerChildren>
              )}
            </section>

            {/* Attribution */}
            {!loading && (
              <AnimateIn>
                <p className="text-center text-xs text-muted-foreground pb-2">
                  Live data from{' '}
                  <a
                    href="https://polymarket.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Polymarket
                  </a>{' '}
                  · Updates every 5 minutes
                </p>
              </AnimateIn>
            )}
          </>
        )}

        {/* ── Category / Search view ───────────────────── */}
        {(category !== 'all' || search) && (
          <section>
            <AnimateIn>
              <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                {category !== 'all'
                  ? `${CATEGORY_LABELS[category]?.emoji} ${CATEGORY_LABELS[category]?.label}`
                  : 'Search Results'}
                <span className="text-xs text-muted-foreground font-normal">({filtered.length})</span>
              </h2>
            </AnimateIn>
            <StaggerChildren
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
              staggerDelay={0.06}
            >
              {filtered.length > 0 ? (
                filtered.map((m) => <MarketCard key={m.id} market={m} />)
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8 col-span-full">
                  No markets found
                </p>
              )}
            </StaggerChildren>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
