import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { formatINR, formatPercent, formatProbability, timeUntil } from '@/lib/formatters';
import TradeTicket from '@/components/TradeTicket';
import AnimateIn from '@/components/AnimateIn';
import Breadcrumbs from '@/components/Breadcrumbs';
import SocialShare from '@/components/SocialShare';
import MarketCard from '@/components/MarketCard';
import {
  ExternalLink, Clock, Users, BarChart3, Info, TrendingUp, TrendingDown,
  Loader2, Shield, Calendar, DollarSign, Activity, Target, Droplets,
} from 'lucide-react';
import { useMarket, useMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';

/* ── Synthetic 30-day chart data ── */
function generateChartData(market: { yesPrice: number; priceHistory: { time: string; yes: number; no: number }[] }) {
  if (market.priceHistory.length >= 10) {
    return market.priceHistory.map((p) => ({
      date: new Date(p.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      yes: +(p.yes * 100).toFixed(1),
      no: +(p.no * 100).toFixed(1),
    }));
  }
  // Synthetic 30-day data seeded from current price
  const now = Date.now();
  const base = market.yesPrice * 100;
  const points: { date: string; yes: number; no: number }[] = [];
  let price = base - 15 + Math.random() * 10;
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    price += (Math.random() - 0.48) * 3;
    price = Math.max(5, Math.min(95, price));
    if (i === 0) price = base;
    points.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      yes: +price.toFixed(1),
      no: +(100 - price).toFixed(1),
    });
  }
  return points;
}

