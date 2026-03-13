import { useMemo } from 'react';
import { GLOBAL_CRYPTO_STATS, USD_TO_INR, CRYPTO_DATA } from '@/data/crypto-data';
import FearGreedGauge from './FearGreedGauge';
import { LiveCryptoPrice } from '@/hooks/useBinanceWebSocket';

interface CryptoStatsBarProps {
  showINR: boolean;
  livePrices?: Map<string, LiveCryptoPrice>;
  isConnected?: boolean;
}

const fmt = (n: number, showINR: boolean) => {
  const v = showINR ? n * USD_TO_INR : n;
  const symbol = showINR ? '₹' : '$';
  if (v >= 1e12) return `${symbol}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${symbol}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${symbol}${(v / 1e6).toFixed(2)}M`;
  return `${symbol}${v.toLocaleString()}`;
};

const CryptoStatsBar = ({ showINR, livePrices, isConnected = false }: CryptoStatsBarProps) => {
  const s = GLOBAL_CRYPTO_STATS;
  const hasLive = livePrices && livePrices.size > 0;

  const liveStats = useMemo(() => {
    if (!hasLive) return null;

    let totalMarketCap = 0;
    let totalVolume = 0;
    let btcMarketCap = 0;

    for (const asset of CRYPTO_DATA) {
      const live = livePrices.get(asset.symbol);
      if (live) {
        const mc = live.price * asset.circulatingSupply;
        totalMarketCap += mc;
        totalVolume += live.quoteVolume;
        if (asset.ticker === 'BTC') btcMarketCap = mc;
      } else {
        totalMarketCap += asset.marketCap;
        totalVolume += asset.volume24h;
        if (asset.ticker === 'BTC') btcMarketCap = asset.marketCap;
      }
    }

    const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : s.btcDominance;

    return {
      totalMarketCap,
      total24hVolume: totalVolume,
      btcDominance: btcDominance.toFixed(1),
    };
  }, [livePrices, hasLive, s.btcDominance]);

  const marketCap = liveStats ? liveStats.totalMarketCap : s.totalMarketCap;
  const volume = liveStats ? liveStats.total24hVolume : s.total24hVolume;
  const btcDom = liveStats ? liveStats.btcDominance : s.btcDominance;

  return (
    <div className="bg-[#1E2026] text-white/80 text-xs flex items-center gap-6 px-4 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">Cryptos:</span>
        <span className="font-medium text-white">{s.activeCryptocurrencies.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">Market Cap:</span>
        <span className="font-medium text-white">{fmt(marketCap, showINR)}</span>
        {!liveStats && (
          <span className={`font-semibold ${s.totalMarketCapChange >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
            {s.totalMarketCapChange >= 0 ? '▲' : '▼'} {Math.abs(s.totalMarketCapChange).toFixed(2)}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">24h Vol:</span>
        <span className="font-medium text-white">{fmt(volume, showINR)}</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">BTC Dominance:</span>
        <span className="font-medium text-white">{btcDom}%</span>
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-white/50">ETH Dominance:</span>
        <span className="font-medium text-white">{s.ethDominance}%</span>
      </div>
      {hasLive && isConnected && (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16C784] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16C784]" />
          </span>
          <span className="text-[#16C784] font-medium">Live</span>
        </div>
      )}
      <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
        <FearGreedGauge value={s.fearGreedIndex} label={s.fearGreedLabel} />
      </div>
    </div>
  );
};

export default CryptoStatsBar;
