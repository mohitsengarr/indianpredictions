import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Share2, ExternalLink, TrendingUp, TrendingDown,
  AlertTriangle, Shield, Globe, Zap, BarChart3, Users, Building2, Gauge,
  Clock, Target, Lightbulb, History,
} from 'lucide-react';
import { TRENDING_EVENTS } from '@/data/trending-events';
import EventDetailSection from '@/components/EventDetailSection';
import EventTimeline from '@/components/EventTimeline';
import EventComparisonWidget from '@/components/EventComparisonWidget';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useSEO } from '@/hooks/useSEO';

const DRIVER_ICONS: Record<string, typeof Zap> = {
  'market': TrendingUp, 'oil': Gauge, 'geopolitics': Globe, 'policy': Shield,
  'inflation': BarChart3, 'employment': Users, 'trade': Building2, 'default': Zap,
};

const getDriverIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('oil') || lower.includes('crude') || lower.includes('energy')) return DRIVER_ICONS.oil;
  if (lower.includes('market') || lower.includes('nifty') || lower.includes('sensex')) return DRIVER_ICONS.market;
  if (lower.includes('geopolit') || lower.includes('war') || lower.includes('crisis')) return DRIVER_ICONS.geopolitics;
  if (lower.includes('policy') || lower.includes('rbi') || lower.includes('regulation')) return DRIVER_ICONS.policy;
  if (lower.includes('inflation') || lower.includes('cpi')) return DRIVER_ICONS.inflation;
  if (lower.includes('employ') || lower.includes('job') || lower.includes('labour')) return DRIVER_ICONS.employment;
  if (lower.includes('trade') || lower.includes('export') || lower.includes('import')) return DRIVER_ICONS.trade;
  return DRIVER_ICONS.default;
};

const IMPACT_CATEGORIES = [
  { key: 'markets', label: 'Stock Markets', icon: TrendingUp },
  { key: 'currency', label: 'Currency (INR)', icon: Building2 },
  { key: 'inflation', label: 'Inflation', icon: BarChart3 },
  { key: 'consumer', label: 'Consumer', icon: Users },
];

