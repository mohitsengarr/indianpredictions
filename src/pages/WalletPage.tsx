import { useState } from 'react';
import { USER, TRANSACTIONS } from '@/lib/mock-data';
import { formatINR } from '@/lib/formatters';
import { Plus, ArrowUpRight, ArrowDownLeft, Receipt, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';

const WalletPage = () => {
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt < 50) {
      toast.error('Minimum deposit is ₹50');
      return;
    }
    toast.success(`₹${amt.toLocaleString('en-IN')} added to wallet (simulated)`, {
      description: 'In production, this triggers a UPI payment flow.',
    });
    setShowDeposit(false);
    setDepositAmount('');
  };

  const txIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      case 'trade_buy': return <CreditCard className="w-4 h-4 text-primary" />;
      case 'trade_sell': return <Banknote className="w-4 h-4 text-success" />;
      case 'fee': return <Receipt className="w-4 h-4 text-warning" />;
      default: return <Receipt className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-secondary px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-bold text-secondary-foreground mb-4">Wallet</h1>

          <div className="bg-secondary-foreground/10 rounded-xl p-5">
            <div className="text-xs text-secondary-foreground/60 uppercase tracking-wide mb-1">Available Balance</div>
            <div className="font-display text-3xl font-bold text-secondary-foreground mb-4">
              {formatINR(USER.balance)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeposit(true)}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-display font-bold text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Funds
              </button>
              <button
                onClick={() => toast.info('Withdrawals coming soon')}
                className="flex-1 bg-secondary-foreground/10 text-secondary-foreground py-3 rounded-lg font-display font-bold text-sm"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Deposit modal */}
        {showDeposit && (
          <div className="bg-card rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm">Add Funds via UPI</h3>
            <p className="text-xs text-muted-foreground">Enter the amount you'd like to add. In production, you'll be redirected to your UPI app.</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="500"
                className="w-full bg-muted rounded-lg pl-8 pr-4 py-3 text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {[250, 500, 1000, 2000].map((a) => (
                <button
                  key={a}
                  onClick={() => setDepositAmount(a.toString())}
                  className="flex-1 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:text-foreground"
                >
                  ₹{a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleDeposit} className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm">
                Confirm
              </button>
              <button onClick={() => setShowDeposit(false)} className="px-4 py-3 rounded-lg bg-muted text-muted-foreground text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div>
          <h2 className="font-display font-semibold text-sm mb-3">Recent Activity</h2>
          <div className="space-y-1">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 bg-card rounded-lg border border-border p-3">
                {txIcon(tx.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{tx.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <span className={`font-display font-bold text-sm ${
                  tx.amount >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {tx.amount >= 0 ? '+' : ''}{formatINR(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
