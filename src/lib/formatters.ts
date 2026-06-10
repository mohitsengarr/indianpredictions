export const formatINR = (amount: number): string => {
  // Guard against NaN/undefined/Infinity so the UI never shows "NaN Cr"
  if (!Number.isFinite(amount)) return '₹0';
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const formatProbability = (price: number): string => {
  return `${Math.round(price * 100)}%`;
};

/**
 * Round a yes/no price pair to whole percentages that stay consistent.
 *
 * When the two prices are complementary (sum within 0.02 of 1), independent
 * rounding can show e.g. 64% / 37% (sums to 101). In that case we round yes
 * and derive no = 100 - yes. Otherwise both are rounded independently.
 */
export const complementaryPercents = (
  yesPrice: number,
  noPrice: number
): { yes: number; no: number } => {
  const yes = Math.round(yesPrice * 100);
  if (Math.abs(yesPrice + noPrice - 1) <= 0.02) {
    return { yes, no: 100 - yes };
  }
  return { yes, no: Math.round(noPrice * 100) };
};

export const timeUntil = (dateStr: string): string => {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Closed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 30) return `${Math.floor(days / 30)}mo left`;
  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m left`;
};
