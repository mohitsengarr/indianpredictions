import { useMemo } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { useSEO } from '@/hooks/useSEO';
import { formatINR, formatPercent, formatProbability } from '@/lib/formatters';
import { CATEGORY_LABELS } from '@/lib/mock-data';
import { Market, MarketCategory } from '@/lib/types';
import AnimateIn from '@/components/AnimateIn';
import StaggerChildren from '@/components/StaggerChildren';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, BarChart3, Globe2, MapPin,
  Flame, Clock, Users, Zap, ArrowUp, ArrowDown, Minus, RefreshCw,
} from 'lucide-react';

// ── colour tokens ──────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  cricket:      'hsl(196 100% 42%)',
  economy:      'hsl(158 100% 35%)',
  entertainment:'hsl(36 96% 50%)',
  crypto:       'hsl(265 80% 60%)',
  politics:     'hsl(2 80% 50%)',
};

const StatCard = ({
  label, value, sub, icon: Icon, trend, color = 'primary',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}) => (
  <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3 shadow-sm">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `hsl(var(--${color}) / 0.12)` }}
    >
      <Icon className="w-5 h-5" style={{ color: `hsl(var(--${color}))` }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-xl font-display font-extrabold leading-tight truncate">{value}</p>
      {sub && (
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          {trend === 'up' && <ArrowUp className="w-3 h-3 text-success" />}
          {trend === 'down' && <ArrowDown className="w-3 h-3 text-destructive" />}
          {trend === 'neutral' && <Minus className="w-3 h-3 text-muted-foreground" />}
          {sub}
        </p>
      )}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: {
  icon: React.ElementType; title: string; subtitle?: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-primary" />
    <div>
      <h2 className="font-display font-bold text-sm lg:text-base leading-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

const CustomTooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  useSEO({
    title: 'Market Analytics – India Predictions',
    description: 'Deep analytics on India prediction markets: volume trends, category breakdown, top movers, and live market health.',
    canonical: '/analytics',
  });

  const { markets, loading, refetch } = useMarkets();

  // ── derived metrics ────────────────────────────────────────
  const stats = useMemo(() => {
    if (!markets.length) return null;

    const totalVolume = markets.reduce((s, m) => s + m.volume, 0);
    const totalLiquidity = markets.reduce((s, m) => s + m.liquidity, 0);
    const totalTraders = markets.reduce((s, m) => s + m.traders, 0);
    const liveCount = markets.filter((m) => m.status === 'live').length;
    const indiaCount = markets.filter((m) =>
      ['cricket', 'economy', 'entertainment'].includes(m.category)
    ).length;

    // avg probability distribution
    const avgYes = markets.reduce((s, m) => s + m.yesPrice, 0) / markets.length;

    // Category breakdown
    const catMap: Record<string, { volume: number; count: number; traders: number; liquidity: number }> = {};
    markets.forEach((m) => {
      if (!catMap[m.category]) catMap[m.category] = { volume: 0, count: 0, traders: 0, liquidity: 0 };
      catMap[m.category].volume += m.volume;
      catMap[m.category].count += 1;
      catMap[m.category].traders += m.traders;
      catMap[m.category].liquidity += m.liquidity;
    });

    const categoryData = Object.entries(catMap)
      .map(([cat, d]) => ({
        cat,
        label: CATEGORY_LABELS[cat]?.label ?? cat,
        emoji: CATEGORY_LABELS[cat]?.emoji ?? '',
        ...d,
        volCr: parseFloat((d.volume / 1e7).toFixed(2)),
        avgTraders: Math.round(d.traders / d.count),
      }))
      .sort((a, b) => b.volume - a.volume);

    // Pie chart data for volume share
    const pieData = categoryData.map((d) => ({
      name: `${d.emoji} ${d.label}`,
      value: parseFloat(((d.volume / totalVolume) * 100).toFixed(1)),
      color: CAT_COLORS[d.cat] ?? 'hsl(196 100% 42%)',
    }));

    // Top movers (by |change24h|)
    const topMovers = [...markets]
      .filter((m) => typeof m.change24h === 'number')
      .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
      .slice(0, 8);

    // Top volume markets
    const topVolume = [...markets].sort((a, b) => b.volume - a.volume).slice(0, 8);

    // Probability distribution histogram (0-10%, 10-20%, ... 90-100%)
    const probBuckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}–${(i + 1) * 10}%`,
      count: 0,
    }));
    markets.forEach((m) => {
      const idx = Math.min(9, Math.floor(m.yesPrice * 10));
      probBuckets[idx].count++;
    });

    // Closing timeline – how many markets close in each period
    const now = Date.now();
    const closingBuckets = [
      { label: '< 1 day',  min: 0,           max: 86400000,           count: 0 },
      { label: '1–7 days', min: 86400000,     max: 7 * 86400000,       count: 0 },
      { label: '1–4 wks',  min: 7 * 86400000, max: 30 * 86400000,      count: 0 },
      { label: '1–3 mo',   min: 30 * 86400000,max: 90 * 86400000,      count: 0 },
      { label: '> 3 mo',   min: 90 * 86400000, max: Infinity,          count: 0 },
    ];
    markets.forEach((m) => {
      const diff = new Date(m.closesAt).getTime() - now;
      if (diff < 0) return;
      const bucket = closingBuckets.find((b) => diff >= b.min && diff < b.max);
      if (bucket) bucket.count++;
    });

    // India vs Global split
    const indiaMarkets = markets.filter((m) =>
      ['cricket', 'economy', 'entertainment'].includes(m.category)
    );
    const globalMarkets = markets.filter((m) =>
      !['cricket', 'economy', 'entertainment'].includes(m.category)
    );
    const indiaVol = indiaMarkets.reduce((s, m) => s + m.volume, 0);
    const globalVol = globalMarkets.reduce((s, m) => s + m.volume, 0);

    // Radar data for category health
    const maxVol = Math.max(...categoryData.map((c) => c.volume));
    const maxTraders = Math.max(...categoryData.map((c) => c.traders));
    const maxLiq = Math.max(...categoryData.map((c) => c.liquidity));
    const radarData = categoryData.map((d) => ({
      cat: `${d.emoji} ${d.label}`,
      Volume: Math.round((d.volume / maxVol) * 100),
      Traders: Math.round((d.traders / maxTraders) * 100),
      Liquidity: Math.round((d.liquidity / maxLiq) * 100),
    }));

    return {
      totalVolume, totalLiquidity, totalTraders, liveCount, indiaCount,
      avgYes, categoryData, pieData, topMovers, topVolume,
      probBuckets, closingBuckets, indiaVol, globalVol, radarData,
      indiaMarketsCount: indiaMarkets.length,
      globalMarketsCount: globalMarkets.length,
    };
  }, [markets]);

  if (loading || !stats) {
    return (
      <div className="pb-24 lg:pb-8">
        <div className="paytm-header px-4 lg:px-8 pt-12 lg:pt-6 pb-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white">Analytics</h1>
            <p className="text-xs text-white/60 mt-0.5">Market intelligence dashboard</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.06) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-12 lg:pt-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={12} duration={0.5}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white">
                  Market Analytics
                </h1>
                <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Live intelligence across {markets.length} prediction markets
                </p>
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8 mt-4">

        {/* ── KPI Strip ─────────────────────────────────────── */}
        <AnimateIn delay={0.05} scale>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total Volume" value={formatINR(stats.totalVolume)}
              sub={`${markets.length} active markets`} icon={BarChart3} trend="up" color="primary"
            />
            <StatCard
              label="Total Liquidity" value={formatINR(stats.totalLiquidity)}
              sub="Depth across all markets" icon={Activity} trend="neutral" color="secondary"
            />
            <StatCard
              label="Total Traders" value={stats.totalTraders.toLocaleString('en-IN')}
              sub={`${stats.liveCount} live markets`} icon={Users} trend="up" color="accent"
            />
            <StatCard
              label="India Markets" value={stats.indiaCount.toString()}
              sub={`${Math.round((stats.indiaCount / markets.length) * 100)}% of all markets`}
              icon={MapPin} trend="neutral" color="warning"
            />
          </div>
        </AnimateIn>

        {/* ── India vs Global ────────────────────────────── */}
        <AnimateIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <SectionHeader icon={Globe2} title="India vs Global" subtitle="Volume & market count comparison" />
            <div className="grid grid-cols-2 gap-4">
              {/* India */}
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, hsl(222 100% 22% / 0.06), hsl(196 100% 42% / 0.06))' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🇮🇳</span>
                  <span className="font-display font-bold text-sm">India</span>
                </div>
                <p className="text-2xl font-display font-extrabold">{formatINR(stats.indiaVol)}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.indiaMarketsCount} markets · {(stats.indiaVol + stats.globalVol) > 0 ? Math.round((stats.indiaVol / (stats.indiaVol + stats.globalVol)) * 100) : 0}% of total volume</p>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(stats.indiaVol + stats.globalVol) > 0 ? Math.round((stats.indiaVol / (stats.indiaVol + stats.globalVol)) * 100) : 0}%`,
                      background: 'linear-gradient(90deg, hsl(222 100% 22%), hsl(196 100% 42%))',
                    }}
                  />
                </div>
              </div>
              {/* Global */}
              <div className="rounded-xl p-4" style={{ background: 'hsl(218 20% 93% / 0.5)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Globe2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-display font-bold text-sm">Global</span>
                </div>
                <p className="text-2xl font-display font-extrabold">{formatINR(stats.globalVol)}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.globalMarketsCount} markets · {(stats.indiaVol + stats.globalVol) > 0 ? Math.round((stats.globalVol / (stats.indiaVol + stats.globalVol)) * 100) : 0}% of total volume</p>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-muted-foreground/40 rounded-full"
                    style={{ width: `${(stats.indiaVol + stats.globalVol) > 0 ? Math.round((stats.globalVol / (stats.indiaVol + stats.globalVol)) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* ── Category Volume Bar + Pie ─────────────────── */}
        <AnimateIn delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5 shadow-sm">
              <SectionHeader icon={BarChart3} title="Volume by Category" subtitle="Total traded volume (₹)" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(218 20% 88% / 0.6)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${(v / 1e5).toFixed(0)}L`} tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} width={42} />
                  <Tooltip content={<CustomTooltipBox />} formatter={(v: number) => formatINR(v)} />
                  <Bar dataKey="volume" name="Volume" radius={[6, 6, 0, 0]}>
                    {stats.categoryData.map((entry) => (
                      <Cell key={entry.cat} fill={CAT_COLORS[entry.cat] ?? 'hsl(196 100% 42%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
              <SectionHeader icon={Activity} title="Volume Share" />
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={72}
                    innerRadius={36}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {stats.pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="space-y-1 mt-1">
                {stats.pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* ── Category Radar + Liquidity per Category ────── */}
        <AnimateIn delay={0.18}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Radar */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <SectionHeader icon={Activity} title="Category Health Radar" subtitle="Volume · Traders · Liquidity (normalised)" />
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={stats.radarData}>
                  <PolarGrid stroke="hsl(218 20% 88%)" />
                  <PolarAngleAxis dataKey="cat" tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar name="Volume"    dataKey="Volume"    stroke="hsl(196 100% 42%)" fill="hsl(196 100% 42% / 0.15)" strokeWidth={2} />
                  <Radar name="Traders"  dataKey="Traders"   stroke="hsl(158 100% 35%)" fill="hsl(158 100% 35% / 0.12)" strokeWidth={2} />
                  <Radar name="Liquidity"dataKey="Liquidity" stroke="hsl(36 96% 50%)"   fill="hsl(36 96% 50% / 0.1)"  strokeWidth={2} />
                  <Tooltip content={<CustomTooltipBox />} formatter={(v: number) => `${v}%`} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center text-xs mt-1">
                {[
                  { label: 'Volume',    color: 'hsl(196 100% 42%)' },
                  { label: 'Traders',   color: 'hsl(158 100% 35%)' },
                  { label: 'Liquidity', color: 'hsl(36 96% 50%)' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avg traders per category */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <SectionHeader icon={Users} title="Avg Traders per Market" subtitle="Engagement by category" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.categoryData} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(218 20% 88% / 0.6)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltipBox />} />
                  <Bar dataKey="avgTraders" name="Avg Traders" radius={[0, 6, 6, 0]}>
                    {stats.categoryData.map((entry) => (
                      <Cell key={entry.cat} fill={CAT_COLORS[entry.cat] ?? 'hsl(196 100% 42%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AnimateIn>

        {/* ── Probability Distribution ─────────────────── */}
        <AnimateIn delay={0.2}>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <SectionHeader
              icon={Activity}
              title="Market Probability Distribution"
              subtitle="How YES prices are spread across all markets"
            />
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.probBuckets} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(196 100% 42%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(196 100% 42%)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(218 20% 88% / 0.6)" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<CustomTooltipBox />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Markets"
                  stroke="hsl(196 100% 42%)"
                  fill="url(#probGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>

        {/* ── Closing Timeline ──────────────────────────── */}
        <AnimateIn delay={0.22}>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <SectionHeader icon={Clock} title="Markets Closing Timeline" subtitle="How many markets close in each window" />
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.closingBuckets} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(218 20% 88% / 0.6)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(218 15% 48%)' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<CustomTooltipBox />} />
                <Bar dataKey="count" name="Markets" fill="hsl(36 96% 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>

        {/* ── Top Movers ────────────────────────────────── */}
        <AnimateIn delay={0.24}>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <SectionHeader icon={Flame} title="Top Movers (24h)" subtitle="Largest price changes in the last 24 hours" />
            <div className="space-y-2">
              {stats.topMovers.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{m.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${CAT_COLORS[m.category] ?? 'hsl(196 100% 42%)'  }22`,
                          color: CAT_COLORS[m.category] ?? 'hsl(196 100% 42%)',
                        }}
                      >
                        {CATEGORY_LABELS[m.category]?.emoji} {CATEGORY_LABELS[m.category]?.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{formatINR(m.volume)} vol</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatProbability(m.yesPrice)}</p>
                    <p className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${m.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {m.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatPercent(m.change24h)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* ── Top Volume Markets ────────────────────────── */}
        <AnimateIn delay={0.26}>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <SectionHeader icon={TrendingUp} title="Highest Volume Markets" subtitle="Most traded markets on the platform" />
            <div className="space-y-2">
              {stats.topVolume.map((m, i) => {
                const maxVol = stats.topVolume[0].volume;
                const pct = (m.volume / maxVol) * 100;
                return (
                  <div key={m.id} className="flex items-center gap-3 py-1.5">
                    <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{m.title}</p>
                      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CAT_COLORS[m.category] ?? 'hsl(196 100% 42%)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold">{formatINR(m.volume)}</p>
                      <p className="text-[10px] text-muted-foreground">{m.traders.toLocaleString('en-IN')} traders</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimateIn>

        {/* ── Category Detail Cards ─────────────────────── */}
        <AnimateIn delay={0.28}>
          <div>
            <SectionHeader icon={Zap} title="Category Breakdown" subtitle="Detailed stats per market category" />
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3" staggerDelay={0.06}>
              {stats.categoryData.map((cat) => (
                <div
                  key={cat.cat}
                  className="bg-card rounded-xl border border-border p-4 shadow-sm"
                  style={{ borderLeftWidth: 3, borderLeftColor: CAT_COLORS[cat.cat] ?? 'hsl(196 100% 42%)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <p className="font-display font-bold text-sm leading-tight">{cat.label}</p>
                      <p className="text-[10px] text-muted-foreground">{cat.count} markets</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Volume',    value: formatINR(cat.volume) },
                      { label: 'Liquidity', value: formatINR(cat.liquidity) },
                      { label: 'Traders',   value: cat.traders.toLocaleString('en-IN') },
                      { label: 'Avg/Market', value: formatINR(Math.round(cat.volume / cat.count)) },
                    ].map((row) => (
                      <div key={row.label} className="bg-muted/40 rounded-lg px-2.5 py-2">
                        <p className="text-[10px] text-muted-foreground">{row.label}</p>
                        <p className="text-xs font-bold truncate">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </AnimateIn>

      </div>
    </div>
  );
}
