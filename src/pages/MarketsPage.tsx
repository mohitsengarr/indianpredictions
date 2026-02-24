import { useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import { MARKETS, APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

const MarketsPage = () => {
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'volume' | 'change' | 'closing'>('volume');

  const enabledMarkets = MARKETS.filter((m) =>
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
    <div className="pb-24">
      <div className="bg-secondary px-4 pt-12 pb-4">
        <div className="max-w-lg mx-auto">
          <AnimateIn direction="down" distance={10}>
            <h1 className="font-display text-xl font-bold text-secondary-foreground mb-3">All Markets</h1>
          </AnimateIn>
          <AnimateIn delay={0.08} distance={12}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-secondary-foreground/10 rounded-xl pl-10 pr-4 py-3 text-sm text-secondary-foreground placeholder:text-secondary-foreground/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:bg-secondary-foreground/15"
              />
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        <AnimateIn delay={0.12} direction="left" distance={20}>
          <CategoryTabs selected={category} onSelect={setCategory} />
        </AnimateIn>

        {/* Sort */}
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

        <StaggerChildren className="space-y-3" baseDelay={0.2} staggerDelay={0.06}>
          {filtered.length > 0 ? (
            filtered.map((m) => <MarketCard key={m.id} market={m} />)
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No markets found</p>
          )}
        </StaggerChildren>
      </div>
    </div>
  );
};

export default MarketsPage;
