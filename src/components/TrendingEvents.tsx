import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRENDING_EVENTS, type EventCategory } from '@/data/trending-events';
import EventCard from './EventCard';
import CategoryFilter from './CategoryFilter';

interface TrendingEventsProps {
  limit?: number;
  showFilter?: boolean;
}

const TrendingEvents = ({ limit, showFilter = true }: TrendingEventsProps) => {
  const [category, setCategory] = useState<EventCategory | 'all'>('all');

  const filtered =
    category === 'all'
      ? TRENDING_EVENTS
      : TRENDING_EVENTS.filter((e) => e.category === category);

  const display = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section>
      {showFilter && (
        <div className="mb-5">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {display.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {display.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No events in this category.</p>
      )}
    </section>
  );
};

export default TrendingEvents;
