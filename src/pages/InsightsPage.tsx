import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, Cell, Legend, ReferenceLine,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Target, Zap, BarChart3, Clock,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  MARKET_SENTIMENT, CATEGORY_RADAR, EVENT_IMPACTS, PROBABILITY_DISTRIBUTION,
  CORRELATION_LINKS, CORRELATION_NODES, TIMELINE_EVENTS, ECONOMIC_METRICS,
  TOP_MOVERS, WATERFALL_DATA, VOLATILITY_DATA,
} from '@/data/analytics-data';
import ChartErrorBoundary from '@/components/ChartErrorBoundary';

/* ── animation variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ── Chart Section Wrapper ── */
const ChartSection = ({ title, subtitle, children, index = 0 }: { title: string; subtitle: string; children: React.ReactNode; index?: number }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    className="bg-card rounded-xl border border-border p-5 lg:p-6"
  >
    <div className="mb-4">
      <h3 className="font-display font-bold text-base lg:text-lg">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
    <ChartErrorBoundary fallbackTitle={`${title} failed to load`}>
      {children}
    </ChartErrorBoundary>
  </motion.div>
);

/* ── Sparkline component ── */
const Sparkline = ({ data, color, height = 24 }: { data: number[]; color: string; height?: number }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={w} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ── Impact Cell ── */
const ImpactCell = ({ value }: { value: number }) => {
  const abs = Math.abs(value);
  const bg =
    value > 30 ? 'bg-green-500/80' :
    value > 10 ? 'bg-green-500/40' :
    value > 0 ? 'bg-green-500/20' :
    value === 0 ? 'bg-muted/30' :
    value > -10 ? 'bg-red-500/20' :
    value > -30 ? 'bg-red-500/40' :
    'bg-red-500/80';
  const text = abs > 30 ? 'text-white' : 'text-foreground';
  return (
    <div className={`${bg} ${text} rounded px-2 py-1.5 text-xs font-semibold text-center min-w-[48px]`}>
      {value > 0 ? '+' : ''}{value}
    </div>
  );
};

const InsightsPage = () => {
  useSEO({
    title: 'India Market Insights & Analytics Dashboard',
    description: 'McKinsey-style analytics dashboard for Indian prediction markets. Real-time sentiment, sector analysis, event impact heatmaps, and market correlations.',
    keywords: 'India market analytics, prediction market insights, India VIX, sector analysis, market sentiment, RBI, Nifty analysis',
    canonical: '/insights',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'India Market Insights Dashboard',
      description: 'Comprehensive analytics dashboard for Indian prediction markets',
    },
  });

  const sentimentAngle = (MARKET_SENTIMENT.overall / 100) * 180;

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Insights' }]} dark />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white">India Market Insights</h1>
                <p className="text-xs text-white/60 mt-0.5">McKinsey-style analytics for India prediction markets</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-6 space-y-6">

        {/* ── 1. Market Sentiment Gauge ── */}
        <ChartSection title="Market Sentiment Gauge" subtitle="Overall India prediction market sentiment based on active events" index={0}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-28 flex-shrink-0">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                {/* Background arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" strokeLinecap="round" />
                {/* Colored arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${(sentimentAngle / 180) * 251.2} 251.2`}
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                {/* Needle */}
                <line
                  x1="100" y1="100"
                  x2={100 + 65 * Math.cos(Math.PI - (sentimentAngle / 180) * Math.PI)}
                  y2={100 - 65 * Math.sin(Math.PI - (sentimentAngle / 180) * Math.PI)}
                  stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
                {/* Labels */}
                <text x="15" y="108" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="600">Bearish</text>
                <text x="155" y="108" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="600">Bullish</text>
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <p className="text-2xl font-display font-extrabold">{MARKET_SENTIMENT.overall}</p>
                <p className="text-xs text-muted-foreground font-semibold">{MARKET_SENTIMENT.label}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-4">
                {[
                  { label: 'Bearish', value: MARKET_SENTIMENT.bearish, color: 'bg-red-500' },
                  { label: 'Neutral', value: MARKET_SENTIMENT.neutral, color: 'bg-yellow-500' },
                  { label: 'Bullish', value: MARKET_SENTIMENT.bullish, color: 'bg-green-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-xs text-muted-foreground">{s.label}: <strong className="text-foreground">{s.value}%</strong></span>
                  </div>
                ))}
              </div>
              <ul className="space-y-1 mt-3">
                {MARKET_SENTIMENT.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">→</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ChartSection>

        {/* ── Row: Radar + Probability ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. Category Radar */}
          <ChartSection title="Category Performance Radar" subtitle="Activity, volume, sentiment, and volatility by category" index={1}>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={CATEGORY_RADAR}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Activity" dataKey="activity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Volume" dataKey="volume" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Sentiment" dataKey="sentiment" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* 4. Probability Distribution */}
          <ChartSection title="Probability Distribution" subtitle="How prediction probabilities are distributed across events" index={2}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={PROBABILITY_DISTRIBUTION} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                  {PROBABILITY_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        {/* ── 3. Event Impact Heatmap ── */}
        <ChartSection title="Event Impact Heatmap" subtitle="How events impact key economic sectors (-100 to +100 scale)" index={3}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground w-32">Event</th>
                  <th className="text-center py-2 px-1 font-semibold text-muted-foreground">Markets</th>
                  <th className="text-center py-2 px-1 font-semibold text-muted-foreground">Currency</th>
                  <th className="text-center py-2 px-1 font-semibold text-muted-foreground">Inflation</th>
                  <th className="text-center py-2 px-1 font-semibold text-muted-foreground">Consumer</th>
                  <th className="text-center py-2 px-1 font-semibold text-muted-foreground">Employment</th>
                </tr>
              </thead>
              <tbody>
                {EVENT_IMPACTS.map((row, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-2 px-2 font-semibold text-foreground">{row.shortName}</td>
                    <td className="py-1.5 px-1"><ImpactCell value={row.markets} /></td>
                    <td className="py-1.5 px-1"><ImpactCell value={row.currency} /></td>
                    <td className="py-1.5 px-1"><ImpactCell value={row.inflation} /></td>
                    <td className="py-1.5 px-1"><ImpactCell value={row.consumer} /></td>
                    <td className="py-1.5 px-1"><ImpactCell value={row.employment} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/80" /> Strong Negative</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30" /> Mild Negative</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted/30" /> Neutral</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/30" /> Mild Positive</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/80" /> Strong Positive</span>
          </div>
        </ChartSection>

        {/* ── 5. Market Correlation Matrix ── */}
        <ChartSection title="Market Correlation Network" subtitle="Interconnections between Indian economic variables (click to explore)" index={4}>
          <div className="relative w-full overflow-x-auto">
            <svg viewBox="0 0 600 360" className="w-full h-auto min-w-[500px]">
              {/* Draw links */}
              {CORRELATION_LINKS.map((link, i) => {
                const si = CORRELATION_NODES.indexOf(link.source);
                const ti = CORRELATION_NODES.indexOf(link.target);
                const cx = 300, cy = 180, r = 140;
                const sAngle = (si / CORRELATION_NODES.length) * 2 * Math.PI - Math.PI / 2;
                const tAngle = (ti / CORRELATION_NODES.length) * 2 * Math.PI - Math.PI / 2;
                const sx = cx + r * Math.cos(sAngle);
                const sy = cy + r * Math.sin(sAngle);
                const tx = cx + r * Math.cos(tAngle);
                const ty = cy + r * Math.sin(tAngle);
                const color = link.strength > 0 ? '#22c55e' : '#ef4444';
                const opacity = Math.abs(link.strength) * 0.6;
                return (
                  <line key={i} x1={sx} y1={sy} x2={tx} y2={ty} stroke={color} strokeWidth={Math.abs(link.strength) * 3} opacity={opacity} />
                );
              })}
              {/* Draw nodes */}
              {CORRELATION_NODES.map((node, i) => {
                const cx = 300, cy = 180, r = 140;
                const angle = (i / CORRELATION_NODES.length) * 2 * Math.PI - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                const connections = CORRELATION_LINKS.filter(l => l.source === node || l.target === node).length;
                return (
                  <g key={node}>
                    <circle cx={x} cy={y} r={8 + connections * 1.5} fill="hsl(var(--primary))" opacity={0.8} />
                    <text
                      x={x + (Math.cos(angle) > 0 ? 18 : -18)}
                      y={y + 4}
                      textAnchor={Math.cos(angle) > 0 ? 'start' : 'end'}
                      fill="hsl(var(--foreground))"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-green-500 inline-block" /> Positive correlation</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-red-500 inline-block" /> Negative correlation</span>
            <span>Line thickness = correlation strength</span>
          </div>
        </ChartSection>

        {/* ── 7. Economic Health Scorecard ── */}
        <ChartSection title="India Economic Health Scorecard" subtitle="Key macroeconomic indicators with trend sparklines" index={5}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ECONOMIC_METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-muted/30 rounded-lg p-3 border border-border/50"
              >
                <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-display font-extrabold">{m.value}</p>
                  <Sparkline data={m.sparkline} color={m.change >= 0 ? '#22c55e' : '#ef4444'} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {m.change > 0 ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                  ) : m.change < 0 ? (
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={`text-[10px] font-semibold ${m.change > 0 ? 'text-green-500' : m.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {m.change > 0 ? '+' : ''}{m.change}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartSection>

        {/* ── Row: Top Movers + Waterfall ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 8. Top Movers */}
          <ChartSection title="Top Movers" subtitle="Events with biggest probability changes (past 7 days)" index={6}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={TOP_MOVERS} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={[-30, 30]} />
                <YAxis dataKey="event" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={120} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val > 0 ? '+' : ''}${val}pp`, 'Change']}
                />
                <ReferenceLine x={0} stroke="hsl(var(--border))" />
                <Bar dataKey="change" radius={[4, 4, 4, 4]}>
                  {TOP_MOVERS.map((entry, i) => (
                    <Cell key={i} fill={entry.direction === 'up' ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* 9. Sector Impact Waterfall */}
          <ChartSection title="Sector Impact Waterfall" subtitle="Cumulative impact of events on India economic index" index={7}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={WATERFALL_DATA} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={[0, 110]} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number, name: string) => {
                    if (name === 'cumulative') return [`${val}`, 'Net Level'];
                    return [`${val > 0 ? '+' : ''}${val}`, 'Impact'];
                  }}
                />
                <Bar dataKey="cumulative" name="cumulative" radius={[4, 4, 0, 0]}>
                  {WATERFALL_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        {/* ── 6. Trending Events Timeline ── */}
        <ChartSection title="Upcoming Events Timeline" subtitle="Key events on the horizon with importance ratings" index={8}>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {TIMELINE_EVENTS.map((item, i) => {
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
                    <div className="flex-1 bg-muted/30 rounded-lg p-3 border border-border/50">
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
        </ChartSection>

        {/* ── 10. Volatility Index ── */}
        <ChartSection title="India Prediction Market Volatility" subtitle="India VIX and prediction market volatility index over time" index={9}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={VOLATILITY_DATA}>
              <defs>
                <linearGradient id="vixGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="vix" name="India VIX" stroke="#ef4444" fill="url(#vixGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="marketVol" name="Market Volatility" stroke="#06b6d4" fill="url(#mktGrad)" strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 text-center"
        >
          <h3 className="font-display font-bold text-base mb-1">Ready to explore the markets?</h3>
          <p className="text-xs text-muted-foreground mb-4">Use these insights to make smarter predictions on live India markets</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/markets" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <BarChart3 className="w-4 h-4" /> Browse Markets
            </Link>
            <Link to="/blog" className="inline-flex items-center gap-1.5 bg-card border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
              Read Analysis <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default InsightsPage;
