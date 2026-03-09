import { useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import { APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';
import { useMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';

const MarketsPage = () => {
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'volume' | 'change' | 'closing'>('volume');
  const { markets, loading, error, refetch } = useMarkets();

  useSEO({
    title: "All Prediction Markets – Cricket, Economy, Crypto, Bollywood",
    description: "Browse all live prediction markets on OpinionBazaar. Filter by cricket, economy, crypto or Bollywood. Sort by volume, activity or closing time. Trade in INR.",
    keywords: "all prediction markets India, live event contracts, opinion trading markets, cricket market, economy prediction, crypto prediction India",
    canonical: "/markets",
  });

  const enabledMarkets = markets.filter((m) =>
    APP_CONFIG.enabledCategories.includes(m.category)
  );

  let filtered = enabledMarkets.filter((m) => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  filtered.sort((a, b) => {
    if (sort === 'volume') return b.volume - a.volume;
    if (sort === 'change') return Math.abs(b.change24h) - Math.abs(a.change24h);
    return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
  });

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
                placeholder="Search markets..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/30"
              />
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-4 space-y-4">
        <AnimateIn delay={0.12} direction="left" distance={20}>
          <CategoryTabs selected={category} onSelect={setCategory} />
        </AnimateIn>

        <AnimateIn delay={0.16}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            {(['volume', 'change', 'closing'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 active:scale-90 ${
                  sort === s ? 'bg-primary/10 text-primary font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'volume' ? 'Top Volume' : s === 'change' ? 'Most Active' : 'Closing Soon'}
              </button>
            ))}
          </div>
        </AnimateIn>

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
              <p className="text-center text-sm text-muted-foreground py-8 col-span-full">No markets found</p>
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
      </div>
    </div>
  );
};

export default MarketsPage;
