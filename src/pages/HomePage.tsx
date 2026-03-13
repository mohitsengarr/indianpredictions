import { useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import RiskBanner from '@/components/RiskBanner';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import { APP_CONFIG, CATEGORY_LABELS } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { Search, Bell, Zap, Clock, TrendingUp, RefreshCw, Flame, ChevronRight, Star } from 'lucide-react';
import { useMarkets, useIndiaMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';
import { formatINR } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';

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

const INDIA_CATEGORY_PILLS = [
  { key: 'cricket', emoji: '🏏', label: 'Cricket & IPL' },
  { key: 'politics', emoji: '🗳️', label: 'Politics' },
  { key: 'economy', emoji: '📈', label: 'Economy' },
  { key: 'entertainment', emoji: '🎬', label: 'Bollywood' },
  { key: 'crypto', emoji: '₿', label: 'Crypto' },
];

const HomePage = () => {
  useSEO({
    title: "India Predictions – Live Prediction Markets for Cricket, Politics & Economy",
    description: "India's #1 opinion trading platform. Live prediction markets for IPL, cricket, RBI rates, Nifty, Bollywood box office & Bitcoin. Real-time prices in INR.",
    keywords: "India prediction market, IPL trading, cricket prediction, RBI rate prediction, Nifty prediction, Bollywood box office prediction, opinion trading India",
    canonical: "/",
  });

  const navigate = useNavigate();
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { markets: allMarkets, loading: allLoading, refetch: refetchAll, lastUpdated } = useMarkets();
  const { markets: indiaMarkets, loading: indiaLoading, refetch: refetchIndia } = useIndiaMarkets();

  const loading = allLoading || indiaLoading;

  const refetch = () => {
    refetchAll();
    refetchIndia();
  };

  // India sections
  const indiaHot = [...indiaMarkets].sort((a, b) => b.volume - a.volume).slice(0, 3);
  const indiaTrending = indiaMarkets.slice(0, 6);
  const indiaClosingSoon = indiaMarkets
    .filter((m) => {
      const ms = new Date(m.closesAt).getTime() - Date.now();
      return ms > 0 && ms < 7 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 3);

  // By category for India
  const indiaCricket = indiaMarkets.filter(m => m.category === 'cricket').slice(0, 3);
  const indiaPolitics = indiaMarkets.filter(m => m.category === 'politics').slice(0, 3);
  const indiaEconomy = indiaMarkets.filter(m => m.category === 'economy').slice(0, 3);

  // Global trending
  const globalTrending = [...allMarkets]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);

  // Filtered view
  const enabledMarkets = allMarkets.filter((m) =>
    APP_CONFIG.enabledCategories.includes(m.category)
  );
  const filtered = enabledMarkets.filter((m) => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // India total volume
  const indiaTotalVol = indiaMarkets.reduce((s, m) => s + m.volume, 0);

  return (
    <div className="pb-24 lg:pb-8">

      {/* ── India-first Hero Header ── */}
      <div className="relative overflow-hidden">
        {/* Tricolour stripe accent at very top */}
        <div className="h-1 w-full flex">
          <div className="flex-1" style={{ background: '#FF9933' }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: '#138808' }} />
        </div>

        <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-8 pb-8 relative">
          {/* Decorative Ashoka chakra watermark */}
          <div className="absolute right-4 top-4 text-white/5 text-[120px] leading-none select-none pointer-events-none font-bold">
            ☸
          </div>

          <div className="max-w-5xl mx-auto">
            <AnimateIn direction="down" distance={12} duration={0.6}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🇮🇳</span>
                    <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                      India<span className="text-secondary">Predictions</span>
                    </h1>
                  </div>
                  <p className="text-xs lg:text-sm text-white/65 mt-0.5">
                    Predict outcomes on cricket, politics, economy & more
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-40"
                    title="Refresh markets"
                  >
                    <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
                    <Bell className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </AnimateIn>

            {/* Search bar */}
            <AnimateIn delay={0.1} distance={12}>
              <div className="relative max-w-md mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search India markets..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
                />
              </div>
            </AnimateIn>

            {/* India Stats Bar */}
            <AnimateIn delay={0.15}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">
                    {indiaMarkets.length} Live India Markets
                  </span>
                </div>
                {indiaTotalVol > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                    <TrendingUp className="w-3 h-3 text-secondary" />
                    <span className="text-xs font-semibold text-white">
                      {formatINR(indiaTotalVol)} Total Volume
                    </span>
                  </div>
                )}
                {lastUpdated && (
                  <span className="text-[11px] text-white/45">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-7 mt-5">
        <AnimateIn delay={0.05} scale>
          <RiskBanner />
        </AnimateIn>

        {/* ── India Category Quick-Pills ── */}
        {!search && (
          <AnimateIn delay={0.1}>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setCategory('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                  category === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                }`}
              >
                🇮🇳 All India
              </button>
              {INDIA_CATEGORY_PILLS.map(pill => (
                <button
                  key={pill.key}
                  onClick={() => setCategory(pill.key as MarketCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                    category === pill.key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {pill.emoji} {pill.label}
                </button>
              ))}
            </div>
          </AnimateIn>
        )}

        {/* ── Category / Search filtered view ── */}
        {(category !== 'all' || search) && (
          <section>
            <AnimateIn>
              <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                {category !== 'all'
                  ? `${CATEGORY_LABELS[category as MarketCategory]?.emoji} ${CATEGORY_LABELS[category as MarketCategory]?.label}`
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

        {/* ── Default home view (all + no search) ── */}
        {category === 'all' && !search && (
          <>
        {/* 🔥 India Spotlight — Featured Hot 3 */}
            <section>
              <AnimateIn delay={0.2}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">
                        🔥 Hot in India
                      </h2>
                      <p className="text-[11px] text-muted-foreground">Highest volume India markets right now</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/markets')}
                    className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
                  >
                    See all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </AnimateIn>

              {indiaLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : indiaHot.length > 0 ? (
                <StaggerChildren
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  baseDelay={0.25}
                  staggerDelay={0.07}
                >
                  {indiaHot.map((m, i) => (
                    <div key={m.id} className="relative">
                      {i === 0 && (
                        <div className="absolute -top-2 -left-1 z-10 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          <Star className="w-2.5 h-2.5" /> #1
                        </div>
                      )}
                      <MarketCard market={m} />
                    </div>
                  ))}
                </StaggerChildren>
              ) : (
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3" baseDelay={0.25} staggerDelay={0.07}>
                  {globalTrending.map(m => <MarketCard key={m.id} market={m} />)}
                </StaggerChildren>
              )}
            </section>

            {/* 🏏 Cricket & IPL */}
            {(indiaCricket.length > 0 || indiaLoading) && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏏</span>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Cricket & IPL</h2>
                        <p className="text-[11px] text-muted-foreground">Predict match outcomes & series results</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCategory('cricket')}
                      className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
                    >
                      More <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </AnimateIn>
                {indiaLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : indiaCricket.length > 0 ? (
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3" staggerDelay={0.07}>
                    {indiaCricket.map(m => <MarketCard key={m.id} market={m} />)}
                  </StaggerChildren>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 text-center">
                    No active cricket markets · Check back during match season
                  </div>
                )}
              </section>
            )}

            {/* 🗳️ Politics */}
            {(indiaPolitics.length > 0 || indiaLoading) && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🗳️</span>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Indian Politics</h2>
                        <p className="text-[11px] text-muted-foreground">Elections, policy & government decisions</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCategory('politics')}
                      className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
                    >
                      More <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </AnimateIn>
                {indiaLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : indiaPolitics.length > 0 ? (
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3" staggerDelay={0.07}>
                    {indiaPolitics.map(m => <MarketCard key={m.id} market={m} />)}
                  </StaggerChildren>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700 text-center">
                    No active politics markets right now
                  </div>
                )}
              </section>
            )}

            {/* 📈 Economy & Markets */}
            {(indiaEconomy.length > 0 || indiaLoading) && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📈</span>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Economy & Finance</h2>
                        <p className="text-[11px] text-muted-foreground">RBI, Nifty, inflation & macro India</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCategory('economy')}
                      className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
                    >
                      More <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </AnimateIn>
                {indiaLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : indiaEconomy.length > 0 ? (
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-3" staggerDelay={0.07}>
                    {indiaEconomy.map(m => <MarketCard key={m.id} market={m} />)}
                  </StaggerChildren>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-700 text-center">
                    No active economy markets right now
                  </div>
                )}
              </section>
            )}

            {/* ⚡ Closing Soon */}
            {indiaClosingSoon.length > 0 && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-warning" />
                    <h2 className="font-display font-semibold text-sm lg:text-base">Closing Soon</h2>
                    <span className="text-xs text-muted-foreground">India markets ending this week</span>
                  </div>
                </AnimateIn>
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" staggerDelay={0.08}>
                  {indiaClosingSoon.map(m => <MarketCard key={m.id} market={m} compact />)}
                </StaggerChildren>
              </section>
            )}

            {/* 🌐 All India Markets (Full Grid) */}
            <section>
              <AnimateIn delay={0.1}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">All India Markets</h2>
                      <p className="text-[11px] text-muted-foreground">All live India-related prediction markets</p>
                    </div>
                  </div>
                  {!indiaLoading && (
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
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
                  baseDelay={0.1}
                  staggerDelay={0.06}
                >
                  {indiaTrending.map(m => <MarketCard key={m.id} market={m} />)}
                </StaggerChildren>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-warning" />
                    No India-specific markets found right now — showing global top markets
                  </p>
                  <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" staggerDelay={0.07}>
                    {globalTrending.map(m => <MarketCard key={m.id} market={m} />)}
                  </StaggerChildren>
                </div>
              )}
            </section>

            {/* Attribution */}
            {!loading && (
              <AnimateIn>
                <p className="text-center text-xs text-muted-foreground pb-2">
                  Live data from{' '}
                  <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Polymarket
                  </a>
                  {' '}· Auto-refreshes every 5 min
                  {lastUpdated && (
                    <span className="ml-1 opacity-60">
                      · Last updated {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </AnimateIn>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
