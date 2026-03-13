import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import type { TrendingEvent } from '@/data/trending-events';

interface EventComparisonWidgetProps {
  eventA: TrendingEvent;
  eventB: TrendingEvent;
}

const statusColors: Record<string, string> = {
  critical: 'text-destructive',
  active: 'text-success',
  upcoming: 'text-warning',
  completed: 'text-muted-foreground',
};

const EventComparisonWidget = ({ eventA, eventB }: EventComparisonWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-4 h-4 text-secondary" />
        <h3 className="font-display font-bold text-sm">Event Comparison</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[eventA, eventB].map((event, i) => (
          <div key={event.id} className={`space-y-3 ${i === 0 ? 'border-r border-border pr-4' : 'pl-4'}`}>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {event.categoryEmoji} {event.categoryLabel}
              </span>
              <h4 className="font-display font-bold text-sm mt-1.5 leading-snug line-clamp-2">{event.title}</h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Status</span>
                <span className={`text-xs font-semibold capitalize ${statusColors[event.status]}`}>
                  {event.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Impact</span>
                <span className="text-xs font-semibold">
                  {event.impactProbability || 'Moderate'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Analysis Points</span>
                <span className="text-xs font-semibold">{event.mckinseyAnalysis.length}</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground line-clamp-2">{event.predictionMarketAngle}</p>

            <Link
              to={`/events/${event.slug}`}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
            >
              View Details <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventComparisonWidget;
