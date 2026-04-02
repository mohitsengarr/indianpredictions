import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import MarketCard from '@/components/MarketCard';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import EventCard from '@/components/EventCard';
import { APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { type EventCategory } from '@/data/trending-events';
import { useTrendingEvents } from '@/hooks/useTrendingEvents';
import { BLOG_POSTS } from '@/data/blog-posts';
import {
  Search, Zap, Clock, TrendingUp, RefreshCw,
  ChevronRight, ArrowRight, BookOpen, Mail, BarChart3,
  Target, Eye, Send, CheckCircle,
} from 'lucide-react';
import { useIndiaMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';
import { formatINR } from '@/lib/formatters';
import FAQSection from '@/components/FAQSection';
import { MARKET_PULSE_DATA, TIMELINE_EVENTS } from '@/data/analytics-data';
import LastUpdated from '@/components/LastUpdated';
import { useDataRefresh } from '@/hooks/useDataRefresh';

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse">
    <div className="h-3 bg-muted rounded w-1/3" />
    <div className="h-4 bg-muted rounded w-full" />
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="flex gap-2 mt-2">
      <div className="flex-1 h-10 bg-muted rounded-md" />
      <div className="flex-1 h-10 bg-muted rounded-md" />
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

/* ── Macro Ticker Strip ── */
const MacroTicker = () => (
  <div className="overflow-hidden bg-muted/60 border-b border-border py-1.5 flex items-center">
    <span className="text-[9px] text-muted-foreground/60 px-3 border-r border-border whitespace-nowrap shrink-0">Market data</span>
    <motion.div
      className="flex-1 flex gap-8 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
    >
      {[...MARKET_PULSE_DATA, ...MARKET_PULSE_DATA].map((d, i) => (
        <span key={i} className="inline-flex items-center gap-2 text-[11px] font-medium">
          <span className="text-muted-foreground">{d.label}</span>
          <span className="font-semibold text-foreground">{d.value}</span>
          <span className={`font-bold ${d.change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {d.change >= 0 ? '+' : ''}{d.change}%
          </span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ── Category pills config ── */
const CATEGORY_SECTIONS: { key: string; emoji: string; label: string; eventCats: EventCategory[]; marketCats: MarketCategory[] }[] = [
  { key: 'cricket', emoji: '🏏', label: 'Cricket & IPL', eventCats: ['sports'], marketCats: ['cricket'] },
  { key: 'politics', emoji: '🗳️', label: 'Politics', eventCats: ['politics'], marketCats: ['politics'] },
  { key: 'economy', emoji: '📈', label: 'Economy', eventCats: ['economy', 'markets'], marketCats: ['economy'] },
  { key: 'entertainment', emoji: '🎬', label: 'Bollywood', eventCats: ['entertainment'], marketCats: ['entertainment'] },
  { key: 'crypto', emoji: '₿', label: 'Crypto', eventCats: ['markets', 'technology'], marketCats: ['crypto'] },
  { key: 'geopolitics', emoji: '🌍', label: 'Geopolitics', eventCats: ['geopolitics'], marketCats: ['politics'] },
  { key: 'regulation', emoji: '⚖️', label: 'Regulation', eventCats: ['regulation'], marketCats: ['economy'] },
  { key: 'technology', emoji: '💻', label: 'Technology', eventCats: ['technology'], marketCats: ['crypto'] },
  { key: 'sports', emoji: '⚽', label: 'Sports', eventCats: ['sports'], marketCats: ['cricket'] },
  { key: 'energy', emoji: '⛽', label: 'Energy & Oil', eventCats: ['energy'], marketCats: ['economy'] },
];

/* ── Section category config for default view ── */
const HOME_SECTIONS: { key: EventCategory; emoji: string; label: string; sub: string; limit: number; pillKey: string }[] = [
  { key: 'markets', emoji: '📉', label: 'Markets & Economy', sub: 'Stock market, currency & financial developments', limit: 2, pillKey: 'economy' },
  { key: 'politics', emoji: '🗳️', label: 'Politics & Elections', sub: 'Elections, governance & policy decisions', limit: 2, pillKey: 'politics' },
  { key: 'sports', emoji: '🏏', label: 'Sports', sub: 'Cricket, IPL & sporting events', limit: 2, pillKey: 'cricket' },
  { key: 'energy', emoji: '⛽', label: 'Energy & Oil', sub: 'Oil prices, LPG crisis & energy security', limit: 2, pillKey: 'energy' },
  { key: 'geopolitics', emoji: '🌍', label: 'Geopolitics', sub: 'Global events impacting India', limit: 2, pillKey: 'geopolitics' },
  { key: 'technology', emoji: '💻', label: 'Technology & Startups', sub: 'Tech policy, startups & innovation', limit: 2, pillKey: 'technology' },
  { key: 'entertainment', emoji: '🎬', label: 'Entertainment', sub: 'Bollywood, OTT & box office', limit: 2, pillKey: 'entertainment' },
];

const HomePage = () => {
  useSEO({
    title: "India Predictions – Track Live Prediction Market Odds for Cricket, Politics & Economy",
    description: "Track live prediction market odds for India — cricket, politics, economy, Bollywood and more. Aggregated from Polymarket. Updated every 5 minutes.",
    keywords: "India prediction market, IPL trading, cricket prediction, RBI rate prediction, Nifty prediction, Bollywood box office prediction, opinion trading India",
    canonical: "/",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'India Predictions',
      url: 'https://indianpredictions.vercel.app',
      description: "India's #1 prediction market hub",
    },
  });

  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { markets: indiaMarkets, loading: indiaLoading, refetch: refetchIndia, lastUpdated } = useIndiaMarkets();
  const { data: liveEvents, lastUpdated: liveUpdated, loading: liveLoading } = useDataRefresh<{ events: unknown[] }>({ url: '/data/live-events.json' });
  const { events: trendingEvents } = useTrendingEvents();

  const loading = indiaLoading;

  // Featured events for hero (top 4 by status priority)
  const featuredEvents = [...trendingEvents]
    .sort((a, b) => {
      const order: Record<string, number> = { critical: 0, active: 1, upcoming: 2, completed: 3 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    })
    .slice(0, 4);

  // Market sections
  const enabledMarkets = indiaMarkets.filter((m) => APP_CONFIG.enabledCategories.includes(m.category));
  const filtered = enabledMarkets.filter((m) => {
    const catConfig = CATEGORY_SECTIONS.find(c => c.key === category);
    const marketCats = category === 'all' ? null : (catConfig?.marketCats ?? []);
    const matchCat = !marketCats || marketCats.includes(m.category);
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredEvents = category === 'all'
    ? []
    : trendingEvents.filter((e) => {
        const catConfig = CATEGORY_SECTIONS.find(c => c.key === category);
        return catConfig?.eventCats.includes(e.category) ?? false;
      });

  const indiaTotalVol = indiaMarkets.reduce((s, m) => s + m.volume, 0);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const handleCategoryClick = (key: string) => {
    setCategory(key);
    if (key !== 'all') {
      // Scroll to filtered section
      setTimeout(() => {
        const el = document.getElementById('filtered-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSubscribe = () => {
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setSubscribed(true);
  };

  return (
    <div className="pb-24 lg:pb-8">

      {/* ── Macro Ticker Strip (thin, secondary) ── */}
      <MacroTicker />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        {/* Tricolour stripe */}
        <div className="h-1 w-full flex">
          <div className="flex-1" style={{ background: '#FF9933' }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: '#138808' }} />
        </div>

        <div className="paytm-header px-4 lg:px-8 pt-8 pb-10 relative">
          <div className="absolute right-4 top-4 text-white/5 text-[100px] leading-none select-none pointer-events-none font-bold">☸</div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: Brand + Headline + CTAs */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-3 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="font-display text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                    India<span className="text-secondary">Predictions</span>
                  </span>
                </div>

                <h1 className="font-display text-2xl lg:text-4xl font-extrabold text-white leading-tight">
                  Track India's Prediction Markets
                </h1>

                <p className="text-sm lg:text-base text-white/70 leading-relaxed max-w-lg">
                  Live odds on politics, cricket, economy and more — aggregated from global prediction markets and tailored for Indian watchers.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const el = document.getElementById('browse-categories');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-all"
                  >
                    Explore India Markets
                  </motion.button>
                  <Link
                    to="/blog/what-are-prediction-markets-guide-india"
                    className="text-sm text-white/70 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Learn how prediction markets work →
                  </Link>
                </div>

                <p className="text-[10px] text-white/40 pt-1">
                  Prediction market tracker — no real money involved. Data from Polymarket.
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap pt-2">
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-semibold text-white">
                      <CountUp end={indiaMarkets.length > 0 ? indiaMarkets.length : 150} duration={1} />+ Live Markets
                    </span>
                  </div>
                  {indiaTotalVol > 0 && (
                    <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                      <TrendingUp className="w-3 h-3 text-secondary" />
                      <span className="text-xs font-semibold text-white">{formatINR(indiaTotalVol)} Volume</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="text-xs font-semibold text-white">
                      <CountUp end={trendingEvents.length > 0 ? trendingEvents.length : 26} duration={0.8} /> Events
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Featured Events mini-cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:col-span-2 space-y-2.5"
              >
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1">Featured Events</p>
                {featuredEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.slug}`}
                    className="block bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3.5 py-2.5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-snug line-clamp-1">{event.title}</p>
                        <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{event.predictionMarketAngle}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-secondary group-hover:text-white whitespace-nowrap transition-colors flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8 mt-6">

        {/* ── How It Works ── */}
        <AnimateIn delay={0.05}>
          <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
            <h2 className="font-display font-bold text-base lg:text-lg mb-4">How India Predictions works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Target, title: 'Choose an event', desc: 'Elections, RBI moves, IPL matches, oil prices and more.' },
                { icon: Eye, title: 'See live probabilities', desc: 'From active prediction markets powered by Polymarket.' },
                { icon: BarChart3, title: 'Analyze the odds', desc: 'Use prediction market probabilities as a smarter signal for any event.' },
                { icon: Send, title: 'Get weekly summaries', desc: "So you don't miss major shifts in sentiment." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/blog/what-are-prediction-markets-guide-india"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-4"
            >
              Read full guide <ArrowRight className="w-3 h-3" />
            </Link>
          </section>
        </AnimateIn>

        {/* ── Search ── */}
        <AnimateIn delay={0.08}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search India markets..."
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </AnimateIn>

        {/* ── Browse by Category ── */}
        {!search && (
          <AnimateIn delay={0.1}>
            <section id="browse-categories">
              <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Browse by category</h2>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                <button
                  onClick={() => handleCategoryClick('all')}
                  aria-label="Filter by All India categories"
                  aria-pressed={category === 'all'}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                    category === 'all'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  🇮🇳 All India
                </button>
                {CATEGORY_SECTIONS.map(pill => (
                  <button
                    key={pill.key}
                    onClick={() => handleCategoryClick(pill.key)}
                    aria-label={`Filter by ${pill.label} category`}
                    aria-pressed={category === pill.key}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                      category === pill.key
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted/50'
                    }`}
                  >
                    {pill.emoji} {pill.label}
                    {(() => {
                      const eventCount = trendingEvents.filter(e => pill.eventCats.includes(e.category)).length;
                      const marketCount = indiaMarkets.filter(m => pill.marketCats.includes(m.category)).length;
                      const total = eventCount + marketCount;
                      return total > 0 ? <span className="text-[10px] text-muted-foreground font-normal ml-0.5">({total})</span> : null;
                    })()}
                  </button>
                ))}
              </div>
            </section>
          </AnimateIn>
        )}

        {/* ── Filtered / Search view ── */}
        {(category !== 'all' || search) && (
          <section id="filtered-section" className="space-y-6">
            {filteredEvents.length > 0 && !search && (
              <div>
                <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-destructive" />
                  Trending Events
                  <span className="text-xs text-muted-foreground font-normal">({filteredEvents.length})</span>
                </h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
                  {filteredEvents.map((event, i) => (
                    <div key={event.id} className="min-w-[85vw] snap-center sm:min-w-0">
                      <EventCard event={event} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="font-display font-semibold text-sm lg:text-base mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                {category !== 'all'
                  ? `${CATEGORY_SECTIONS.find(p => p.key === category)?.emoji ?? ''} ${CATEGORY_SECTIONS.find(p => p.key === category)?.label ?? 'Markets'}`
                  : 'Search Results'}
                <span className="text-xs text-muted-foreground font-normal">({filtered.length})</span>
              </h2>
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
            {/* ── Category-Wise Trending Events ── */}
            {HOME_SECTIONS.map(cat => {
              const events = cat.key === 'markets'
                ? trendingEvents.filter(e => e.category === 'markets' || e.category === 'economy').slice(0, cat.limit)
                : trendingEvents.filter(e => e.category === cat.key).slice(0, cat.limit);
              if (events.length === 0) return null;
              return (
                <section key={cat.key} ref={el => { sectionRefs.current[cat.key] = el; }}>
                  <AnimateIn delay={0.1}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <div>
                          <h2 className="font-display font-bold text-base leading-tight">{cat.label}</h2>
                          <p className="text-[11px] text-muted-foreground">{cat.sub}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCategoryClick(cat.pillKey)}
                        className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
                      >
                        More <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </AnimateIn>
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:pb-0">
                    {events.map((event, i) => (
                      <div key={event.id} className="min-w-[85vw] snap-center sm:min-w-0">
                        <EventCard event={event} index={i} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ── All India Markets ── */}
            {indiaMarkets.length > 0 && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇮🇳</span>
                      <div>
                        <h2 className="font-display font-bold text-base lg:text-lg leading-tight">All India Markets</h2>
                        <p className="text-[11px] text-muted-foreground">All live India-related prediction markets in one place.</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                      {indiaMarkets.length} markets live
                    </span>
                  </div>
                </AnimateIn>
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" baseDelay={0.1} staggerDelay={0.06}>
                  {indiaMarkets.slice(0, 6).map(m => <MarketCard key={m.id} market={m} />)}
                </StaggerChildren>
                {indiaMarkets.length > 6 && (
                  <div className="text-center mt-4">
                    <Link to="/markets" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      View all {indiaMarkets.length} markets <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {indiaLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* ── Analytics & Insights Card ── */}
            <AnimateIn delay={0.1}>
              <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-base lg:text-lg">Analytics & Insights</h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Deep dashboards with sector scores, historical trends and correlations across India-focused prediction markets.
                    </p>
                    <Link
                      to="/insights"
                      className="inline-flex items-center gap-2 mt-3 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Open Analytics Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            </AnimateIn>

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

            {/* ── Upcoming Events Timeline ── */}
            <section>
              <AnimateIn delay={0.1}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">Upcoming Events</h2>
                      <p className="text-[11px] text-muted-foreground">Key events on the horizon with importance ratings</p>
                    </div>
                  </div>
                  <Link to="/insights" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                    Full Insights <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </AnimateIn>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-3">
                  {TIMELINE_EVENTS.slice(0, 6).map((item, i) => {
                    const impColor = item.importance === 'high' ? 'bg-destructive' : item.importance === 'medium' ? 'bg-warning' : 'bg-muted-foreground';
                    const d = new Date(item.date);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-4 pl-1"
                      >
                        <div className={`w-7 h-7 rounded-full ${impColor} flex items-center justify-center flex-shrink-0 relative z-10`}>
                          <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 bg-card rounded-lg p-3 border border-border/50">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-foreground">{item.event}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              item.importance === 'high' ? 'bg-destructive/15 text-destructive' :
                              item.importance === 'medium' ? 'bg-warning/15 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {item.importance}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-primary font-medium">{item.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
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
                    answer: 'Browse live prediction market odds across cricket, politics, economy, and more. See YES/NO probabilities that update in real-time as new information emerges. Use the data as a smarter signal for any event.',
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
                  {subscribed ? (
                    <div className="flex items-center gap-2 mt-3 text-success text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      You're subscribed. Check your inbox for a confirmation email.
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 mt-3 max-w-sm">
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <input
                          id="newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                          placeholder="your@email.com"
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubscribe}
                          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Subscribe
                        </motion.button>
                      </div>
                      {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                      <p className="text-[11px] text-muted-foreground mt-2">One email per week. No spam, unsubscribe anytime. By subscribing, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
                    </>
                  )}
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
