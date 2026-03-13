import { GLOBAL_CRYPTO_STATS, USD_TO_INR } from '@/data/crypto-data';
import FearGreedGauge from './FearGreedGauge';

interface CryptoStatsBarProps {
  showINR: boolean;
}

const fmt = (n: number, showINR: boolean) => {
  const v = showINR ? n * USD_TO_INR : n;
  const symbol = showINR ? '₹' : '$';
  if (v >= 1e12) return `${symbol}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${symbol}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${symbol}${(v / 1e6).toFixed(2)}M`;
  return `${symbol}${v.toLocaleString()}`;
};

const CryptoStatsBar = ({ showINR }: CryptoStatsBarProps) => {
  const s = GLOBAL_CRYPTO_STATS;
  return (
    <div className="bg-[#1E2026] text-white/80 text-xs flex items-center gap-6 px-4 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">Cryptos:</span>
        <span className="font-medium text-white">{s.activeCryptocurrencies.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">Market Cap:</span>
        <span className="font-medium text-white">{fmt(s.totalMarketCap, showINR)}</span>
        <span className={`font-semibold ${s.totalMarketCapChange >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
          {s.totalMarketCapChange >= 0 ? '▲' : '▼'} {Math.abs(s.totalMarketCapChange).toFixed(2)}%
        </span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">24h Vol:</span>
        <span className="font-medium text-white">{fmt(s.total24hVolume, showINR)}</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">BTC Dominance:</span>
        <span className="font-medium text-white">{s.btcDominance}%</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">ETH Dominance:</span>
        <span className="font-medium text-white">{s.ethDominance}%</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
        <FearGreedGauge value={s.fearGreedIndex} label={s.fearGreedLabel} />
      </div>
    </div>
  );
};

export default CryptoStatsBar;
