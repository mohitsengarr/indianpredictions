import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import MarketCard, { Sparkline } from '@/components/MarketCard';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import HeroDashboardMockup from '@/components/HeroDashboardMockup';
import NewsletterPreview from '@/components/NewsletterPreview';
import AnalyticsPreview from '@/components/AnalyticsPreview';
import SocialProofStrip from '@/components/SocialProofStrip';
import { CategoryIcon } from '@/components/icons/CategoryIcons';
import { APP_CONFIG } from '@/lib/mock-data';
import { MarketCategory } from '@/lib/types';
import { type EventCategory } from '@/data/trending-events';
import { useTrendingEvents } from '@/hooks/useTrendingEvents';
import { BLOG_POSTS } from '@/data/blog-posts';
import {
  Search, Zap, Clock, TrendingUp, RefreshCw,
  ChevronRight, ArrowRight, BookOpen, Mail, BarChart3,
  Target, Eye, Send, CheckCircle, Shield, Bell,
} from 'lucide-react';
import { useMarkets, useIndiaMarkets, useBiggestMovers, useClosingSoon } from '@/hooks/useMarkets';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { Star, Trophy } from 'lucide-react';
import MultiOutcomeCard from '@/components/MultiOutcomeCard';
import { groupMarkets } from '@/lib/market-groups';
import { useSEO } from '@/hooks/useSEO';
import { formatINR, timeUntil, formatProbability } from '@/lib/formatters';
import { useGeo } from '@/contexts/GeoContext';
import { getRegionalMarkets } from '@/lib/recommendations';
import { trackCategoryClick } from '@/lib/analytics';
import { MapPin } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import { MARKET_PULSE_DATA, TIMELINE_EVENTS } from '@/data/analytics-data';
import LastUpdated from '@/components/LastUpdated';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { useBreakingNews } from '@/hooks/useBreakingNews';
import { Newspaper } from 'lucide-react';

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
  // Don't use { once: true }: data loads after mount, so `end` flips 0 -> N
  // while the chip may already be in view; a once-latch would freeze on end=0.
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;
    // Nothing to animate yet (data still loading) — don't latch on 0 via step=0.
    if (end <= 0) {
      setCount(0);
      return;
    }
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

/* ── Macro Ticker Strip (simplified: 5 key India indicators, no duplication) ──
   Values are static/indicative snapshots, not a live feed — labelled as such. */
const MacroTicker = () => (
  <div className="bg-muted/60 border-b border-border py-1.5 flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide px-3">
    <span className="text-[9px] uppercase tracking-wider opacity-50 whitespace-nowrap">Indicative</span>
    {MARKET_PULSE_DATA.map((d, i) => (
      <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap">
        <span className="text-muted-foreground">{d.label}</span>
        <span className="font-semibold text-foreground">{d.value}</span>
        <span className={`font-bold ${d.change >= 0 ? 'text-success' : 'text-destructive'}`}>
          {d.change >= 0 ? '+' : ''}{d.change}%
        </span>
      </span>
    ))}
  </div>
);

/* ── Category pills config (SVG icons replace emojis for visual consistency) ── */
const CATEGORY_SECTIONS: { key: string; iconKey: string; label: string; eventCats: EventCategory[]; marketCats: MarketCategory[] }[] = [
  { key: 'cricket', iconKey: 'cricket', label: 'Cricket & IPL', eventCats: ['sports'], marketCats: ['cricket'] },
  { key: 'politics', iconKey: 'politics', label: 'Politics', eventCats: ['politics'], marketCats: ['politics'] },
  { key: 'economy', iconKey: 'economy', label: 'Economy', eventCats: ['economy', 'markets'], marketCats: ['economy'] },
  { key: 'entertainment', iconKey: 'entertainment', label: 'Bollywood', eventCats: ['entertainment'], marketCats: ['entertainment'] },
  { key: 'crypto', iconKey: 'crypto', label: 'Crypto', eventCats: ['markets', 'technology'], marketCats: ['crypto'] },
  { key: 'geopolitics', iconKey: 'geopolitics', label: 'Geopolitics', eventCats: ['geopolitics'], marketCats: ['politics'] },
  { key: 'regulation', iconKey: 'regulation', label: 'Regulation', eventCats: ['regulation'], marketCats: ['economy'] },
  { key: 'technology', iconKey: 'technology', label: 'Technology', eventCats: ['technology'], marketCats: ['crypto'] },
  { key: 'sports', iconKey: 'sports', label: 'Sports', eventCats: ['sports'], marketCats: ['cricket'] },
  { key: 'energy', iconKey: 'energy', label: 'Energy & Oil', eventCats: ['energy'], marketCats: ['economy'] },
];

