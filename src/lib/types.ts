export type MarketCategory = 'cricket' | 'politics' | 'economy' | 'entertainment' | 'crypto';

export type MarketStatus = 'live' | 'closed' | 'resolved' | 'draft' | 'disputed';

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  yesPrice: number; // 0-1, represents probability
  noPrice: number;
  volume: number; // in INR
  liquidity: number;
  traders: number;
  change24h: number; // percentage change in yes price
  closesAt: string;
  resolvesAt: string;
  resolutionCriteria: string;
  resolutionSource: string;
  resolutionSourceUrl: string;
  contextNote?: string; // "Why this matters to India"
  createdAt: string;
  outcome?: 'yes' | 'no' | null;
  priceHistory: { time: string; yes: number; no: number }[];
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: 'yes' | 'no';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  status: 'open' | 'settled';
  settledAmount?: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade_buy' | 'trade_sell' | 'settlement' | 'fee';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  kycStatus: 'not_started' | 'pending' | 'verified' | 'rejected';
  balance: number;
  totalPnl: number;
  winRate: number;
  tradesCount: number;
  dailyLimitUsed: number;
  dailyLimit: number;
  weeklyLimitUsed: number;
  weeklyLimit: number;
  selfExcludedUntil?: string;
}

export type AppMode = 'play_money' | 'real_money';

export interface AppConfig {
  mode: AppMode;
  enabledCategories: MarketCategory[];
  maxStakePerMarket: number;
  dailyVolumeLimit: number;
  weeklyVolumeLimit: number;
  minAge: number;
  platformFeePercent: number;
}
