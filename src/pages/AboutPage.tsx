import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';

const AboutPage = () => {
  useSEO({
    title: 'About India Predictions',
    description:
      'India Predictions is a prediction-market data tracker for India. We aggregate live odds from Polymarket, score them for India relevance, and surface crowd-sourced probabilities for cricket, elections, the RBI and economy, energy, crypto and Bollywood. Not a trading platform.',
    canonical: '/about',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'India Predictions',
      url: 'https://www.indiapredictions.com',
      description:
        'India Predictions is an informational prediction-market data tracker for India. It aggregates live odds from Polymarket, scores them for India relevance, and presents crowd-sourced probabilities. No real-money trading.',
      knowsAbout: [
        'prediction markets',
        'India elections',
        'IPL cricket',
        'RBI monetary policy',
        'Indian economy',
      ],
      // TODO: add official social profile URLs here once those accounts exist
      // (e.g. X/Twitter, LinkedIn). Leave empty until then to avoid pointing at
      // unverified or non-existent profiles.
      sameAs: [],
    },
  });

  return (
    <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </div>

      <h1 className="text-2xl font-display font-bold mb-2">About India Predictions</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Live, India-relevant prediction-market probabilities — aggregated, scored and explained.
      </p>

      <div className="prose prose-sm prose-gray dark:prose-invert space-y-6">
        <section>
          <h2 className="text-lg font-semibold">What is India Predictions?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India Predictions is a prediction-market data tracker built for India. We monitor live
            prediction-market odds, filter them for relevance to India, and present the resulting
            crowd-sourced probabilities for cricket and the IPL, elections, the RBI and the broader
            economy, energy and oil, crypto, and Bollywood. It is an informational and analytical
            product — a way to read, at a glance, what markets currently imply about events that
            matter to Indian investors, policy watchers and cricket fans. It is not a trading
            platform: there is no real-money trading and no INR transactions of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">How it works — our methodology</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We aggregate prediction-market odds from Polymarket and run each market through an
            India-relevance scoring step. That step looks for India-specific signals — Indian teams
            and players, Indian elections and policy, the Reserve Bank of India and Indian
            macroeconomic indicators, India-linked energy and oil markets, crypto adoption relevant
            to Indian users, and Bollywood — so that only the markets that genuinely concern India
            surface in our dashboards. Market prices are converted into implied probabilities and
            displayed alongside category, movement and context. Market data refreshes approximately
            every 5 minutes so the probabilities you see stay close to live.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Our data sources</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our primary source of odds and probabilities is{' '}
            <span className="font-medium">Polymarket</span>, one of the largest prediction-market
            platforms in the world. To add context around moving markets, we pull breaking-news and
            event background using <span className="font-medium">Exa</span>, refreshed roughly every
            6 hours. We do not generate odds ourselves; the probabilities reflect aggregated market
            activity on the underlying source. We aim for accuracy but cannot guarantee the
            completeness or timeliness of third-party data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">What this is NOT</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Not a real-money trading platform.</span> You cannot buy
              or sell positions here, and there are no INR deposits, withdrawals or wagers.
            </li>
            <li>
              <span className="font-medium">Not gambling or betting.</span> We display third-party
              market data for information; we do not accept stakes or pay out winnings.
            </li>
            <li>
              <span className="font-medium">Not financial or investment advice.</span> Probabilities
              are crowd-sourced estimates, not recommendations. Consult a qualified professional
              before making any financial decision.
            </li>
            <li>
              <span className="font-medium">Not SEBI-regulated.</span> India Predictions is an
              informational product and is not a regulated financial entity or exchange.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Update cadence</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Market odds refresh approximately every 5 minutes. Breaking-news and event context
            refreshes approximately every 6 hours. Because the underlying markets move continuously,
            probabilities can change between refreshes and should be treated as a snapshot rather
            than a guarantee.
          </p>
        </section>

        <section>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India Predictions exists to make prediction-market intelligence about India clear,
            accessible and honest. Explore the{' '}
            <Link to="/markets" className="text-primary hover:underline">
              live markets
            </Link>
            , dig into the{' '}
            <Link to="/insights" className="text-primary hover:underline">
              insights dashboards
            </Link>
            , or learn the fundamentals on the{' '}
            <Link to="/blog" className="text-primary hover:underline">
              blog
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex gap-4 text-sm">
        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
        <Link to="/disclaimer" className="text-primary hover:underline">Risk Disclaimer</Link>
        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default AboutPage;