const getImpactLevel = (status: string): Record<string, { score: number; label: string }> => {
  if (status === 'critical') {
    return {
      markets: { score: -85, label: 'Severe Negative' },
      currency: { score: -60, label: 'High Negative' },
      inflation: { score: 40, label: 'Moderate Upward' },
      consumer: { score: -45, label: 'High Negative' },
    };
  }
  if (status === 'active') {
    return {
      markets: { score: 25, label: 'Moderate Positive' },
      currency: { score: 10, label: 'Slight Positive' },
      inflation: { score: -10, label: 'Slight Downward' },
      consumer: { score: 30, label: 'Moderate Positive' },
    };
  }
  return {
    markets: { score: 15, label: 'Slight Positive' },
    currency: { score: 5, label: 'Neutral' },
    inflation: { score: 0, label: 'Neutral' },
    consumer: { score: 10, label: 'Slight Positive' },
  };
};

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const event = TRENDING_EVENTS.find((e) => e.slug === slug);

  useSEO({
    title: event ? event.title : 'Event Not Found',
    description: event ? event.summary : 'This event could not be found.',
    canonical: event ? `/events/${event.slug}` : undefined,
    schema: event
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: event.title,
          description: event.summary,
          dateModified: event.updatedAt,
          datePublished: event.updatedAt,
          author: { '@type': 'Organization', name: 'India Predictions' },
          publisher: {
            '@type': 'Organization',
            name: 'India Predictions',
            url: 'https://indianpredictions.lovable.app',
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://indianpredictions.lovable.app/events/${event.slug}`,
          },
        }
      : undefined,
  });

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">Event Not Found</h1>
          <p className="text-muted-foreground">This event doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const related = TRENDING_EVENTS.filter(
    (e) => e.category === event.category && e.id !== event.id
  ).slice(0, 4);

  const comparisonEvent = TRENDING_EVENTS.find(
    (e) => e.id !== event.id && e.category !== event.category && (e.status === 'critical' || e.status === 'active')
  );

  const goBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/');
  };

  const impacts = getImpactLevel(event.status);
  const drivers = event.keyDrivers || event.mckinseyAnalysis.slice(0, 5);

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3">
              <Breadcrumbs
                dark
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Events', href: '/' },
                  { label: event.categoryLabel, href: '/' },
                  { label: event.title },
                ]}
              />
            </div>
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                {event.categoryEmoji} {event.categoryLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  event.status === 'critical'
                    ? 'bg-destructive/20 text-red-200'
                    : event.status === 'active'
                    ? 'bg-success/20 text-green-200'
                    : event.status === 'upcoming'
                    ? 'bg-warning/20 text-yellow-200'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white leading-tight mb-3">
              {event.title}
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">{event.summary}</p>

            <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated {new Date(event.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="inline-flex items-center gap-1 hover:text-white transition-colors"
              >
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-6 space-y-8">
        {/* Prediction Market Angle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/10 border border-secondary/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-secondary" />
            <h3 className="font-display font-bold text-sm text-secondary">Prediction Market Question</h3>
          </div>
          <p className="text-base font-semibold">{event.predictionMarketAngle}</p>
          {event.impactProbability && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: event.impactProbability }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-secondary rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-secondary">{event.impactProbability}</span>
            </div>
          )}
          <Link
            to="/markets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-3"
          >
            Explore Markets <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Key Drivers */}
        {drivers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-bold text-base">Key Drivers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {drivers.map((driver, i) => {
                const Icon = getDriverIcon(driver);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card rounded-xl border border-border p-4 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{driver}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Impact Assessment Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Impact Assessment</h2>
              <p className="text-[11px] text-muted-foreground">Estimated impact across economic dimensions</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {IMPACT_CATEGORIES.map((cat) => {
              const impact = impacts[cat.key];
              const Icon = cat.icon;
              const isNeg = impact.score < 0;
              return (
                <div key={cat.key} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isNeg ? (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    ) : impact.score > 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <span className="w-4 h-4 text-muted-foreground text-center">—</span>
                    )}
                    <span className={`text-sm font-bold ${isNeg ? 'text-destructive' : impact.score > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                      {impact.label}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(Math.abs(impact.score), 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${isNeg ? 'bg-destructive/60' : impact.score > 0 ? 'bg-success/60' : 'bg-muted-foreground/30'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Detail Sections */}
        <EventDetailSection event={event} />

        {/* Expert Analysis Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl border border-border p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Expert Analysis</h2>
              <p className="text-[11px] text-muted-foreground">Insights from market analysts and domain experts</p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground italic">
              "This event has significant implications for Indian markets. The prediction market pricing reflects the consensus view, but there's meaningful uncertainty around the key drivers listed above."
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-semibold">— India Predictions Research Team</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Expert analysis is updated regularly. Check back for detailed commentary from economists, market strategists, and domain specialists.
          </p>
        </motion.div>

        {/* Historical Context Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <History className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Historical Context</h2>
              <p className="text-[11px] text-muted-foreground">How similar events have played out in the past</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="space-y-4">
              {[
                { date: 'Mar 2026', desc: `Current: ${event.title}`, active: true },
                { date: 'Jan 2026', desc: 'Market correction begins as global uncertainties mount', active: false },
                { date: 'Oct 2025', desc: 'Early warning signs emerge in prediction market pricing', active: false },
                { date: 'Jul 2025', desc: 'Similar patterns observed in adjacent markets', active: false },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    {i < 3 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className={`text-xs font-semibold ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>{item.date}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Event Comparison Widget */}
        {comparisonEvent && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EventComparisonWidget eventA={event} eventB={comparisonEvent} />
          </motion.div>
        )}

        {/* Related Events */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="font-display font-bold text-sm mb-4">Related Events</h2>
            <EventTimeline events={related} />
          </motion.div>
        )}

        {/* Internal Links CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-5"
        >
          <h3 className="font-display font-bold text-sm mb-2">Explore More</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/insights" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 rounded-full px-3 py-1.5">
              <BarChart3 className="w-3 h-3" /> Analytics Dashboard
            </Link>
            <Link to="/markets" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 rounded-full px-3 py-1.5">
              <TrendingUp className="w-3 h-3" /> Prediction Markets
            </Link>
            <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 rounded-full px-3 py-1.5">
              <Clock className="w-3 h-3" /> Latest Analysis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailPage;
