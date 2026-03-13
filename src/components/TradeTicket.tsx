import { useState } from 'react';
import { Market } from '@/lib/types';
import { formatINR, formatProbability } from '@/lib/formatters';
import { APP_CONFIG, USER } from '@/lib/mock-data';
import { toast } from 'sonner';
import AnimateIn from './AnimateIn';

interface TradeTicketProps {
  market: Market;
}

const TradeTicket = ({ market }: TradeTicketProps) => {
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');

  const price = side === 'yes' ? market.yesPrice : market.noPrice;
  const amountNum = parseFloat(amount) || 0;
  const shares = amountNum > 0 ? Math.floor(amountNum / price) : 0;
  const fee = amountNum * (APP_CONFIG.platformFeePercent / 100);
  const total = amountNum + fee;
  const potentialPayout = shares * 1;
  const potentialProfit = potentialPayout - amountNum;

  const quickAmounts = [100, 250, 500, 1000];

  const handleTrade = () => {
    if (amountNum <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (total > USER.balance) {
      toast.error('Insufficient balance. Please add funds.');
      return;
    }
    if (amountNum > APP_CONFIG.maxStakePerMarket) {
      toast.error(`Maximum ₹${APP_CONFIG.maxStakePerMarket.toLocaleString()} per market`);
      return;
    }
    toast.success(
      `${APP_CONFIG.mode === 'play_money' ? '🎮 ' : ''}Bought ${shares} ${side.toUpperCase()} shares for ${formatINR(amountNum)}`,
      { description: `Potential payout: ${formatINR(potentialPayout)}` }
    );
    setAmount('');
  };

  return (
    <AnimateIn delay={0.2} distance={16}>
      <div className="bg-card rounded-lg border border-border p-4">
        {APP_CONFIG.mode === 'play_money' && (
          <div className="mb-3 rounded-md bg-warning/10 border border-warning/30 px-3 py-2 text-xs font-medium text-warning-foreground flex items-center gap-1.5">
            <span>🎮</span> Demo Mode — No real trades are executed
          </div>
        )}
        <div className="text-sm font-medium text-muted-foreground mb-3">Take a position</div>

        {/* Yes/No toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSide('yes')}
            className={`flex-1 py-3 rounded-lg font-display font-bold text-sm transition-all duration-300 ease-out active:scale-95 ${
              side === 'yes'
                ? 'bg-success text-success-foreground shadow-md shadow-success/20'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            Yes {formatProbability(market.yesPrice)}
          </button>
          <button
            onClick={() => setSide('no')}
            className={`flex-1 py-3 rounded-lg font-display font-bold text-sm transition-all duration-300 ease-out active:scale-95 ${
              side === 'no'
                ? 'bg-destructive text-destructive-foreground shadow-md shadow-destructive/20'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            No {formatProbability(market.noPrice)}
          </button>
        </div>

        {/* Amount input */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-muted rounded-lg pl-8 pr-4 py-3 text-foreground font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:bg-muted/70"
          />
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mb-4">
          {quickAmounts.map((a, i) => (
            <button
              key={a}
              onClick={() => setAmount(a.toString())}
              className="flex-1 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-90 hover:shadow-sm"
            >
              ₹{a}
            </button>
          ))}
        </div>

        {/* Preview */}
        {amountNum > 0 && (
          <div className="space-y-2 mb-4 text-sm" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div className="flex justify-between text-muted-foreground">
              <span>Shares</span>
              <span className="text-foreground font-medium">{shares}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Avg. price</span>
              <span className="text-foreground font-medium">₹{price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Fee ({APP_CONFIG.platformFeePercent}%)</span>
              <span className="text-foreground font-medium">{formatINR(fee)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-medium">
              <span>Potential payout</span>
              <span className="text-success">{formatINR(potentialPayout)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Profit if correct</span>
              <span className="text-success">{formatINR(potentialProfit)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleTrade}
          disabled={amountNum <= 0}
          className={`w-full py-3.5 rounded-lg font-display font-bold text-sm transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] hover:shadow-lg ${
            side === 'yes'
              ? 'bg-success text-success-foreground hover:shadow-success/20'
              : 'bg-destructive text-destructive-foreground hover:shadow-destructive/20'
          }`}
        >
          Buy {side.toUpperCase()} – {amountNum > 0 ? formatINR(amountNum) : '₹0'}
        </button>

        {APP_CONFIG.mode === 'play_money' && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            🎮 Play money mode – no real INR involved
          </p>
        )}
      </div>
    </AnimateIn>
  );
};

export default TradeTicket;
