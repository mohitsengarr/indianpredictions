import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Markets', href: '/markets' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Crypto', href: '/crypto' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Cricket', href: '/cricket' },
      { label: 'Elections', href: '/elections' },
      { label: 'Economy', href: '/economy' },
      { label: 'Bollywood', href: '/bollywood' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Risk Disclaimer', href: '/disclaimer' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Data & API', href: '/data' },
      { label: 'Weekly Digest', href: '/digest' },
      { label: 'Blog', href: '/blog' },
      { label: 'How It Works', href: '/blog/what-are-prediction-markets-guide-india' },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-border bg-muted/30 mt-8">
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div>
        <p className="font-display font-bold text-base mb-2">
          India<span className="text-secondary">Predictions</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tracking India's prediction markets. Live odds on politics, cricket, economy and more.
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-3">
          Live data from Polymarket · Auto-refreshes every 5 min
        </p>
      </div>
      {footerSections.map((section) => (
        <div key={section.title}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {section.title}
          </p>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border py-4 text-center text-[11px] text-muted-foreground/60">
      © 2026 India Predictions. Not financial advice. No real money involved.
    </div>
  </footer>
);

export default Footer;
