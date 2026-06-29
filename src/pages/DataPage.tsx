import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Copy, Check, ArrowRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { useIndiaMarkets } from '@/hooks/useMarkets';

const SITE = 'https://www.indiapredictions.com';
const FEED = `${SITE}/api/markets`;

const SAMPLE = `{
  "source": "India Predictions",
  "license": "Free to use with attribution to indiapredictions.com",
  "scope": "india",
  "count": 38,
  "markets": [
    {
      "id": "666818",
      "title": "U.S. agrees to a new trade deal with \\"India\\" before 2027?",
      "category": "politics",
      "probabilityYes": 27,
      "yesPrice": 0.27,
      "volume": 57034,
      "closesAt": "2026-12-31T00:00:00Z",
      "url": "https://www.indiapredictions.com/market/666818"
    }
  ]
}`;

const FIELDS: [string, string][] = [
  ['id', 'Stable market identifier'],
  ['title', 'The market question'],
  ['category', 'cricket · politics · economy · crypto · entertainment'],
  ['probabilityYes', 'Implied YES probability, 0–100'],
  ['yesPrice / noPrice', 'Implied probability as a 0–1 price'],
  ['volume', 'Trading volume (₹)'],
  ['closesAt', 'ISO resolution date'],
  ['url', 'Canonical page for the market'],
];

const DataPage = () => {
  const [copied, setCopied] = useState('');
  const { markets } = useIndiaMarkets();
  const liveCount = markets.filter((m) => new Date(m.closesAt).getTime() > Date.now()).length;

  useSEO({
    title: 'India Prediction Markets — Open Data & Free JSON API',
    description:
      'Free, public JSON feed of live India prediction-market odds (cricket, elections, RBI, crypto, Bollywood), aggregated from Polymarket and updated continuously. Cite or embed with attribution.',
    keywords:
      'india prediction market data, prediction market api, india odds json, election odds data india, cricket prediction data, open data prediction markets',
    canonical: '/data',
  });

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    }).catch(() => {});
  };

  return (
    <div className="pb-24 lg:pb-12">
      <div className="paytm-header px-4 lg:px-8 pt-12 lg:pt-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold text-white/80 mb-3">
            <Database className="w-3.5 h-3.5" /> Open data
          </div>
          <h1 className="font-display text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            India Prediction Markets — Open Data &amp; Free API
          </h1>
          <p className="text-sm lg:text-base text-white/70 mt-3 max-w-2xl leading-relaxed">
            A free, public JSON feed of live India prediction-market probabilities — cricket &amp; IPL,
            elections, RBI &amp; Nifty, crypto and Bollywood. Aggregated from Polymarket, scored for
            India relevance, and refreshed continuously. {liveCount > 0 && (
              <span className="text-white font-semibold">{liveCount} live India markets right now.</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-8 space-y-10">
        {/* Endpoint */}
        <section>
          <h2 className="font-display font-bold text-lg mb-2">The feed</h2>
          <p className="text-sm text-muted-foreground mb-3">
            One GET request, no key required. CORS-enabled, cached ~5 minutes.
          </p>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-3">
            <code className="text-sm font-mono text-primary break-all flex-1">GET {FEED}</code>
            <button
              onClick={() => copy(FEED, 'url')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:brightness-110 transition-all shrink-0"
            >
              {copied === 'url' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <a href={FEED} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Open the live feed <ArrowRight className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground"><code className="font-mono">?scope=all</code> for global markets · <code className="font-mono">?limit=N</code> (free max 100, Pro max 500)</span>
          </div>
        </section>

        {/* Plans */}
        <section>
          <h2 className="font-display font-bold text-lg mb-3">Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-bold">Free</p>
              <p className="text-2xl font-extrabold mt-1">₹0</p>
              <ul className="text-sm text-muted-foreground mt-3 space-y-1.5">
                <li>✓ Up to 100 live markets / call</li>
                <li>✓ India &amp; global scope</li>
                <li>✓ Updated continuously</li>
                <li className="text-muted-foreground/80">Attribution required · non-commercial</li>
              </ul>
            </div>
            <div className="bg-card border border-primary/40 ring-1 ring-primary/15 rounded-xl p-4">
              <p className="font-bold text-primary">Pro</p>
              <p className="text-sm text-muted-foreground mt-1">Contact for pricing</p>
              <ul className="text-sm text-muted-foreground mt-3 space-y-1.5">
                <li>✓ Up to 500 markets / call</li>
                <li>✓ Commercial-use license</li>
                <li>✓ Higher rate limits</li>
                <li className="text-muted-foreground/80">History &amp; webhooks (coming soon)</li>
              </ul>
              <a
                href="mailto:contact@indiapredictions.com?subject=India%20Predictions%20%E2%80%94%20Pro%20API%20access"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-3"
              >
                Request a Pro key →
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Pass your key as <code className="font-mono">?key=…</code> (recommended) or the <code className="font-mono">x-api-key</code> header.
          </p>
        </section>

        {/* Sample */}
        <section>
          <h2 className="font-display font-bold text-lg mb-3">Response shape</h2>
          <pre className="text-[11px] leading-relaxed bg-muted/60 border border-border rounded-lg p-4 overflow-x-auto text-muted-foreground">{SAMPLE}</pre>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4 font-semibold">Field</th>
                  <th className="py-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map(([f, d]) => (
                  <tr key={f} className="border-b border-border/60">
                    <td className="py-2 pr-4 font-mono text-xs text-primary whitespace-nowrap align-top">{f}</td>
                    <td className="py-2 text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Citation */}
        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-display font-bold text-lg mb-2">Using &amp; citing the data</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Free to use in articles, research and apps. Please credit the source with a link — it
            keeps the data open and free.
          </p>
          <p className="text-sm font-medium mb-1">Suggested citation:</p>
          <div className="flex items-start gap-2 bg-muted/60 border border-border rounded-lg p-3">
            <code className="text-xs font-mono flex-1">India Predictions — <a href={SITE} className="text-primary">indiapredictions.com</a></code>
            <button
              onClick={() => copy('India Predictions — https://www.indiapredictions.com', 'cite')}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              {copied === 'cite' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Prefer a live visual? Every market also has an{' '}
            <Link to="/markets" className="text-primary hover:underline">embeddable odds card</Link>{' '}
            you can drop into an article.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          No real money is involved — India Predictions is an informational tracker, not a betting
          platform. Probabilities are crowd-sourced market estimates, not guarantees.
        </p>
      </div>
    </div>
  );
};

export default DataPage;
