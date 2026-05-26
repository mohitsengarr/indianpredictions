/**
 * SVG-based product mockup for the hero section.
 * Shows a simplified dashboard with India-focused event cards,
 * probability bars, and a mini chart — all in brand colors.
 * Pure CSS/SVG, no external images needed.
 */
const HeroDashboardMockup = ({ className = '' }: { className?: string }) => (
  <div className={`relative ${className}`}>
    {/* Outer device frame */}
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 p-3 shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="w-2 h-2 rounded-full bg-red-400/60" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <span className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="flex-1 bg-white/10 rounded-full h-4 mx-2 flex items-center px-2">
          <span className="text-[7px] text-white/40 font-mono">indiapredictions.com</span>
        </span>
      </div>

      {/* Dashboard content */}
      <div className="bg-slate-900/80 rounded-lg p-3 space-y-2.5">
        {/* Top stat bar */}
        <div className="flex gap-2">
          {/* Illustrative dashboard preview — labels match real metrics, values are stylized */}
          {[
            { label: 'YES odds', val: '62%', color: 'text-emerald-400' },
            { label: 'India VIX', val: '19.8', color: 'text-amber-400' },
            { label: 'Volatility', val: 'Cautious', color: 'text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-white/5 rounded-md px-2 py-1.5">
              <p className="text-[6px] text-white/40 leading-none">{s.label}</p>
              <p className={`text-[10px] font-bold ${s.color} leading-tight mt-0.5`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Mini event cards */}
        <div className="space-y-1.5">
          {[
            { cat: 'Politics', title: 'BJP wins 3+ state elections', yes: 62, color: 'border-l-red-400' },
            { cat: 'Cricket', title: 'CSK wins IPL 2026', yes: 38, color: 'border-l-blue-400' },
            { cat: 'Economy', title: 'RBI cuts rate in June', yes: 71, color: 'border-l-emerald-400' },
          ].map((card) => (
            <div key={card.title} className={`bg-white/5 rounded-md border-l-2 ${card.color} px-2 py-1.5`}>
              <div className="flex items-center justify-between">
                <span className="text-[6px] font-semibold text-white/50 uppercase tracking-wider">{card.cat}</span>
                <span className="text-[7px] text-emerald-400 font-bold">{card.yes}% YES</span>
              </div>
              <p className="text-[8px] text-white/80 font-medium leading-tight mt-0.5">{card.title}</p>
              {/* Mini probability bar */}
              <div className="flex h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500/70 rounded-l-full" style={{ width: `${card.yes}%` }} />
                <div className="bg-red-400/40 rounded-r-full flex-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="bg-white/5 rounded-md p-2">
          <p className="text-[6px] text-white/40 mb-1">Probability trend — RBI rate cut</p>
          <svg viewBox="0 0 120 30" className="w-full h-6" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 25 L10 22 L25 24 L40 18 L55 20 L70 12 L85 14 L100 8 L115 6 L120 5"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M0 25 L10 22 L25 24 L40 18 L55 20 L70 12 L85 14 L100 8 L115 6 L120 5 L120 30 L0 30Z"
              fill="url(#hero-chart-grad)"
            />
          </svg>
        </div>
      </div>
    </div>

    {/* Floating "live" badge */}
    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[7px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      LIVE
    </div>
  </div>
);

export default HeroDashboardMockup;
