import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dark?: boolean;
}

const Breadcrumbs = ({ items, dark = false }: BreadcrumbsProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://indianpredictions.lovable.app${item.href}` } : {}),
    })),
  };

  const textClass = dark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground';
  const activeClass = dark ? 'text-white/90' : 'text-foreground';
  const separatorClass = dark ? 'text-white/30' : 'text-muted-foreground/50';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-medium">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className={`w-3 h-3 ${separatorClass}`} />}
            {i === 0 && <Home className={`w-3 h-3 ${item.href ? textClass : activeClass}`} />}
            {item.href ? (
              <Link to={item.href} className={`transition-colors ${textClass}`}>
                {item.label}
              </Link>
            ) : (
              <span className={activeClass}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
