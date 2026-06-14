import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, BarChart3, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found – India Predictions",
    description: "The page you're looking for doesn't exist. Browse live India prediction markets, analytics, and insights instead.",
    canonical: location.pathname,
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { to: "/markets", label: "Live Markets", icon: TrendingUp, desc: "All India prediction markets" },
    { to: "/insights", label: "Analytics", icon: BarChart3, desc: "Sector scores, trends & correlations" },
    { to: "/crypto", label: "Crypto", icon: TrendingUp, desc: "Live crypto prices & sentiment" },
    { to: "/blog", label: "Blog", icon: BookOpen, desc: "Prediction market education & insights" },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Tricolour stripe */}
        <div className="h-1 w-24 flex mx-auto mb-6 rounded-full overflow-hidden">
          <div className="flex-1" style={{ background: "#FF9933" }} />
          <div className="flex-1 bg-white border-y border-border" />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>

        <div className="text-center">
          <h1 className="font-display text-6xl lg:text-7xl font-extrabold text-primary leading-none">404</h1>
          <p className="mt-3 text-lg font-semibold text-foreground">
            We couldn't find that page
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            The URL <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</code> doesn't match any active page. It may have been moved, renamed, or never existed.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
            Or try one of these
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-start gap-3 bg-card border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <link.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
