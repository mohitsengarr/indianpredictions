import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, ExternalLink } from 'lucide-react';
import { TRENDING_EVENTS } from '@/data/trending-events';
import EventDetailSection from '@/components/EventDetailSection';
import EventTimeline from '@/components/EventTimeline';
import { useSEO } from '@/hooks/useSEO';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const event = TRENDING_EVENTS.find((e) => e.slug === slug);

  useSEO({
    title: event ? event.title : 'Event Not Found',
    description: event ? event.summary : 'This event could not be found.',
    canonical: event ? `/events/${event.slug}` : undefined,
    schema: event
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: event.title,
          description: event.summary,
          dateModified: event.updatedAt,
        }
      : undefined,
  });

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">Event Not Found</h1>
          <p className="text-muted-foreground">This event doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const related = TRENDING_EVENTS.filter(
    (e) => e.category === event.category && e.id !== event.id
  ).slice(0, 4);

  const goBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/');
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                {event.categoryEmoji} {event.categoryLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  event.status === 'critical'
                    ? 'bg-destructive/20 text-red-200'
                    : event.status === 'active'
                    ? 'bg-success/20 text-green-200'
                    : event.status === 'upcoming'
                    ? 'bg-warning/20 text-yellow-200'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white leading-tight mb-3">
              {event.title}
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">{event.summary}</p>

            <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated {new Date(event.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="inline-flex items-center gap-1 hover:text-white transition-colors"
              >
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-6 space-y-8">
        {/* Prediction Market Angle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/10 border border-secondary/20 rounded-xl p-5"
        >
          <h3 className="font-display font-bold text-sm mb-1 text-secondary">Prediction Market Question</h3>
          <p className="text-base font-semibold">{event.predictionMarketAngle}</p>
          {event.impactProbability && (
            <p className="text-xs text-muted-foreground mt-2">Estimated impact: {event.impactProbability}</p>
          )}
          <Link
            to="/markets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-3"
          >
            Explore Markets <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Detail Sections */}
        <EventDetailSection event={event} />

        {/* Related Events */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="font-display font-bold text-sm mb-4">Related Events</h2>
            <EventTimeline events={related} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
