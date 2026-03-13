import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Clock, CheckCircle2, Radio } from 'lucide-react';
import type { TrendingEvent } from '@/data/trending-events';

interface EventCardProps {
  event: TrendingEvent;
  index?: number;
}

const statusConfig: Record<string, { icon: typeof Radio; color: string; label: string }> = {
  critical: { icon: AlertTriangle, color: 'text-destructive', label: 'Critical' },
  active: { icon: Radio, color: 'text-success', label: 'Active' },
  upcoming: { icon: Clock, color: 'text-warning', label: 'Upcoming' },
  completed: { icon: CheckCircle2, color: 'text-muted-foreground', label: 'Completed' },
};

const badgeConfig: Record<string, { label: string; className: string } | undefined> = {
  critical: { label: 'Breaking', className: 'bg-destructive text-white animate-pulse' },
  active: { label: 'Hot', className: 'bg-warning text-warning-foreground' },
  upcoming: { label: 'Trending', className: 'bg-secondary text-white' },
};

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const st = statusConfig[event.status] ?? statusConfig.active;
  const StatusIcon = st.icon;
  const badge = badgeConfig[event.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="paytm-card p-5 flex flex-col gap-3 relative"
    >
      {/* Trending/Hot/Breaking Badge */}
      {badge && (
        <div className={`absolute -top-2 -right-1 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${badge.className}`}>
          {badge.label}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {event.categoryEmoji} {event.categoryLabel}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${st.color}`}>
          <StatusIcon className="w-3 h-3" />
          {st.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base leading-snug line-clamp-2">{event.title}</h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{event.summary}</p>

      {/* McKinsey highlights */}
      {event.mckinseyAnalysis.length > 0 && (
        <div className="border-l-2 border-secondary/40 pl-3 space-y-1">
          {event.mckinseyAnalysis.slice(0, 2).map((point, i) => (
            <p key={i} className="text-xs text-muted-foreground leading-relaxed">
              {point}
            </p>
          ))}
        </div>
      )}

      {/* Prediction market angle */}
      <div className="mt-auto pt-2 border-t border-border">
        <p className="text-xs font-medium text-secondary mb-2">{event.predictionMarketAngle}</p>
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Read More <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
