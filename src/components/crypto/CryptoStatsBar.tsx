import { GLOBAL_STATS } from '@/data/crypto-data';
import FearGreedGauge from './FearGreedGauge';

const formatLargeNumber = (n: number) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const CryptoStatsBar = () => {
  const s = GLOBAL_STATS;
  const capChangeColor = s.totalMarketCapChange >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]';

  return (
    <div className="bg-[#0D1421] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto scrollbar-hide text-xs">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-gray-400">Cryptos:</span>
          <span className="text-white font-medium">{s.activeCryptos.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-gray-400">Market Cap:</span>
          <span className="text-white font-medium">{formatLargeNumber(s.totalMarketCap)}</span>
          <span className={`font-semibold ${capChangeColor}`}>
            {s.totalMarketCapChange >= 0 ? '+' : ''}{s.totalMarketCapChange}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-gray-400">24h Vol:</span>
          <span className="text-white font-medium">{formatLargeNumber(s.total24hVolume)}</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-gray-400">BTC Dom:</span>
          <span className="text-white font-medium">{s.btcDominance}%</span>
          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#F7931A]" style={{ width: `${s.btcDominance}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-gray-400">ETH Dom:</span>
          <span className="text-white font-medium">{s.ethDominance}%</span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-gray-400">Fear & Greed:</span>
          <FearGreedGauge value={s.fearGreedIndex} label={s.fearGreedLabel} />
        </div>
      </div>
    </div>
  );
};

export default CryptoStatsBar;
