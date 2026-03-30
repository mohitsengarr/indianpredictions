import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  useSEO({
    title: 'Terms of Service – India Predictions',
    description: 'Terms of use for the India Predictions platform.',
    canonical: '/terms',
  });

  return (
    <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-display font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 31, 2026</p>

      <div className="prose prose-sm prose-gray dark:prose-invert space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Platform Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India Predictions is a prediction market tracker and aggregator. The platform displays prediction market data sourced from third-party platforms including Polymarket. India Predictions does not operate a prediction market exchange and does not facilitate any form of real-money trading.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. No Real Money</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All data displayed on this platform is for informational and educational purposes only. Any simulated features use virtual points with no real-world value. No real currency, cryptocurrency, or financial instruments are involved.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Not Financial Advice</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Content on this platform is for informational and educational purposes only. Nothing on India Predictions constitutes financial, investment, legal, or tax advice. Users should consult qualified professionals before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Data Sources</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Market data is aggregated from third-party sources including Polymarket and other prediction market platforms. India Predictions does not guarantee the accuracy, completeness, or timeliness of any data displayed. Data is refreshed automatically at regular intervals.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. User Conduct</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Users agree not to misuse the platform, attempt to manipulate displayed data, scrape content without permission, or use the platform for any illegal purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Intellectual Property</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All original content, design, and branding on India Predictions is owned by or licensed to the platform. Third-party data remains the property of its respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            India Predictions is provided "as is" without warranties of any kind. We are not liable for any losses or damages arising from use of the platform or reliance on any data displayed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Governing Law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For questions about these terms, reach out via our social channels or email.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex gap-4 text-sm">
        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        <Link to="/disclaimer" className="text-primary hover:underline">Risk Disclaimer</Link>
      </div>
    </div>
  );
};

export default TermsPage;
