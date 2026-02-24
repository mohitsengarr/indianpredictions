import { APP_CONFIG } from '@/lib/mock-data';
import { Shield } from 'lucide-react';

const RiskBanner = () => {
  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-2.5">
      <Shield className="w-4 h-4 text-warning mt-0.5 shrink-0" />
      <div className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">
          {APP_CONFIG.mode === 'play_money' ? '🎮 Play Money Mode' : 'Risk Disclosure'}
        </span>
        {' · '}
        {APP_CONFIG.mode === 'play_money'
          ? 'You are using virtual points. No real money is at risk.'
          : 'Opinion trading involves risk. You can lose money. Do not risk more than you can afford to lose. This is not investment advice and is not regulated by SEBI.'}
      </div>
    </div>
  );
};

export default RiskBanner;
