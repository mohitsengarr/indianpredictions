import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  useSEO({
    title: 'Privacy Policy – India Predictions',
    description: 'How India Predictions handles your data and privacy.',
    canonical: '/privacy',
  });

  return (
    <div className="pb-24 lg:pb-8 max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-display font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 31, 2026</p>

      <div className="prose prose-sm prose-gray dark:prose-invert space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect minimal information: email addresses (if you subscribe to our newsletter), and standard analytics data (page views, device type, browser). We do not collect financial information as no real transactions occur on this platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. How We Use Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Email addresses are used solely to send newsletter updates about prediction market trends. Analytics data is used to improve the platform experience. We do not sell or share personal data with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Cookies & Analytics</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use essential cookies for site functionality and may use analytics tools to understand usage patterns. You can disable cookies in your browser settings, though some features may not work as intended.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Third-Party Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We integrate with third-party services including Polymarket (market data), Supabase (data infrastructure), and Binance (crypto prices). Each service has its own privacy policy governing data they collect.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Data Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We implement reasonable security measures to protect information. However, no internet transmission is completely secure, and we cannot guarantee absolute security of data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Your Rights</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may request deletion of your email from our newsletter list at any time by unsubscribing or contacting us. Under applicable Indian data protection laws, you have the right to access, correct, and delete personal data we hold.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Changes to This Policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update this privacy policy periodically. Changes will be posted on this page with an updated "Last updated" date.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex gap-4 text-sm">
        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
        <Link to="/disclaimer" className="text-primary hover:underline">Risk Disclaimer</Link>
      </div>
    </div>
  );
};

export default PrivacyPage;
