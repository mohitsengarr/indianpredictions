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

// Generate a stable pseudo-probability from the event title
const getProbability = (event: TrendingEvent): number => {
  let hash = 0;
  const str = event.title + event.id;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash % 60) + 20; // 20-80 range
  if (event.status === 'critical') return Math.min(base + 15, 92);
  if (event.status === 'completed') return base > 50 ? 85 : 15;
  return base;
};

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const st = statusConfig[event.status] ?? statusConfig.active;
  const StatusIcon = st.icon;
  const badge = badgeConfig[event.status];
  const yesPercent = getProbability(event);
  const noPercent = 100 - yesPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="paytm-card flex flex-col relative overflow-hidden"
    >
      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative w-full h-36 overflow-hidden bg-muted">
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3">
      {/* Trending/Hot/Breaking Badge */}
      {badge && (
        <div className={`absolute ${event.imageUrl ? 'top-2 right-2' : '-top-2 -right-1'} z-10 text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${badge.className}`}>
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
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{event.summary}</p>

      {/* Probability bar */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">{event.predictionMarketAngle}</p>
        <div className="flex h-7 rounded-full overflow-hidden text-[11px] font-bold">
          <div
            className="bg-success/80 text-white flex items-center justify-center transition-all"
            style={{ width: `${yesPercent}%` }}
          >
            {yesPercent >= 25 && `YES ${yesPercent}%`}
          </div>
          <div
            className="bg-destructive/60 text-white flex items-center justify-center transition-all"
            style={{ width: `${noPercent}%` }}
          >
            {noPercent >= 25 && `NO ${noPercent}%`}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2 border-t border-border flex items-center justify-between">
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Crowd sentiment</span>
          {event.updatedAt && <span>Updated {new Date(event.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
        </div>
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
