/**
 * Consistent SVG category icons replacing emojis.
 * All share: 24x24 viewBox, 1.5px stroke, rounded joins, brand color tokens.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/** Cricket bat & ball */
export const CricketIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="17" cy="7" r="2.5" />
    <path d="M5.5 20.5l8-8M4.5 19.5l1 1" />
    <path d="M8.5 15.5l-4 4" strokeWidth={2.5} />
    <path d="M13 12L9 16" />
    <path d="M10 7l4 4" />
  </svg>
);

/** Candlestick chart + rupee */
export const MarketsIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <path d="M4 20V10m0 0l2-3 3 4 3-6 4 5 4-4" />
    <line x1="4" y1="20" x2="20" y2="20" />
    <path d="M14 4v3m0 6v3m-2-10h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V8a1 1 0 011-1z" />
  </svg>
);

/** Parliament dome / ballot */
export const PoliticsIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <path d="M3 21h18M5 21V11M19 21V11" />
    <path d="M5 11l7-7 7 7" />
    <rect x="9" y="14" width="6" height="7" rx="0.5" />
    <line x1="12" y1="14" x2="12" y2="21" />
    <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Oil barrel + flame */
export const EnergyIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <rect x="5" y="8" width="10" height="12" rx="1.5" />
    <ellipse cx="10" cy="8" rx="5" ry="1.5" />
    <ellipse cx="10" cy="20" rx="5" ry="1.5" />
    <line x1="5" y1="13" x2="15" y2="13" />
    <path d="M18 2c0 2-1.5 3-1.5 4.5S18 9 18 9s1.5-1 1.5-2.5S18 2 18 2z" fill="currentColor" opacity="0.3" />
  </svg>
);

/** Film reel / clapperboard */
export const EntertainmentIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 8l3-5h12l3 5" />
    <line x1="7" y1="3" x2="5.5" y2="8" />
    <line x1="12" y1="3" x2="10.5" y2="8" />
    <line x1="17" y1="3" x2="15.5" y2="8" />
    <circle cx="8" cy="15" r="2" />
    <circle cx="16" cy="15" r="2" />
  </svg>
);

/** Globe with network nodes */
export const GeopoliticsIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M4.5 7h15M4.5 17h15" />
  </svg>
);

/** Bitcoin / crypto coin */
export const CryptoIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 8h3.5a2 2 0 010 4H9.5m0-4v8m0-4h4a2 2 0 010 4H9.5" />
    <line x1="11" y1="6" x2="11" y2="8" />
    <line x1="13" y1="6" x2="13" y2="8" />
    <line x1="11" y1="16" x2="11" y2="18" />
    <line x1="13" y1="16" x2="13" y2="18" />
  </svg>
);

/** Scales of justice */
export const RegulationIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <line x1="12" y1="3" x2="12" y2="19" />
    <path d="M5 7l7-4 7 4" />
    <path d="M5 7l-2 8h4L5 7zM19 7l-2 8h4L19 7z" />
    <line x1="8" y1="19" x2="16" y2="19" />
  </svg>
);

/** Chip / circuit board */
export const TechnologyIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <line x1="6" y1="10" x2="3" y2="10" />
    <line x1="6" y1="14" x2="3" y2="14" />
    <line x1="18" y1="10" x2="21" y2="10" />
    <line x1="18" y1="14" x2="21" y2="14" />
    <line x1="10" y1="6" x2="10" y2="3" />
    <line x1="14" y1="6" x2="14" y2="3" />
    <line x1="10" y1="18" x2="10" y2="21" />
    <line x1="14" y1="18" x2="14" y2="21" />
  </svg>
);

/** Generic sports / ball */
export const SportsIcon = ({ size, ...props }: IconProps) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3c2 3 2 6 0 9s-2 6 0 9" />
    <path d="M12 3c-2 3-2 6 0 9s2 6 0 9" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

/** India flag badge (replaces flag emoji) */
export const IndiaFlagIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <rect x="3" y="5" width="18" height="4.67" fill="#FF9933" rx="2" />
    <rect x="3" y="9.67" width="18" height="4.66" fill="#FFFFFF" />
    <rect x="3" y="14.33" width="18" height="4.67" fill="#138808" rx="2" />
    <circle cx="12" cy="12" r="1.8" stroke="#000088" strokeWidth="0.5" fill="none" />
  </svg>
);

/** Map of known category keys to their icon component */
export const CATEGORY_ICON_MAP: Record<string, React.FC<IconProps>> = {
  cricket: CricketIcon,
  sports: SportsIcon,
  politics: PoliticsIcon,
  economy: MarketsIcon,
  markets: MarketsIcon,
  energy: EnergyIcon,
  entertainment: EntertainmentIcon,
  geopolitics: GeopoliticsIcon,
  crypto: CryptoIcon,
  regulation: RegulationIcon,
  technology: TechnologyIcon,
};

/** Render the appropriate category icon, falling back to a generic circle */
export const CategoryIcon = ({ category, size = 18, className = '', ...props }: IconProps & { category: string }) => {
  const Icon = CATEGORY_ICON_MAP[category];
  if (!Icon) return <span className={className} style={{ width: size, height: size }} />;
  return <Icon size={size} className={className} {...props} />;
};
