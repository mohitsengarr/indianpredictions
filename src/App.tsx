import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import MarketsPage from "./pages/MarketsPage";
import MarketDetailPage from "./pages/MarketDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background relative">
          <BottomNav />
          <div className="lg:ml-64">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/market/:id" element={<MarketDetailPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
