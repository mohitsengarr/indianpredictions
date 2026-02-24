import { USER, APP_CONFIG } from '@/lib/mock-data';
import { Shield, AlertTriangle, ChevronRight, FileText, HelpCircle, LogOut } from 'lucide-react';

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
    <div className="pb-24">
      <div className="bg-secondary px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-secondary-foreground mb-4">Profile</h1>

          <div className="bg-secondary-foreground/10 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-lg">
                {USER.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-display font-semibold text-secondary-foreground">{USER.name}</h2>
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
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Limits */}
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
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${dailyPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Weekly</span>
              <span className="text-foreground font-medium">₹{USER.weeklyLimitUsed.toLocaleString()} / ₹{USER.weeklyLimit.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${weeklyPct}%` }} />
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {APP_CONFIG.mode === 'play_money' ? '🎮 Play Money Mode' : '💰 Real Money Mode'}
            </p>
            <p className="text-xs text-muted-foreground">
              {APP_CONFIG.mode === 'play_money'
                ? 'Using virtual points. No real INR involved.'
                : 'Real INR trades. All positions carry financial risk.'}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {[
            { icon: Shield, label: 'Safety & Legality', desc: 'Legal status, disclaimers, regulations' },
            { icon: FileText, label: 'Terms & Conditions', desc: 'User agreement and policies' },
            { icon: HelpCircle, label: 'How It Works', desc: 'Learn about opinion trading' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
