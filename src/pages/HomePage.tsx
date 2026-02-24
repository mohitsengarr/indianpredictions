import { useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryTabs from '@/components/CategoryTabs';
import RiskBanner from '@/components/RiskBanner';
import { MARKETS, APP_CONFIG, CATEGORY_LABELS } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { Search, Bell, Zap, Clock, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [category, setCategory] = useState<MarketCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const enabledMarkets = MARKETS.filter((m) =>
    APP_CONFIG.enabledCategories.includes(m.category)
  );

  const filtered = enabledMarkets.filter((m) => {
    const matchCat = category === 'all' || m.category === category;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const trending = [...enabledMarkets].sort((a, b) => b.volume - a.volume).slice(0, 3);
  const closingSoon = [...enabledMarkets]
    .filter((m) => new Date(m.closesAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 && new Date(m.closesAt).getTime() > Date.now())
    .slice(0, 3);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-xl font-bold text-secondary-foreground">
                Opinion<span className="text-primary">Bazaar</span>
              </h1>
              <p className="text-xs text-secondary-foreground/60 mt-0.5">India's Opinion Trading Platform</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-secondary-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search markets..."
              className="w-full bg-secondary-foreground/10 rounded-xl pl-10 pr-4 py-3 text-sm text-secondary-foreground placeholder:text-secondary-foreground/40 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 -mt-2">
        {/* Risk banner */}
        <RiskBanner />

        {/* Categories */}
        <CategoryTabs selected={category} onSelect={setCategory} />

        {/* Featured / Trending */}
        {category === 'all' && !search && (
          <>
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-sm">Trending in India</h2>
              </div>
              <div className="space-y-3">
                {trending.map((m) => (
                  <MarketCard key={m.id} market={m} />
                ))}
              </div>
            </section>

            {closingSoon.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-warning" />
                  <h2 className="font-display font-semibold text-sm">Closing Soon</h2>
                </div>
                <div className="space-y-3">
                  {closingSoon.map((m) => (
                    <MarketCard key={m.id} market={m} compact />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* All / Filtered */}
        {(category !== 'all' || search) && (
          <section>
            <h2 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              {category !== 'all' ? `${CATEGORY_LABELS[category]?.emoji} ${CATEGORY_LABELS[category]?.label}` : 'Search Results'}
              <span className="text-xs text-muted-foreground font-normal">({filtered.length})</span>
            </h2>
            <div className="space-y-3">
              {filtered.length > 0 ? (
                filtered.map((m) => <MarketCard key={m.id} market={m} />)
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">No markets found</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