/* ── Section category config for default view ──
   Reduced to 4 highest-priority India verticals per PM audit.
   Other categories (Tech, Entertainment, Geopolitics) remain accessible
   via category chips and /markets page. */
const HOME_SECTIONS: { key: EventCategory; iconKey: string; label: string; sub: string; limit: number; pillKey: string }[] = [
  { key: 'markets', iconKey: 'markets', label: 'Markets & Economy', sub: 'Stock market, currency & financial developments', limit: 2, pillKey: 'economy' },
  { key: 'politics', iconKey: 'politics', label: 'Politics & Elections', sub: 'Elections, governance & policy decisions', limit: 2, pillKey: 'politics' },
  { key: 'sports', iconKey: 'cricket', label: 'Cricket & IPL', sub: 'Cricket, IPL & sporting events', limit: 2, pillKey: 'cricket' },
  { key: 'energy', iconKey: 'energy', label: 'Energy & Oil', sub: 'Oil prices, LPG crisis & energy security', limit: 2, pillKey: 'energy' },
];

const HomePage = () => {
  useSEO({
    title: "Live Prediction Market Odds for Cricket, Elections, RBI & Economy",
    description: "See live prediction-market probabilities for India: IPL & cricket, elections, RBI & Nifty, crypto and Bollywood. Aggregated from Polymarket, updated every 5 min. Free, no signup.",
    keywords: "India prediction markets, prediction market india, election prediction market india, cricket prediction market, RBI rate prediction, Nifty prediction, Bollywood box office prediction",
    canonical: "/",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'India Predictions',
      url: 'https://www.indiapredictions.com',
      description: "India's #1 prediction market hub",
    },
  });

  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { markets: allMarkets, loading: allLoading, refetch: refetchAll, lastUpdated: allUpdated } = useMarkets();
  const { markets: indiaOnly, loading: indiaLoading, refetch: refetchIndia, lastUpdated } = useIndiaMarkets();
  // Only show currently-open markets — exclude markets whose closesAt has passed
  // (even if status === 'live' upstream). Don't fall back to allMarkets here:
  // showing non-India content under "All India Markets" is worse than showing fewer cards.
  const now = Date.now();
  const indiaMarkets = indiaOnly.filter(m => new Date(m.closesAt).getTime() > now);
  const { markets: biggestMovers, loading: moversLoading } = useBiggestMovers(6);
  const { markets: closingSoon, loading: closingLoading } = useClosingSoon(6);
  const { data: liveEvents, lastUpdated: liveUpdated, loading: liveLoading } = useDataRefresh<{ events: unknown[] }>({ url: '/data/live-events.json' });
  const { events: trendingEvents } = useTrendingEvents();
  const geo = useGeo();
  const regionalMarkets = geo.region ? getRegionalMarkets(indiaMarkets, geo.region, 4) : [];

  const { news: breakingNews } = useBreakingNews(8);
  const loading = indiaLoading || allLoading;

  // Featured events for hero (top 4 by status priority)
  const featuredEvents = [...trendingEvents]
    .sort((a, b) => {
      const order: Record<string, number> = { critical: 0, active: 1, upcoming: 2, completed: 3 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    })
    .slice(0, 4);

  // Hero right column: 3 live, most-uncertain open India markets.
  // Take the highest-volume open markets, then surface the ones closest to a
  // coin-flip (50/50) — genuine uncertainty is what's engaging, not settled odds.
  const uncertainMarkets = useMemo(() =>
    indiaOnly
      .filter(m => new Date(m.closesAt).getTime() > now
        && m.yesPrice > 0.02 && m.yesPrice < 0.98)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 20)
      .sort((a, b) => Math.abs(a.yesPrice - 0.5) - Math.abs(b.yesPrice - 0.5))
      .slice(0, 3),
    [indiaOnly, now]);

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

  // Multi-outcome "races" (Polymarket-style grouped cards). Group the India
  // markets; grouped members are excluded from the binary "All India Markets"
  // list below so they aren't shown twice.
  const { groups: marketGroups, groupedIds } = useMemo(() => groupMarkets(indiaMarkets), [indiaMarkets]);
  const ungroupedIndiaMarkets = indiaMarkets.filter((m) => !groupedIds.has(m.id));

  // Watchlist ("My Markets") — resolve saved ids against all known markets
  const { watchlist } = useWatchlist();
  const watchedMarkets = watchlist
    .map((id) => allMarkets.find((m) => m.id === id) ?? indiaMarkets.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  // Recently viewed — resolve saved ids against all known markets, exclude
  // anything already surfaced in My Markets, and cap at 6 cards.
  const { recent } = useRecentlyViewed();
  const watchlistIds = new Set(watchlist);
  const recentMarkets = useMemo(
    () =>
      recent
        .map((id) => allMarkets.find((m) => m.id === id) ?? indiaMarkets.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => Boolean(m) && !watchlistIds.has(m!.id))
        .slice(0, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recent, allMarkets, indiaMarkets],
  );

  // Upcoming Events timeline: only show events dated today or later (the static
  // TIMELINE_EVENTS data spans past dates too). Filter BEFORE slicing.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcomingTimelineEvents = TIMELINE_EVENTS
    .filter((item) => new Date(item.date) >= startOfToday)
    .slice(0, 6);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const handleCategoryClick = (key: string) => {
    setCategory(key);
    if (key !== 'all') trackCategoryClick(key);
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
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="lg:col-span-3 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <img src="/favicon.svg" alt="India Predictions logo" className="w-8 h-8 rounded-lg" />
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
                <p className="text-[11px] text-white/40 max-w-md">
                  For Indian investors, policy watchers, and cricket fans who want data-driven probabilities, not just headlines.
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
                    Browse Live India Markets
                  </motion.button>
                  <Link
                    to="/blog/what-are-prediction-markets-guide-india"
                    className="text-sm text-white/70 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Learn how prediction markets work →
                  </Link>
                </div>

                {/* Trust microcopy directly under the CTA to lift conversion */}
                <p className="text-xs text-white/70 font-medium pt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-success" /> Free, no signup</span>
                  <span className="text-white/30">·</span>
                  <span>Live data from Polymarket</span>
                  <span className="text-white/30">·</span>
                  <span>Updated every 5 min</span>
                </p>

                <p className="text-[10px] text-white/40">
                  Prediction market tracker — no real money involved.
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap pt-2">
                  {/* Show real counts only — hide chips entirely when 0 instead of fabricating numbers */}
                  {indiaMarkets.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-semibold text-white">
                        <CountUp end={indiaMarkets.length} duration={1} />+ Live Markets
                      </span>
                    </div>
                  )}
                  {indiaTotalVol > 0 && (
                    <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                      <TrendingUp className="w-3 h-3 text-secondary" />
                      <span className="text-xs font-semibold text-white">{formatINR(indiaTotalVol)} Volume</span>
                    </div>
                  )}
                  {trendingEvents.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                      <Zap className="w-3 h-3 text-warning" />
                      <span className="text-xs font-semibold text-white">
                        <CountUp end={trendingEvents.length} duration={0.8} /> Events
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right: Product mockup + Featured Events */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
                className="lg:col-span-2 space-y-3"
              >
                {/* Hero dashboard mockup — shows the product in context */}
                <HeroDashboardMockup className="hidden sm:block" />

                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1 sm:mt-3">Live India Markets</p>
                {indiaLoading && uncertainMarkets.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white/10 rounded-lg h-[88px] animate-pulse" />
                  ))
                ) : uncertainMarkets.length > 0 ? (
                  uncertainMarkets.map((m) => {
                    const yesPct = Math.round(m.yesPrice * 100);
                    const noPct = 100 - yesPct;
                    return (
                      <Link
                        key={m.id}
                        to={`/market/${m.id}`}
                        className="block bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3.5 py-2.5 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-white leading-snug line-clamp-2 min-w-0">{m.title}</p>
                          <span className="text-sm font-extrabold text-secondary whitespace-nowrap">{formatProbability(m.yesPrice)}</span>
                        </div>
                        <div className="flex rounded overflow-hidden h-1.5 mt-2">
                          <div style={{ width: `${yesPct}%`, background: 'hsl(var(--success))' }} />
                          <div style={{ width: `${noPct}%`, background: 'hsl(var(--destructive))' }} />
                        </div>
                        <Sparkline market={m} />
                        <div className="flex items-center justify-between mt-1 text-[10px] text-white/50">
                          <span>{formatINR(m.volume)} vol</span>
                          <span>{timeUntil(m.closesAt)}</span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  featuredEvents.slice(0, 3).map((event) => (
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
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8 mt-6">

        {/* ── My Markets (watchlist — returning-visitor retention) ── */}
        {watchedMarkets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base lg:text-lg leading-tight">My Markets</h2>
                  <p className="text-[11px] text-muted-foreground">Markets you're tracking — saved on this device</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
              {watchedMarkets.map((m) => (
                <div key={m.id} className="min-w-[85vw] snap-center sm:min-w-0">
                  <MarketCard market={m} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Recently Viewed (history rail — returning-visitor retention) ── */}
        {recentMarkets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base lg:text-lg leading-tight">Recently Viewed</h2>
                  <p className="text-[11px] text-muted-foreground">Markets you've looked at — on this device</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
              {recentMarkets.map((m) => (
                <div key={m.id} className="min-w-[85vw] snap-center sm:min-w-0">
                  <MarketCard market={m} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── How It Works (enhanced visual panels) ── */}
        <AnimateIn delay={0.05}>
          <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
            <h2 className="font-display font-bold text-base lg:text-lg mb-5">How India Predictions works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                {
                  icon: Target,
                  title: 'Choose an event',
                  desc: 'Elections, RBI moves, IPL matches, oil prices and more.',
                  visual: (
                    <div className="flex gap-1 mt-2">
                      {['Politics', 'IPL', 'RBI'].map(t => (
                        <span key={t} className="text-[8px] bg-primary/8 text-primary rounded-full px-1.5 py-0.5 font-medium">{t}</span>
                      ))}
                    </div>
                  ),
                  step: 1,
                },
                {
                  icon: Eye,
                  title: 'See live probabilities',
                  desc: 'Real-time YES/NO odds from Polymarket.',
                  visual: (
                    <div className="flex h-4 rounded-full overflow-hidden mt-2 text-[7px] font-bold">
                      <div className="bg-success/70 text-white flex items-center justify-center" style={{ width: '62%' }}>YES 62%</div>
                      <div className="bg-destructive/50 text-white flex items-center justify-center flex-1">NO 38%</div>
                    </div>
                  ),
                  step: 2,
                },
                {
                  icon: BarChart3,
                  title: 'Analyze the odds',
                  desc: 'Probability trends and sector correlations.',
                  visual: (
                    <svg viewBox="0 0 80 20" className="w-full h-4 mt-2" preserveAspectRatio="none">
                      <path d="M0 16 L12 12 L24 14 L36 8 L48 10 L60 5 L72 6 L80 4" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="60" cy="5" r="2" fill="hsl(var(--primary))" opacity="0.6" />
                    </svg>
                  ),
                  step: 3,
                },
                {
                  icon: Send,
                  title: 'Get weekly summaries',
                  desc: 'Top 5 shifts + charts every Monday.',
                  visual: (
                    <div className="flex items-center gap-1 mt-2 bg-muted/50 rounded px-1.5 py-1">
                      <Mail className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[7px] text-muted-foreground font-medium">India Predictions Weekly</span>
                    </div>
                  ),
                  step: 4,
                },
              ] as const).map((item) => (
                <div key={item.step} className="relative bg-muted/30 border border-border/50 rounded-lg p-3.5 group hover:border-primary/20 transition-colors">
                  {/* Step number */}
                  <span className="absolute -top-2 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {item.step}
                  </span>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  {/* Mini UI snippet */}
                  {item.visual}
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

        {/* ── Analytics Quick CTA (elevated for power users per PM audit) ── */}
        <AnimateIn delay={0.06}>
          <Link
            to="/insights"
            className="flex items-center gap-3 bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 rounded-xl px-4 py-3 group hover:border-secondary/40 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">Dashboards for markets, elections & oil</p>
              <p className="text-[10px] text-muted-foreground">Sector scores, correlations & historical trends</p>
            </div>
            <span className="text-xs font-semibold text-secondary group-hover:text-primary whitespace-nowrap flex items-center gap-0.5 transition-colors">
              Open Analytics <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
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

        {/* ── Browse by Category (sticky on scroll) ── */}
        {!search && (
          <AnimateIn delay={0.1}>
            <section id="browse-categories" className="sticky top-0 z-30 bg-background/95 backdrop-blur-md -mx-4 px-4 lg:-mx-8 lg:px-8 py-3 -mt-2">
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
                    <CategoryIcon category={pill.iconKey} size={14} className={category === pill.key ? 'text-primary-foreground' : 'text-muted-foreground'} />
                    {pill.label}
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
                  ? CATEGORY_SECTIONS.find(p => p.key === category)?.label ?? 'Markets'
                  : 'Search Results'}
                <span className="text-xs text-muted-foreground font-normal">({filtered.length})</span>
              </h2>
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" staggerDelay={0.06}>
                {filtered.length > 0 ? (
                  filtered.map((m) => <MarketCard key={m.id} market={m} />)
                ) : (
                  <EmptyState
                    type="no-results"
                    actionLabel="Browse all India markets"
                    onAction={() => handleCategoryClick('all')}
                  />
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
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <CategoryIcon category={cat.iconKey} size={18} className="text-primary" />
                        </div>
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

            {/* ── Races to Watch (multi-outcome grouped cards) ── */}
            {marketGroups.length > 0 && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base lg:text-lg leading-tight">Races to Watch</h2>
                      <p className="text-[11px] text-muted-foreground">Multi-outcome events — see every contender's odds at a glance</p>
                    </div>
                  </div>
                </AnimateIn>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {marketGroups.slice(0, 3).map((g) => <MultiOutcomeCard key={g.id} group={g} />)}
                </div>
              </section>
            )}

            {/* ── All India Markets ── */}
            {ungroupedIndiaMarkets.length > 0 && (
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
                      {ungroupedIndiaMarkets.length} markets live
                    </span>
                  </div>
                </AnimateIn>
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" baseDelay={0.1} staggerDelay={0.06}>
                  {ungroupedIndiaMarkets.slice(0, 6).map(m => <MarketCard key={m.id} market={m} />)}
                </StaggerChildren>
                {ungroupedIndiaMarkets.length > 6 && (
                  <div className="text-center mt-4">
                    <Link to="/markets" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      View all {ungroupedIndiaMarkets.length} markets <ArrowRight className="w-4 h-4" />
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

            {/* ── Trending Near You (geo-personalized) ── */}
            {regionalMarkets.length > 0 && geo.regionName && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Trending in {geo.regionName}</h2>
                        <p className="text-[11px] text-muted-foreground">Markets relevant to your region</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:pb-0">
                  {regionalMarkets.map((m) => (
                    <div key={m.id} className="min-w-[85vw] snap-center sm:min-w-0">
                      <MarketCard market={m} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Breaking News (lower in page to reduce homepage noise & external link leakage) ── */}
            {breakingNews.length > 0 && (
              <section aria-label="Breaking India news" itemScope itemType="https://schema.org/ItemList" className="bg-card border border-border rounded-xl p-5 lg:p-6">
                <meta itemProp="name" content="Breaking India News" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-destructive" />
                    <h2 className="font-display font-bold text-base lg:text-lg">Breaking News</h2>
                    <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold animate-pulse" aria-label="Live updates">LIVE</span>
                  </div>
                  <time dateTime={breakingNews[0]?.fetchedAt} className="text-[10px] text-muted-foreground">
                    Updated {new Date(breakingNews[0]?.fetchedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </time>
                </div>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0" role="list">
                  {breakingNews.slice(0, 4).map((item, idx) => (
                    <article
                      key={item.id}
                      itemScope
                      itemType="https://schema.org/NewsArticle"
                      itemProp="itemListElement"
                      className="min-w-[75vw] snap-center sm:min-w-0"
                      role="listitem"
                    >
                      <meta itemProp="position" content={String(idx + 1)} />
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="url"
                        className="block bg-muted/50 hover:bg-muted border border-border rounded-lg p-3 transition-all group h-full"
                      >
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wide" itemProp="articleSection">{item.category}</span>
                        <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mt-1 group-hover:text-primary transition-colors" itemProp="headline">{item.title}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1" itemProp="description">{item.summary.substring(0, 120)}...</p>
                        <time dateTime={item.publishedDate} itemProp="datePublished" className="sr-only">
                          {new Date(item.publishedDate).toISOString()}
                        </time>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ── Biggest Movers (India-relevant only) ── */}
            {biggestMovers.length > 0 && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-destructive/15 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Biggest India Movers</h2>
                        <p className="text-[11px] text-muted-foreground">India markets with the largest probability shifts in 24h</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
                  {biggestMovers.map((m, i) => (
                    <div key={m.id} className="min-w-[85vw] snap-center sm:min-w-0">
                      <MarketCard market={m} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Closing Soon ── */}
            {closingSoon.length > 0 && (
              <section>
                <AnimateIn delay={0.1}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-base leading-tight">Closing Soon</h2>
                        <p className="text-[11px] text-muted-foreground">India markets about to resolve — last chance to track</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
                  {closingSoon.map((m, i) => (
                    <div key={m.id} className="min-w-[85vw] snap-center sm:min-w-0">
                      <MarketCard market={m} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Social Proof ── */}
            <AnimateIn delay={0.1}>
              <SocialProofStrip marketsCount={indiaMarkets.length} eventsCount={trendingEvents.length} />
            </AnimateIn>

            {/* ── Analytics & Insights (with dashboard preview) ── */}
            <AnimateIn delay={0.1}>
              <AnalyticsPreview />
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
                {BLOG_POSTS.slice(0, 3).map((post, i) => {
                  const catColors: Record<string, string> = {
                    Education: 'from-blue-500/10 to-transparent',
                    Sports: 'from-emerald-500/10 to-transparent',
                    Economy: 'from-amber-500/10 to-transparent',
                    Markets: 'from-violet-500/10 to-transparent',
                    Politics: 'from-red-500/10 to-transparent',
                  };
                  const grad = catColors[post.category] ?? 'from-primary/10 to-transparent';
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                    >
                      <Link to={`/blog/${post.slug}`} className="paytm-card block group h-full overflow-hidden">
                        {/* Category color band */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                        <div className="p-4">
                          <p className="text-[10px] font-semibold text-primary mb-1">{post.category}</p>
                          <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-1 text-xs text-primary font-semibold mt-3">
                            Read More <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ── Upcoming Events Timeline (hidden when fewer than 2 future events remain) ── */}
            {upcomingTimelineEvents.length >= 2 && (
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
                  {upcomingTimelineEvents.map((item, i) => {
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
            )}

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

            {/* ── Newsletter Signup (with email preview + trust badges) ── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* Left: Form */}
                <div className="lg:col-span-3 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-base">Stay Ahead of the Market</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Every Monday: top 5 India probability shifts, 2 key charts, and one "market says X but headlines say Y" insight.
                    </p>
                    {subscribed ? (
                      <div className="flex items-center gap-2 mt-3 text-success text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Thanks — you're on the list. The weekly briefing launches soon.
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
                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {[
                            { icon: Shield, text: 'No spam' },
                            { icon: Bell, text: 'One email / week' },
                            { icon: BarChart3, text: 'Polymarket data' },
                          ].map((badge) => (
                            <span key={badge.text} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              <badge.icon className="w-3 h-3 opacity-50" />
                              {badge.text}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">By subscribing, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Email preview */}
                <div className="lg:col-span-2 hidden lg:flex justify-end">
                  <NewsletterPreview className="transform -rotate-1 hover:rotate-0 transition-transform" />
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
