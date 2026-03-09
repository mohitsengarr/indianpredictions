import { APP_CONFIG } from '@/lib/mock-data';
import { ShieldCheck } from 'lucide-react';

const RiskBanner = () => {
  const isPlay = APP_CONFIG.mode === 'play_money';
  return (
    <div className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${
      isPlay
        ? 'bg-blue-50 border-blue-100 text-blue-800'
        : 'bg-amber-50 border-amber-100 text-amber-800'
    }`}>
      <ShieldCheck className="w-4 h-4 shrink-0" />
      <p className="text-xs font-medium leading-relaxed">
        {isPlay
          ? '🎮 Play Money Mode – Virtual points only. No real money at risk.'
          : 'Risk Disclosure: Opinion trading involves financial risk. Not regulated by SEBI. This is not investment advice. Trade responsibly.'}
      </p>
    </div>
  );
};

export default RiskBanner;
