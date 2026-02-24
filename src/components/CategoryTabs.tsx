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
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:text-foreground'
        }`}
      >
        🔥 All
      </button>
      {categories.map((cat) => {
        const info = CATEGORY_LABELS[cat];
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
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
