import { USER, APP_CONFIG } from '@/lib/mock-data';
import { Shield, AlertTriangle, ChevronRight, FileText, HelpCircle, LogOut } from 'lucide-react';
import AnimateIn from '@/components/AnimateIn';

const ProfilePage = () => {
  const kycBadge = {
    not_started: { label: 'KYC Pending', className: 'bg-warning/10 text-warning' },
    pending: { label: 'KYC In Review', className: 'bg-warning/10 text-warning' },
    verified: { label: 'Verified ✓', className: 'bg-success/10 text-success' },
    rejected: { label: 'KYC Rejected', className: 'bg-destructive/10 text-destructive' },
  };

  const kyc = kycBadge[USER.kycStatus];
  const dailyPct = (USER.dailyLimitUsed / USER.dailyLimit) * 100;
  const weeklyPct = (USER.weeklyLimitUsed / USER.weeklyLimit) * 100;

  return (
    <div className="pb-24 lg:pb-8">
      <div className="bg-secondary px-4 lg:px-8 pt-12 lg:pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <AnimateIn direction="down" distance={10}>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-secondary-foreground mb-4">Profile</h1>
          </AnimateIn>

          <AnimateIn delay={0.1} scale>
            <div className="bg-secondary-foreground/10 rounded-xl p-5 lg:p-6 max-w-xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-lg lg:text-xl">
                  {USER.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display font-semibold text-secondary-foreground lg:text-lg">{USER.name}</h2>
                  <p className="text-xs text-secondary-foreground/60">{USER.phone}</p>
                </div>
                <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${kyc.className}`}>
                  {kyc.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-secondary-foreground/60">Trades</span>
                  <p className="font-display font-bold text-secondary-foreground">{USER.tradesCount}</p>
                </div>
                <div>
                  <span className="text-secondary-foreground/60">Total P&L</span>
                  <p className={`font-display font-bold ${USER.totalPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {USER.totalPnl >= 0 ? '+' : ''}₹{USER.totalPnl.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 mt-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <AnimateIn delay={0.2}>
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Trading Limits
                </h3>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Daily</span>
                    <span className="text-foreground font-medium">₹{USER.dailyLimitUsed.toLocaleString()} / ₹{USER.dailyLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${dailyPct}%`, transitionDelay: '0.4s' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Weekly</span>
                    <span className="text-foreground font-medium">₹{USER.weeklyLimitUsed.toLocaleString()} / ₹{USER.weeklyLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${weeklyPct}%`, transitionDelay: '0.5s' }} />
                  </div>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.25}>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {APP_CONFIG.mode === 'play_money' ? '🎮 Play Money Mode' : '💰 Real Money Mode'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {APP_CONFIG.mode === 'play_money' ? 'Using virtual points. No real INR involved.' : 'Real INR trades. All positions carry financial risk.'}
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Right column */}
          <div className="space-y-4 mt-4 lg:mt-0">
            <AnimateIn delay={0.3}>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {[
                  { icon: Shield, label: 'Safety & Legality', desc: 'Legal status, disclaimers, regulations' },
                  { icon: FileText, label: 'Terms & Conditions', desc: 'User agreement and policies' },
                  { icon: HelpCircle, label: 'How It Works', desc: 'Learn about opinion trading' },
                ].map((item, i) => (
                  <button key={i} className="group w-full flex items-center gap-3 p-4 border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/50 active:bg-muted/70">
                    <item.icon className="w-5 h-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn delay={0.35}>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium transition-all duration-200 hover:bg-destructive/20 active:scale-95">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </AnimateIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
