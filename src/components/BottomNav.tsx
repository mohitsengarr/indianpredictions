import { Home, BarChart3, LineChart, PieChart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/markets', label: 'Markets', icon: BarChart3 },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/insights', label: 'Insights', icon: PieChart },
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
      {/* ── Desktop sidebar – Paytm navy ──────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-50"
        style={{ background: 'linear-gradient(180deg, hsl(222 100% 18%) 0%, hsl(222 100% 14%) 100%)' }}>

        {/* Logo area */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white font-display font-extrabold text-sm">
              IP
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold text-white tracking-tight leading-none">
                India<span className="text-secondary">Predictions</span>
              </h1>
              <p className="text-[10px] text-white/50 mt-0.5 font-medium">India's Opinion Trading</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? 'bg-secondary text-white shadow-paytm-blue'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
                {tab.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
              </button>
            );
          })}
        </nav>

        {/* Footer badge */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="bg-white/8 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-base">🎮</span>
            <div>
              <p className="text-xs font-semibold text-white/80">Play Money Mode</p>
              <p className="text-[10px] text-white/40">No real money at risk</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav – white with blue active ─────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/60 shadow-[0_-2px_12px_0_rgba(0,41,112,0.08)]">
        <div className="flex items-center justify-around max-w-lg mx-auto h-[60px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-all duration-200 ease-out active:scale-90 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary -mt-px" />
                )}
                <div className={`relative transition-transform duration-200 ease-out ${active ? 'scale-110' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight`}>{tab.label}</span>
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
