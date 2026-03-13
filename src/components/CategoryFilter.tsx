import { motion } from 'framer-motion';
import { EVENT_CATEGORIES, type EventCategory } from '@/data/trending-events';

interface CategoryFilterProps {
  selected: EventCategory | 'all';
  onChange: (category: EventCategory | 'all') => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
    {EVENT_CATEGORIES.map((cat) => (
      <motion.button
        key={cat.value}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(cat.value)}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === cat.value
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        }`}
      >
        <span>{cat.emoji}</span>
        <span>{cat.label}</span>
      </motion.button>
    ))}
  </div>
);

export default CategoryFilter;
