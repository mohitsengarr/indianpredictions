import { MarketCategory } from '@/lib/types';
import { CATEGORY_LABELS, APP_CONFIG } from '@/lib/mock-data';

interface CategoryTabsProps {
  selected: MarketCategory | 'all';
  onSelect: (cat: MarketCategory | 'all') => void;
}

const CategoryTabs = ({ selected, onSelect }: CategoryTabsProps) => {
  const categories = APP_CONFIG.enabledCategories;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onSelect('all')}
        className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
          selected === 'all'
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
        }`}
      >
        🔥 All
      </button>
      {categories.map((cat) => {
        const info = CATEGORY_LABELS[cat];
        const active = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
              active
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            {info.emoji} {info.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
