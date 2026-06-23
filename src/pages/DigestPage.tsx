import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Newspaper } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { trackDigestView } from '@/lib/analytics';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CategoryIcon } from '@/components/icons/CategoryIcons';
import digest from '@/data/digest.json';

/**
 * Weekly India Prediction Market Digest — an answer-first, prerendered page
 * built from the latest scrape (scripts/generate-digest.mjs). Structured for
 * answer engines: a crisp summary up top, a probability table, and Dataset +
 * Article + Speakable JSON-LD so it can be cited.
 */
const DigestPage = () => {
  const weekLabel = new Date(digest.weekOf).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => { trackDigestView(digest.weekOf); }, []);

  useSEO({
    title: `India Prediction Market Digest — Week of ${weekLabel}`,
    description: digest.summary.slice(0, 155),
    canonical: '/digest',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `India Prediction Market Digest — Week of ${weekLabel}`,
        description: digest.summary,
        datePublished: digest.generatedAt,
        dateModified: digest.generatedAt,
        author: { '@type': 'Organization', name: 'India Predictions', url: 'https://www.indiapredictions.com' },
        publisher: { '@type': 'Organization', name: 'India Predictions', url: 'https://www.indiapredictions.com' },
        mainEntityOfPage: 'https://www.indiapredictions.com/digest',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: `India Prediction Market Probabilities — Week of ${weekLabel}`,
        description: 'Crowd-sourced implied probabilities for the most-watched India prediction-market questions, aggregated from prediction markets.',
        creator: { '@type': 'Organization', name: 'India Predictions' },
        dateModified: digest.generatedAt,
        isAccessibleForFree: true,
        variableMeasured: digest.items.map((i) => ({
          '@type': 'PropertyValue', name: i.title, value: `${i.probability}%`,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#digest-summary'] },
        url: 'https://www.indiapredictions.com/digest',
      },
    ],
  });

  return (
    <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Weekly Digest' }]} />

      <h1 className="font-display text-2xl lg:text-3xl font-extrabold mt-3">
        India Prediction Market Digest
      </h1>
      <p className="text-sm text-muted-foreground mt-1">Week of {weekLabel} · updated continuously</p>

      {/* Answer-first summary (speakable) */}
      <p id="digest-summary" className="mt-5 text-base leading-relaxed text-foreground bg-muted/40 border border-border rounded-xl p-4">
        {digest.summary}
      </p>

      {/* Probability table */}
      <h2 className="font-display font-bold text-lg mt-8 mb-3">This week's most-watched questions</h2>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Question</th>
              <th className="px-3 py-2 font-semibold text-right">Implied&nbsp;%</th>
            </tr>
          </thead>
          <tbody>
            {digest.items.map((item) => (
              <tr key={item.slug} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <Link to={`/events/${item.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors leading-snug block">
                    {item.title}
                  </Link>
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                    <CategoryIcon category={item.category} size={12} className="text-muted-foreground opacity-70" />
                    {item.categoryLabel}
                  </span>
                  {item.angle && <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.angle}</p>}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="inline-flex items-center gap-1 font-bold tabular-nums text-success">
                    <TrendingUp className="w-3 h-3" />{item.probability}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        Implied probabilities are crowd-sourced estimates aggregated from prediction markets. Informational only — not financial advice. No real-money trading.
      </p>

      {/* Top news */}
      {digest.topNews.length > 0 && (
        <>
          <h2 className="font-display font-bold text-lg mt-8 mb-3 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-destructive" /> Context: this week's India headlines
          </h2>
          <ul className="space-y-2">
            {digest.topNews.map((n, i) => (
              <li key={i} className="text-sm">
                <a href={n.source} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                  {n.title}
                </a>
                <span className="text-[11px] text-muted-foreground ml-1">· {n.category}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/markets" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          Browse all live markets <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/insights" className="inline-flex items-center gap-1.5 border border-border px-5 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
          Open analytics
        </Link>
      </div>
    </div>
  );
};

export default DigestPage;
