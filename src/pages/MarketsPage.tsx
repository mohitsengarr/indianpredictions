import { useState, useMemo } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import RecommendedBrokers from '@/components/RecommendedBrokers';
import AdSlot from '@/components/AdSlot';
import { APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory, Market } from '@/lib/types';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, Globe, MapPin } from 'lucide-react';
import { useMarkets, useIndiaMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';
import { sortByTrending } from '@/lib/recommendations';

const MarketsPage = () => {
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'volume' | 'change' | 'closing' | 'trending'>('trending');
  const [indiaOnly, setIndiaOnly] = useState(true);
  const { markets: allMarkets, loading: allLoading, error, refetch } = useMarkets();
  const { markets: indiaMarkets, loading: indiaLoading } = useIndiaMarkets();
  const markets = indiaOnly ? indiaMarkets : allMarkets;
  const loading = indiaOnly ? indiaLoading : allLoading;

  useSEO({
    title: "All India Prediction Markets – Cricket, Elections, Economy, Crypto",
    description: "Browse every live India prediction market in one place — cricket & IPL, elections, RBI & Nifty, crypto, Bollywood. Sort by trending, volume or closing soon. Free, no signup.",
    keywords: "all India prediction markets, prediction market india, live event odds, cricket market, election prediction, economy prediction, crypto prediction India",
    canonical: "/markets",
  });

  // Memo the filtered list separately from the sorted list so sorting only
  // re-runs when the underlying markets, filters, or sort key actually change
  // (previously `filtered` was a new array every render, so every keystroke
  // invalidated the sort memo and re-sorted on each render).
  // A query is active if the user has typed a search or picked a category.
  const hasQuery = search.trim() !== '' || category !== 'all';

  const { filteredUnsorted, usedGlobalFallback } = useMemo(() => {
    const q = search.toLowerCase();
    // Search title AND description (title-only was too narrow — e.g. a market
    // about elections phrased "Will BJP win Tamil Nadu?" has no "election" in
    // its title).
    const matches = (m: Market) =>
      APP_CONFIG.enabledCategories.includes(m.category) &&
      (category === 'all' || m.category === category) &&
      `${m.title} ${m.description ?? ''}`.toLowerCase().includes(q);

    const primary = markets.filter(matches);
    // India-only is the default, but a query with no India matches shouldn't
    // dead-end at "No markets found" — fall back to global results and say so.
    if (indiaOnly && hasQuery && primary.length === 0) {
      const global = allMarkets.filter(matches);
      if (global.length > 0) return { filteredUnsorted: global, usedGlobalFallback: true };
    }
    return { filteredUnsorted: primary, usedGlobalFallback: false };
  }, [markets, allMarkets, indiaOnly, hasQuery, category, search]);

  const filtered = useMemo(() => {
    const arr = [...filteredUnsorted];
    if (sort === 'trending') return sortByTrending(arr);
    if (sort === 'volume') return arr.sort((a, b) => b.volume - a.volume);
    if (sort === 'change') return arr.sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
    return arr.sort((a, b) => new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime());
  }, [filteredUnsorted, sort]);

  return (
    <div className="pb-24 lg:pb-8">
      <div className="paytm-header px-4 lg:px-8 pt-12 lg:pt-6 pb-5">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={10}>
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white tracking-tight">All Markets</h1>
              <div className="flex items-center gap-2">
                {error && (
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Cached
                  </span>
                )}
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading…' : 'Refresh'}
                </button>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.08} distance={12}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets — RBI, IPL, election…"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/30"
              />
            </div>
            {/* Quick-filter chips — give users a one-tap path to common topics */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {['RBI', 'IPL', 'Election', 'Nifty', 'Bitcoin'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearch(search === term ? '' : term)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all active:scale-90 ${
                    search === term
                      ? 'bg-white text-primary border-white'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-4 space-y-4">
        <AnimateIn delay={0.12} direction="left" distance={20}>
          <CategoryTabs selected={category} onSelect={setCategory} />
        </AnimateIn>

        <AnimateIn delay={0.16}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              {(['trending', 'volume', 'change', 'closing'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 active:scale-90 ${
                    sort === s
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {s === 'trending' ? 'Trending' : s === 'volume' ? 'Top Volume' : s === 'change' ? 'Most Active' : 'Closing Soon'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIndiaOnly(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 active:scale-90 inline-flex items-center gap-1 ${
                indiaOnly
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {indiaOnly ? <><MapPin className="w-3 h-3" /> India</> : <><Globe className="w-3 h-3" /> Global</>}
            </button>
          </div>
        </AnimateIn>

        {usedGlobalFallback && (
          <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs text-orange-800">
            <Globe className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>No India markets for {search.trim() ? <strong>“{search}”</strong> : 'this filter'} right now — showing <strong>global</strong> results instead.</span>
          </div>
        )}

        {loading && markets.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 h-12 bg-muted rounded-md" />
                  <div className="flex-1 h-12 bg-muted rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" baseDelay={0.2} staggerDelay={0.06}>
            {filtered.length > 0 ? (
              filtered.map((m) => <MarketCard key={m.id} market={m} />)
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8 col-span-full">
                No markets found{search.trim() ? ` for “${search}”` : ''}. Try a different term or category.
              </p>
            )}
          </StaggerChildren>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-muted-foreground pb-4">
            Live data from{' '}
            <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Polymarket
            </a>{' '}
            · {filtered.length} markets
          </p>
        )}

        {/* Monetization (both inert until configured): disclosed broker affiliates + an ad slot */}
        <RecommendedBrokers />
        <AdSlot slot="markets-footer" className="my-2 min-h-[90px]" />
      </div>
    </div>
  );
};

export default MarketsPage;
