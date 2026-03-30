import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const DisclaimerPage = () => {
  useSEO({
    title: 'Risk Disclaimer – India Predictions',
    description: 'Risk disclaimer and important notices for India Predictions users.',
    canonical: '/disclaimer',
  });

  return (
    <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-display font-bold mb-2">Risk Disclaimer</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 31, 2026</p>

      <div className="prose prose-sm prose-gray dark:prose-invert space-y-6">
        <section className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-destructive">Important Notice</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            India Predictions is a prediction market data aggregator for informational and educational purposes only. This platform does NOT facilitate real-money trading, betting, or gambling of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">1. No Financial Advice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The information displayed on India Predictions, including prediction market probabilities, analytics, and commentary, does not constitute financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the platform's content as such.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Data Accuracy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Prediction market data is sourced from third-party platforms and may be delayed, incomplete, or inaccurate. Probabilities reflect crowd sentiment, not guaranteed outcomes. Past prediction accuracy does not guarantee future results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Regulatory Status</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India's regulatory framework for prediction markets is evolving. India Predictions does not operate as a prediction market exchange, broker, or financial intermediary. We only aggregate and display publicly available data. Users are responsible for understanding and complying with applicable laws in their jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. No Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India Predictions shall not be held liable for any losses, damages, or costs arising from reliance on information provided on the platform, or from any decisions made based on such information. Use the platform at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Third-Party Links</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The platform may contain links to third-party websites including Polymarket. We do not endorse or take responsibility for the content, policies, or practices of any third-party websites.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex gap-4 text-sm">
        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default DisclaimerPage;
