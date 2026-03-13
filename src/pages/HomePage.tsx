import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import MarketCard from '@/components/MarketCard';
import RiskBanner from '@/components/RiskBanner';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import TrendingEvents from '@/components/TrendingEvents';
import EventCard from '@/components/EventCard';
import { APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { TRENDING_EVENTS, type EventCategory } from '@/data/trending-events';
import { BLOG_POSTS } from '@/data/blog-posts';
import {
  Search, Bell, Zap, Clock, TrendingUp, RefreshCw,
  ChevronRight, ArrowRight, BookOpen, Mail, Newspaper, BarChart3,
} from 'lucide-react';
import { useIndiaMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';
import { formatINR } from '@/lib/formatters';
import FAQSection from '@/components/FAQSection';
import { MARKET_PULSE_DATA } from '@/data/analytics-data';
import LastUpdated from '@/components/LastUpdated';
import { useDataRefresh } from '@/hooks/useDataRefresh';

/* ── Skeleton ── */
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

/* ── Animated Number Counter ── */
const CountUp = ({ end, duration = 1.5, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

/* ── Live Events Ticker with Market Data ── */
const LiveTicker = () => {
  const critical = TRENDING_EVENTS.filter((e) => e.status === 'critical' || e.status === 'active');
  const tickerItems = [
    ...MARKET_PULSE_DATA.map((d) => ({
      type: 'market' as const,
      label: d.label,
      value: d.value,
      change: d.change,
    })),
    ...critical.map((e) => ({
      type: 'event' as const,
      id: e.id,
      slug: e.slug,
      status: e.status,
      emoji: e.categoryEmoji,
      title: e.title,
    })),
  ];
  return (
    <div className="overflow-hidden bg-muted/50 border-y border-border py-2">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) =>
          item.type === 'market' ? (
            <span key={`m-${i}`} className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
              <span className={`font-bold ${item.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {item.change >= 0 ? '+' : ''}{item.change}%
              </span>
            </span>
          ) : (
            <Link key={`e-${i}`} to={`/events/${item.slug}`} className="inline-flex items-center gap-2 text-xs font-medium hover:text-primary transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'critical' ? 'bg-destructive animate-pulse' : 'bg-success'}`} />
              <span>{item.emoji} {item.title}</span>
            </Link>
          )
        )}
      </motion.div>
    </div>
  );
};

/* ── Category pills ── */
const INDIA_CATEGORY_PILLS = [
  { key: 'cricket', emoji: '🏏', label: 'Cricket & IPL' },
  { key: 'politics', emoji: '🗳️', label: 'Politics' },
  { key: 'economy', emoji: '📈', label: 'Economy' },
  { key: 'entertainment', emoji: '🎬', label: 'Bollywood' },
  { key: 'crypto', emoji: '₿', label: 'Crypto' },
  { key: 'geopolitics', emoji: '🌍', label: 'Geopolitics' },
  { key: 'regulation', emoji: '⚖️', label: 'Regulation' },
  { key: 'technology', emoji: '💻', label: 'Technology' },
  { key: 'sports', emoji: '⚽', label: 'Sports' },
];

/* Map pill keys → event categories they match */
const PILL_TO_EVENT_CATEGORIES: Record<string, EventCategory[]> = {
  cricket: ['sports'],
  politics: ['politics'],
  economy: ['economy', 'markets'],
  entertainment: ['entertainment'],
  crypto: ['markets', 'technology'],
  geopolitics: ['geopolitics'],
  regulation: ['regulation'],
  technology: ['technology'],
  sports: ['sports'],
};

/* Map pill keys → market categories they match */
const PILL_TO_MARKET_CATEGORIES: Record<string, MarketCategory[]> = {
  cricket: ['cricket'],
  politics: ['politics'],
  economy: ['economy'],
  entertainment: ['entertainment'],
  crypto: ['crypto'],
  geopolitics: ['politics'],
  regulation: ['economy'],
  technology: ['crypto'],
  sports: ['cricket'],
};

const HomePage = () => {
  useSEO({
    title: "India Predictions – Live Prediction Markets for Cricket, Politics & Economy",
    description: "India's #1 opinion trading platform. Live prediction markets for IPL, cricket, RBI rates, Nifty, Bollywood box office & Bitcoin. Real-time prices in INR.",
    keywords: "India prediction market, IPL trading, cricket prediction, RBI rate prediction, Nifty prediction, Bollywood box office prediction, opinion trading India",
    canonical: "/",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'India Predictions',
      url: 'https://indianpredictions.lovable.app',
      description: "India's #1 opinion trading platform",
    },
  });

  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');

  const { markets: indiaMarkets, loading: indiaLoading, refetch: refetchIndia, lastUpdated } = useIndiaMarkets();
  const { data: liveEvents, lastUpdated: liveUpdated, loading: liveLoading } = useDataRefresh<{ events: unknown[] }>({ url: '/data/live-events.json' });

  const loading = indiaLoading;
  const refetch = () => { refetchIndia(); };

  // Market sections
  const indiaTrending = indiaMarkets.slice(0, 6);
  const indiaClosingSoon = indiaMarkets
    .filter((m) => { const ms = new Date(m.closesAt).getTime() - Date.now(); return ms > 0 && ms < 7 * 24 * 60 * 60 * 1000; })
    .slice(0, 3);
  const indiaCricket = indiaMarkets.filter(m => m.category === 'cricket').slice(0, 3);
  const indiaPolitics = indiaMarkets.filter(m => m.category === 'politics').slice(0, 3);
  const indiaEconomy = indiaMarkets.filter(m => m.category === 'economy').slice(0, 3);
  const enabledMarkets = indiaMarkets.filter((m) => APP_CONFIG.enabledCategories.includes(m.category));
  const filtered = enabledMarkets.filter((m) => {
    const marketCats = category === 'all' ? null : (PILL_TO_MARKET_CATEGORIES[category] ?? []);
    const matchCat = !marketCats || marketCats.includes(m.category);
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Trending events matching current category
  const filteredEvents = category === 'all'
    ? []
    : TRENDING_EVENTS.filter((e) => {
        const eventCats = PILL_TO_EVENT_CATEGORIES[category] ?? [];
        return eventCats.includes(e.category);
      });

  const indiaTotalVol = indiaMarkets.reduce((s, m) => s + m.volume, 0);

  return (
    <div className="pb-24 lg:pb-8">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        {/* Tricolour stripe */}
        <div className="h-1 w-full flex">
          <div className="flex-1" style={{ background: '#FF9933' }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: '#138808' }} />
        </div>

        <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-8 pb-8 relative">
          {/* Decorative watermark */}
          <div className="absolute right-4 top-4 text-white/5 text-[120px] leading-none select-none pointer-events-none font-bold">
            ☸
          </div>

          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={refetch}
                    disabled={loading}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20 disabled:opacity-40"
                    title="Refresh markets"
                  >
                    <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-white/20"
                  >
                    <Bell className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
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
            </motion.div>

            {/* Stats Bar with animated counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  <CountUp end={indiaMarkets.length} duration={1} /> Live India Markets
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
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <Newspaper className="w-3 h-3 text-warning" />
                <span className="text-xs font-semibold text-white">
                  <CountUp end={TRENDING_EVENTS.length} duration={0.8} /> Trending Events
                </span>
              </div>
              <LastUpdated date={lastUpdated ?? liveUpdated} loading={loading || liveLoading} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Live Events Ticker ── */}
      <LiveTicker />

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-7 mt-5">
        <AnimateIn delay={0.05} scale>
          <RiskBanner />
        </AnimateIn>

        {/* ── Category Pills ── */}
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
                  onClick={() => setCategory(pill.key)}
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

        {/* ── Filtered / Search view ── */}
        {(category !== 'all' || search) && (
          <section className="space-y-6">
            {/* Matching Trending Events */}
            {filteredEvents.length > 0 && !search && (
              <div>
                <AnimateIn>
                  <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-destructive" />
                    Trending Events
                    <span className="text-xs text-muted-foreground font-normal">({filteredEvents.length})</span>
                  </h2>
                </AnimateIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Markets */}
            <div>
              <AnimateIn>
                <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {category !== 'all'
                    ? `${INDIA_CATEGORY_PILLS.find(p => p.key === category)?.emoji ?? ''} ${INDIA_CATEGORY_PILLS.find(p => p.key === category)?.label ?? 'Markets'}`
                    : 'Search Results'}
                  <span className="text-xs text-muted-foreground font-normal">({filtered.length})</span>
                </h2>
              </AnimateIn>
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" staggerDelay={0.06}>
                {filtered.length > 0 ? (
                  filtered.map((m) => <MarketCard key={m.id} market={m} />)
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8 col-span-full">No prediction markets in this category yet</p>
                )}
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* ── Default Home View ── */}
        {category === 'all' && !search && (
          <>

            {/* ── Trending Events Section ── */}
            <section>
              <AnimateIn delay={0.1}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-destructive/15 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">Trending Events</h2>
                      <p className="text-[11px] text-muted-foreground">Major developments shaping Indian markets</p>
                    </div>
                  </div>
                  <Link to="/events/stock-market-crash-fearful-friday" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                    All Events <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </AnimateIn>
              <TrendingEvents limit={6} showFilter={false} />
            </section>

            {/* Cricket & IPL */}
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
                    <button onClick={() => setCategory('cricket')} className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
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
                  <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 text-sm text-secondary-foreground text-center">
                    No active cricket markets · Check back during match season
                  </div>
                )}
              </section>
            )}

            {/* Politics */}
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
                    <button onClick={() => setCategory('politics')} className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
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
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive text-center">
                    No active politics markets right now
                  </div>
                )}
              </section>
            )}

            {/* Economy */}
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
                    <button onClick={() => setCategory('economy')} className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
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
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm text-accent-foreground text-center">
                    No active economy markets right now
                  </div>
                )}
              </section>
            )}

            {/* Closing Soon */}
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

            {/* ── Blog Preview ── */}
            <section>
              <AnimateIn delay={0.1}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">Latest Analysis</h2>
                      <p className="text-[11px] text-muted-foreground">Prediction market insights & education</p>
                    </div>
                  </div>
                  <Link to="/blog" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                    All Posts <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {BLOG_POSTS.slice(0, 3).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="paytm-card p-4 block group h-full">
                      <p className="text-[10px] font-semibold text-primary mb-1">{post.category}</p>
                      <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-1 text-xs text-primary font-semibold mt-3">
                        Read More <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── All India Markets Grid ── */}
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
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" baseDelay={0.1} staggerDelay={0.06}>
                  {indiaTrending.map(m => <MarketCard key={m.id} market={m} />)}
                </StaggerChildren>
              ) : (
                <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground">No India markets available right now</p>
                  <p className="text-xs text-muted-foreground mt-1">Check back soon — new markets are added regularly</p>
                </div>
              )}
            </section>

            {/* ── FAQ Section ── */}
            <AnimateIn delay={0.1}>
              <FAQSection
                faqs={[
                  {
                    question: 'What are prediction markets?',
                    answer: 'Prediction markets are exchange-traded platforms where you buy and sell contracts based on the probability of real-world events. Contract prices between ₹0-₹100 reflect the crowd\'s estimated probability of an outcome occurring.',
                  },
                  {
                    question: 'How do I trade on India Predictions?',
                    answer: 'Browse our markets across cricket, politics, economy, and more. Buy YES if you think an event is likely, or NO if you disagree. Prices update in real-time as new information emerges. Currently operating in play money mode.',
                  },
                  {
                    question: 'Are prediction markets legal in India?',
                    answer: 'India\'s regulatory framework is evolving. Currently, prediction markets operate under opinion trading guidelines. India Predictions uses play money to provide a risk-free educational platform while regulations develop.',
                  },
                  {
                    question: 'How accurate are prediction markets?',
                    answer: 'Research shows prediction markets outperform polls and expert forecasts. They correctly predicted major events globally with 2-4% error margins. Our analytics dashboard tracks accuracy across all markets.',
                  },
                  {
                    question: 'What markets can I trade on?',
                    answer: 'We offer markets on IPL cricket, Indian politics (state and national elections), economy (RBI rates, Nifty, inflation), Bollywood, technology, and geopolitics — all with an India focus.',
                  },
                ]}
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about prediction markets in India"
              />
            </AnimateIn>

            {/* ── Insights CTA ── */}
            <AnimateIn delay={0.1}>
              <Link to="/insights" className="block">
                <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors">Analytics Dashboard</h3>
                      <p className="text-xs text-muted-foreground">McKinsey-style market analytics, sector scores, correlations & more</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            </AnimateIn>

            {/* ── Newsletter Signup ── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-bold text-base">Stay Ahead of the Market</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get weekly prediction market insights, trending events, and analysis delivered to your inbox.
                  </p>
                  <div className="flex gap-2 mt-3 max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Attribution */}
            {!loading && (
              <AnimateIn>
                <p className="text-center text-xs text-muted-foreground pb-2">
                  Live data from{' '}
                  <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Polymarket
                  </a>
                  {' '}· Auto-refreshes every 5 min
                  {(lastUpdated || liveUpdated) && (
                    <span className="ml-1 opacity-60">
                      · Last updated {(lastUpdated ?? liveUpdated)?.toLocaleTimeString('en-IN')}
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
