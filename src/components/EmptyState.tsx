/**
 * Reusable empty state with contextual SVG illustration.
 * Used when filters yield no results, data is loading, or sections are empty.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-results' | 'no-analytics' | 'no-markets' | 'coming-soon';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/** Simple India-map outline with empty cards */
const NoResultsIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-28 h-24 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1">
    {/* Simplified India silhouette */}
    <path
      d="M55 8c4 0 8 2 12 6s6 6 6 12c2 4 4 8 2 14s-4 10-8 14c-2 4-6 10-8 14s-2 8-4 12c-2 2-4 4-6 4s-4-2-6-6c-2-4-4-10-4-14s0-8-2-12c-2-4-4-8-4-12s2-10 4-14c2-4 6-10 8-12s4-4 6-6z"
      strokeDasharray="3 3"
      opacity="0.5"
    />
    {/* Empty card outlines */}
    <rect x="70" y="20" width="35" height="20" rx="3" strokeDasharray="4 2" opacity="0.3" />
    <rect x="70" y="48" width="35" height="20" rx="3" strokeDasharray="4 2" opacity="0.2" />
    <rect x="70" y="76" width="35" height="14" rx="3" strokeDasharray="4 2" opacity="0.15" />
    {/* Question mark */}
    <text x="87" y="35" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" opacity="0.25" fontWeight="bold">?</text>
  </svg>
);

/** Grayed-out chart illustration */
const NoAnalyticsIllustration = () => (
  <svg viewBox="0 0 120 80" className="w-28 h-20 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.2">
    {/* Axes */}
    <line x1="15" y1="10" x2="15" y2="65" opacity="0.4" />
    <line x1="15" y1="65" x2="110" y2="65" opacity="0.4" />
    {/* Bars */}
    {[25, 40, 55, 70, 85, 100].map((x, i) => (
      <rect key={x} x={x - 5} y={30 + i * 3} width="10" height={35 - i * 3} rx="1.5" fill="currentColor" opacity={0.08 + i * 0.02} stroke="none" />
    ))}
    {/* Trend line */}
    <path d="M20 55 L35 45 L50 48 L65 38 L80 40 L95 30 L110 25" strokeDasharray="4 3" opacity="0.3" />
    {/* Arrow pointing right */}
    <path d="M55 75l5-3-5-3" opacity="0.3" fill="currentColor" stroke="none" />
  </svg>
);

const ILLUSTRATIONS: Record<string, React.FC> = {
  'no-results': NoResultsIllustration,
  'no-analytics': NoAnalyticsIllustration,
  'no-markets': NoResultsIllustration,
  'coming-soon': NoAnalyticsIllustration,
};

const DEFAULTS: Record<string, { title: string; description: string }> = {
  'no-results': {
    title: 'No markets match your filters',
    description: 'Try a different category — Cricket, Politics, or Economy have the most active markets.',
  },
  'no-analytics': {
    title: 'Analytics loading',
    description: 'Dashboards with sector scores, correlations, and trends are on the way.',
  },
  'no-markets': {
    title: 'No prediction markets here yet',
    description: 'New India-focused markets are added as events develop. Check back soon.',
  },
  'coming-soon': {
    title: 'Coming soon',
    description: 'This feature is under development. Stay tuned.',
  },
};

const EmptyState = ({
  type = 'no-results',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  const Illustration = ILLUSTRATIONS[type] ?? NoResultsIllustration;
  const defaults = DEFAULTS[type] ?? DEFAULTS['no-results'];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center col-span-full">
      <Illustration />
      <h3 className="font-display font-bold text-sm text-foreground mt-4">
        {title ?? defaults.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        {description ?? defaults.description}
      </p>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-3"
        >
          {actionLabel} <ArrowRight className="w-3 h-3" />
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-3"
        >
          {actionLabel} <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
