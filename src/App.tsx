import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import { LivePricesProvider } from "./contexts/LivePricesContext";
import { GeoProvider } from "./contexts/GeoContext";
import { trackPageView, initScrollTracking, setAnalyticsGeo } from "./lib/analytics";
import { useGeo } from "./contexts/GeoContext";

// Lazy load non-critical pages for better initial load performance
const MarketsPage = lazy(() => import("./pages/MarketsPage"));
const MarketDetailPage = lazy(() => import("./pages/MarketDetailPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const CryptoPage = lazy(() => import("./pages/CryptoPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DigestPage = lazy(() => import("./pages/DigestPage"));
const CategoryHubPage = lazy(() => import("./pages/CategoryHubPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EmbedPage = lazy(() => import("./pages/EmbedPage"));
const DataPage = lazy(() => import("./pages/DataPage"));

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

/** Track page views on route change + init scroll tracking + sync geo to analytics */
const RouteTracker = () => {
  const location = useLocation();
  const geo = useGeo();

  useEffect(() => {
    if (geo.country) setAnalyticsGeo(geo.country, geo.region);
  }, [geo.country, geo.region]);

  useEffect(() => {
    trackPageView(location.pathname);
    const cleanup = initScrollTracking();
    return cleanup;
  }, [location.pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/market/:id" element={<MarketDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/crypto" element={<CryptoPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/digest" element={<DigestPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/cricket" element={<CategoryHubPage slug="cricket" />} />
            <Route path="/elections" element={<CategoryHubPage slug="elections" />} />
            <Route path="/economy" element={<CategoryHubPage slug="economy" />} />
            <Route path="/bollywood" element={<CategoryHubPage slug="bollywood" />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Renders the full app chrome (sidebar/footer) for normal routes, but a bare,
 * chrome-less surface for /embed/* so those pages can be iframed cleanly on
 * other sites (the embeddable-widget backlink play).
 */
const Chrome = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/embed/')) {
    return (
      <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading…</div>}>
        <Routes>
          <Route path="/embed/:id" element={<EmbedPage />} />
        </Routes>
      </Suspense>
    );
  }
  return (
    <div className="min-h-screen bg-background relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      <BottomNav />
      <main id="main-content" className="lg:ml-64">
        <AnimatedRoutes />
        <Footer />
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GeoProvider>
        <LivePricesProvider>
          <RouteTracker />
          <Chrome />
        </LivePricesProvider>
        </GeoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
