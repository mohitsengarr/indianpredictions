import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import MarketCard from '@/components/MarketCard';
import EventCard from '@/components/EventCard';
import { useIndiaMarkets } from '@/hooks/useMarkets';
import { useTrendingEvents } from '@/hooks/useTrendingEvents';
import { APP_CONFIG } from '@/lib/mock-data';
import { sortByTrending } from '@/lib/recommendations';
import { BLOG_POSTS } from '@/data/blog-posts';
import { getCategoryHub, type CategoryHubSlug } from '@/data/category-hubs';

const BASE_URL = 'https://www.indiapredictions.com';

interface CategoryHubPageProps {
  /** Optional explicit slug; otherwise read from the :hub route param. */
  slug?: CategoryHubSlug;
}

const CategoryHubPage = ({ slug: slugProp }: CategoryHubPageProps) => {
  const params = useParams<{ hub: string }>();
  const slug = slugProp ?? params.hub;
  const hub = getCategoryHub(slug);

  // Hooks must run unconditionally (before any early return).
  const { markets, loading: marketsLoading } = useIndiaMarkets();
  const { events } = useTrendingEvents();

  const hubMarkets = useMemo(() => {
    if (!hub) return [];
    const cats = new Set(hub.marketCategories);
    const filtered = markets.filter(
      (m) => cats.has(m.category) && APP_CONFIG.enabledCategories.includes(m.category)
    );
    return sortByTrending(filtered).slice(0, 12);
  }, [hub, markets]);

  const hubEvents = useMemo(() => {
    if (!hub) return [];
    const cats = new Set(hub.eventCategories);
    return events.filter((e) => cats.has(e.category)).slice(0, 4);
  }, [hub, events]);

  const relatedPosts = useMemo(() => {
    if (!hub) return [];
    return hub.relatedBlogSlugs
      .map((s) => BLOG_POSTS.find((p) => p.slug === s))
      .filter((p): p is (typeof BLOG_POSTS)[number] => Boolean(p));
  }, [hub]);

  // useSEO must also run unconditionally. When the slug is unknown we still
  // call it with a safe noindex fallback.
  useSEO(
    hub
      ? {
          title: hub.title,
          description: hub.metaDescription,
          keywords: hub.keywords,
          canonical: `/${hub.slug}`,
          schema: [
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: hub.h1,
              description: hub.metaDescription,
              url: `${BASE_URL}/${hub.slug}`,
              isPartOf: {
                '@type': 'WebSite',
                name: 'India Predictions',
                url: BASE_URL,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                { '@type': 'ListItem', position: 2, name: hub.h1, item: `${BASE_URL}/${hub.slug}` },
              ],
            },
          ],
        }
      : {
          title: 'Category not found',
          description: 'This category hub could not be found.',
          noindex: true,
        }
  );

  if (!hub) {
    return (
      <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-3">Category not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We couldn't find that category hub.
        </p>
        <Link to="/" className="text-primary hover:underline text-sm font-semibold">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8 max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: hub.h1 }]} />

      <h1 className="font-display text-2xl lg:text-3xl font-extrabold mt-3">{hub.h1}</h1>

      <p className="mt-4 text-base leading-relaxed text-foreground bg-muted/40 border border-border rounded-xl p-4 max-w-3xl">
        {hub.intro}
      </p>

      {/* Live markets */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">Live {hub.h1.split(' ')[0]} markets</h2>
          <Link
            to="/markets"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            All markets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {marketsLoading && hubMarkets.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse"
              >
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="h-12 bg-muted rounded-md mt-2" />
              </div>
            ))}
          </div>
        ) : hubMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {hubMarkets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {hub.h1.split(' ')[0].toLowerCase()} markets are open right now. Markets refresh
              every few minutes — meanwhile, browse{' '}
              <Link to="/markets" className="text-primary hover:underline">
                all live markets
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* Related events */}
      {hubEvents.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg mb-3">Related events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubEvents.map((e, i) => (
              <EventCard key={e.id} event={e} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Read more */}
      {relatedPosts.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg mb-3">Read more</h2>
          <ul className="space-y-2">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  {post.title} <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[11px] text-muted-foreground mt-10 max-w-3xl">
        Implied probabilities are crowd-sourced estimates aggregated from prediction markets.
        Informational only — not financial advice. No real-money trading.
      </p>
    </div>
  );
};

export default CategoryHubPage;
