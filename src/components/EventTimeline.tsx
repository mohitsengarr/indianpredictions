import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { TrendingEvent } from '@/data/trending-events';

interface EventTimelineProps {
  events: TrendingEvent[];
}

const statusDot: Record<string, string> = {
  critical: 'bg-destructive',
  active: 'bg-success',
  upcoming: 'bg-warning',
  completed: 'bg-muted-foreground',
};

const EventTimeline = ({ events }: EventTimelineProps) => (
  <div className="relative pl-6">
    {/* Vertical line */}
    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />

    <div className="space-y-4">
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="relative"
        >
          {/* Dot */}
          <div
            className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-background ${statusDot[event.status] ?? 'bg-muted-foreground'}`}
          />
          <Link to={`/events/${event.slug}`} className="block group">
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(event.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
              <div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
                  {event.categoryEmoji} {event.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.summary}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default EventTimeline;