/* ── Loading skeleton ── */
const DetailSkeleton = () => (
  <div className="pb-24 lg:pb-8 animate-pulse">
    <div className="bg-gradient-to-b from-[hsl(222,100%,18%)] to-[hsl(222,100%,14%)] px-4 lg:px-8 pt-12 lg:pt-6 pb-8">
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="h-3 bg-white/10 rounded w-48" />
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="flex gap-3 mt-4">
          <div className="h-10 w-24 bg-white/10 rounded-lg" />
          <div className="h-10 w-24 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-6">
      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-4 mt-4 lg:mt-0">
          <div className="h-80 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Activity feed items ── */
const MOCK_ACTIVITY = [
  { time: '2m ago', text: 'Large YES buy – 500 shares at ₹0.62', type: 'buy' as const },
  { time: '8m ago', text: 'Price moved +3.2% on high volume', type: 'price' as const },
  { time: '15m ago', text: 'New trader entered position – 200 NO shares', type: 'sell' as const },
  { time: '1h ago', text: 'Market liquidity increased by ₹12,000', type: 'info' as const },
  { time: '3h ago', text: 'Related news article published – Reuters India', type: 'news' as const },
];

const MarketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { market, loading, error } = useMarket(id);
  const { markets: allMarkets } = useMarkets();
  const [chartRange, setChartRange] = useState<'7d' | '30d' | 'all'>('30d');

  useSEO({
    title: market
      ? `${market.title} – Yes ${Math.round(market.yesPrice * 100)}% | No ${Math.round(market.noPrice * 100)}%`
      : 'Market Detail',
    description: market
      ? `Trade on: "${market.title}". Yes price: ${Math.round(market.yesPrice * 100)}%, No price: ${Math.round(market.noPrice * 100)}%. ${market.resolutionCriteria}`
      : 'View live prediction market prices on India Predictions.',
    keywords: market
      ? `${market.title}, prediction market, opinion trading, ${market.category} prediction India`
      : undefined,
    canonical: id ? `/market/${id}` : undefined,
    schema: market
      ? {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: market.title,
          description: market.resolutionCriteria,
          startDate: market.createdAt,
          endDate: market.closesAt,
          eventStatus: 'https://schema.org/EventScheduled',
          location: { '@type': 'VirtualLocation', url: `https://indianpredictions.lovable.app/market/${market.id}` },
          organizer: { '@type': 'Organization', name: 'India Predictions', url: 'https://indianpredictions.lovable.app' },
        }
      : undefined,
  });

  const chartData = useMemo(() => {
    if (!market) return [];
    const full = generateChartData(market);
    if (chartRange === '7d') return full.slice(-7);
    if (chartRange === '30d') return full.slice(-30);
    return full;
  }, [market, chartRange]);

  const relatedMarkets = useMemo(() => {
    if (!market) return [];
    return allMarkets
      .filter((m) => m.id !== market.id && m.category === market.category)
      .slice(0, 3);
  }, [market, allMarkets]);

  if (loading && !market) return <DetailSkeleton />;

  if (!market) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-muted-foreground">Market not found</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')} className="text-sm text-primary hover:underline">Go back</button>
      </div>
    );
  }

  const cat = CATEGORY_LABELS[market.category];
  const isPositive = market.change24h >= 0;
  const yesPct = Math.round(market.yesPrice * 100);
  const noPct = Math.round(market.noPrice * 100);

  return (
    <div className="pb-24 lg:pb-8">
      {/* ── Header with probability display ── */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-b from-[hsl(222,100%,18%)] to-[hsl(222,100%,14%)] px-4 lg:px-8 pt-12 lg:pt-6 pb-8">
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div className="max-w-6xl mx-auto relative">
            {/* Breadcrumbs */}
            <AnimateIn direction="down" distance={8} duration={0.3}>
              <Breadcrumbs
                dark
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Markets', href: '/markets' },
                  { label: cat?.label ?? market.category, href: `/markets` },
                  { label: market.title.length > 40 ? market.title.slice(0, 40) + '...' : market.title },
                ]}
              />
            </AnimateIn>

            <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              {/* Title & badges */}
              <AnimateIn delay={0.05} distance={12}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
                    {cat?.emoji} {cat?.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    market.status === 'live'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {market.status === 'live' ? 'Live' : market.status}
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-xl lg:text-2xl text-white leading-snug max-w-2xl">
                  {market.title}
                </h1>
              </AnimateIn>

              {/* Large probability display */}
              <AnimateIn delay={0.1} distance={16}>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="font-display text-4xl lg:text-5xl font-black text-green-400"
                    >
                      {yesPct}%
                    </motion.div>
                    <p className="text-xs text-white/50 font-semibold mt-1">YES</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                      className="font-display text-4xl lg:text-5xl font-black text-red-400"
                    >
                      {noPct}%
                    </motion.div>
                    <p className="text-xs text-white/50 font-semibold mt-1">NO</p>
                  </div>
                  <div className="ml-2 text-right">
                    <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatPercent(market.change24h)}
                    </div>
                    <p className="text-[10px] text-white/40 mt-0.5">24h change</p>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">

          {/* ═══ Left Column (60%) ═══ */}
          <div className="lg:col-span-3 space-y-5">

            {/* Recharts probability chart */}
            <AnimateIn delay={0.1} scale>
              <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Probability Chart
                  </h3>
                  <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                    {(['7d', '30d', 'all'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setChartRange(r)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          chartRange === r ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {r === 'all' ? 'All' : r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="yesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16C784" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#16C784" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => `${v}%`}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value: number) => [`${value}%`, 'Yes']}
                      />
                      <Area
                        type="monotone"
                        dataKey="yes"
                        stroke="#16C784"
                        strokeWidth={2}
                        fill="url(#yesGrad)"
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnimateIn>

            {/* About section */}
            <AnimateIn delay={0.15}>
              <div className="bg-card rounded-xl border border-border p-4 lg:p-6 space-y-3">
                <h3 className="font-display font-bold text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  About This Market
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {market.description || market.resolutionCriteria}
                </p>
                {market.contextNote && (
                  <div className="bg-primary/5 rounded-lg border border-primary/10 p-3 mt-2">
                    <p className="text-xs font-semibold text-primary mb-1">Why this matters to India</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{market.contextNote}</p>
                  </div>
                )}
              </div>
            </AnimateIn>

            {/* Resolution criteria */}
            <AnimateIn delay={0.2}>
              <div className="bg-card rounded-xl border border-border p-4 lg:p-6 space-y-3">
                <h3 className="font-display font-bold text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-secondary" />
                  Resolution Criteria
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{market.resolutionCriteria}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Source:</span>
                  <a href={market.resolutionSourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                    {market.resolutionSource}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Closes: {new Date(market.closesAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Resolves: {new Date(market.resolvesAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>
            </AnimateIn>

            {/* Related markets */}
            {relatedMarkets.length > 0 && (
              <AnimateIn delay={0.25}>
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Related Markets
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {relatedMarkets.map((m) => (
                      <MarketCard key={m.id} market={m} compact />
                    ))}
                  </div>
                </div>
              </AnimateIn>
            )}

            {/* Activity feed */}
            <AnimateIn delay={0.3}>
              <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
                <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-warning" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {MOCK_ACTIVITY.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        item.type === 'buy' ? 'bg-green-500' :
                        item.type === 'sell' ? 'bg-red-500' :
                        item.type === 'price' ? 'bg-blue-500' :
                        item.type === 'news' ? 'bg-purple-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-muted-foreground leading-snug">{item.text}</p>
                      </div>
                      <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* ═══ Right Column (40%) ═══ */}
          <div className="lg:col-span-2 mt-5 lg:mt-0 space-y-5">
            {/* Trade panel */}
            <div className="lg:sticky lg:top-6 space-y-5">
              <TradeTicket market={market} />

              {/* Market stats grid */}
              <AnimateIn delay={0.2}>
                <div className="bg-card rounded-xl border border-border p-4 lg:p-5">
                  <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Market Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: BarChart3, label: 'Volume', value: formatINR(market.volume), color: 'text-primary' },
                      { icon: Users, label: 'Traders', value: market.traders.toLocaleString('en-IN'), color: 'text-secondary' },
                      { icon: Droplets, label: 'Liquidity', value: formatINR(market.liquidity), color: 'text-blue-500' },
                      { icon: Clock, label: 'Time Left', value: timeUntil(market.closesAt), color: 'text-warning' },
                      { icon: TrendingUp, label: '24h Change', value: formatPercent(market.change24h), color: isPositive ? 'text-green-500' : 'text-red-500' },
                      { icon: DollarSign, label: 'Yes Price', value: formatProbability(market.yesPrice), color: 'text-green-500' },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                            <span className="text-[10px] text-muted-foreground font-medium">{stat.label}</span>
                          </div>
                          <p className="font-display font-bold text-sm">{stat.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimateIn>

              {/* Price history mini stats */}
              <AnimateIn delay={0.25}>
                <div className="bg-card rounded-xl border border-border p-4 lg:p-5">
                  <h3 className="font-display font-bold text-sm mb-3">Price History</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Current', value: `${yesPct}%`, sub: 'Yes probability' },
                      { label: '24h High', value: `${Math.min(yesPct + 3, 99)}%`, sub: 'Intraday peak' },
                      { label: '24h Low', value: `${Math.max(yesPct - 4, 1)}%`, sub: 'Intraday trough' },
                      { label: '7d Avg', value: `${Math.max(yesPct - 2, 1)}%`, sub: 'Weekly average' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-xs font-medium">{row.label}</p>
                          <p className="text-[10px] text-muted-foreground">{row.sub}</p>
                        </div>
                        <span className="font-display font-bold text-sm">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Share buttons */}
              <AnimateIn delay={0.3}>
                <div className="bg-card rounded-xl border border-border p-4">
                  <SocialShare
                    title={`${market.title} – Yes ${yesPct}% | India Predictions`}
                    text={`What do you think? "${market.title}" is at ${yesPct}% YES on India Predictions.`}
                  />
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailPage;
