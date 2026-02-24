import { Home, BarChart3, Briefcase, Wallet, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/markets', label: 'Markets', icon: BarChart3 },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col z-50">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-xl font-bold text-foreground">
            Opinion<span className="text-primary">Bazaar</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">India's Opinion Trading Platform</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          🎮 Play Money Mode
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[56px] transition-all duration-200 ease-out active:scale-90 ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`transition-transform duration-200 ease-out ${active ? 'scale-110 -translate-y-0.5' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium transition-all duration-200 ${active ? 'font-semibold' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
};

export default BottomNav;
