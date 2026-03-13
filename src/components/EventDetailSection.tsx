import { motion } from 'framer-motion';
import type { TrendingEvent } from '@/data/trending-events';

interface EventDetailSectionProps {
  event: TrendingEvent;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const EventDetailSection = ({ event }: EventDetailSectionProps) => (
  <div className="space-y-6">
    {/* Key Drivers */}
    {event.keyDrivers && event.keyDrivers.length > 0 && (
      <motion.div {...fadeUp} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Key Drivers</h3>
        <ul className="space-y-2">
          {event.keyDrivers.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span> {d}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    {/* Key Data Points */}
    {event.keyDataPoints && event.keyDataPoints.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Key Data Points</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {event.keyDataPoints.map((dp, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">{dp.label}</p>
              <p className="text-sm font-bold font-display mt-1">{dp.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Key Battles (elections) */}
    {event.keyBattles && event.keyBattles.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Key Battles</h3>
        <div className="space-y-3">
          {event.keyBattles.map((b, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-bold text-primary">{b.state}</p>
              <p className="text-sm text-muted-foreground mt-1">{b.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Key Details */}
    {event.keyDetails && event.keyDetails.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Key Details</h3>
        <ul className="space-y-2">
          {event.keyDetails.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-secondary mt-0.5">•</span> {d}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    {/* Key Trends */}
    {event.keyTrends && event.keyTrends.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Key Trends</h3>
        <ul className="space-y-2">
          {event.keyTrends.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-accent mt-0.5">•</span> {t}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    {/* Key Releases */}
    {event.keyReleases && event.keyReleases.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display font-bold text-sm mb-3">Upcoming Releases</h3>
        <ul className="space-y-2">
          {event.keyReleases.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-secondary mt-0.5">🎬</span> {r}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    {/* Impact on India */}
    {event.impactOnIndia && event.impactOnIndia.length > 0 && (
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-destructive/5 rounded-xl border border-destructive/10 p-5">
        <h3 className="font-display font-bold text-sm mb-3 text-destructive">Impact on India</h3>
        <ul className="space-y-2">
          {event.impactOnIndia.map((im, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-destructive mt-0.5">⚠</span> {im}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    {/* McKinsey Analysis */}
    <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-primary/5 rounded-xl border border-primary/10 p-5">
      <h3 className="font-display font-bold text-sm mb-3 text-primary">Analysis</h3>
      <ul className="space-y-2">
        {event.mckinseyAnalysis.map((a, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">→</span> {a}
          </li>
        ))}
      </ul>
      {event.impactProbability && (
        <p className="mt-3 text-xs font-medium text-primary">Impact: {event.impactProbability}</p>
      )}
    </motion.div>
  </div>
);

export default EventDetailSection;
