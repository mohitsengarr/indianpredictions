import { useState, useMemo } from 'react';
import { Star, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { CryptoAsset, USD_TO_INR } from '@/data/crypto-data';
import CryptoSparkline from './CryptoSparkline';
import LivePriceCell from './LivePriceCell';
import ConnectionStatus from './ConnectionStatus';
import { LiveCryptoPrice } from '@/hooks/useBinanceWebSocket';

type SortKey = 'rank' | 'name' | 'price' | 'change1h' | 'change24h' | 'change7d' | 'marketCap' | 'volume24h' | 'circulatingSupply';
type SortDir = 'asc' | 'desc';
type Tab = 'top' | 'trending' | 'gainers' | 'losers';

interface CryptoTableProps {
  data: CryptoAsset[];
  showINR: boolean;
  livePrices?: Map<string, LiveCryptoPrice>;
  isConnected?: boolean;
  lastUpdate?: Date | null;
}

const fmtPrice = (price: number, showINR: boolean) => {
  const v = showINR ? price * USD_TO_INR : price;
  const symbol = showINR ? '₹' : '$';
  if (showINR && v >= 1) {
    return `${symbol}${formatINR(v)}`;
  }
  if (v >= 1) return `${symbol}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (v >= 0.01) return `${symbol}${v.toFixed(4)}`;
  const s = v.toFixed(10);
  const match = s.match(/^0\.(0*[1-9]\d{0,3})/);
  return `${symbol}${match ? `0.${match[1]}` : v.toFixed(8)}`;
};

/** Format number in Indian numbering system (lakhs, crores) */
const formatINR = (n: number): string => {
  const fixed = n.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  // Indian grouping: last 3 digits, then groups of 2
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formatted = rest.length > 0
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return `${formatted}.${decPart}`;
};

const fmtCap = (n: number, showINR: boolean) => {
  const v = showINR ? n * USD_TO_INR : n;
  const symbol = showINR ? '₹' : '$';
  if (showINR) {
    // Indian abbreviations for large numbers
    if (v >= 1e12) return `${symbol}${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e7) return `${symbol}${formatINR(Math.round(v / 1e7))} Cr`;
    if (v >= 1e5) return `${symbol}${formatINR(Math.round(v / 1e5))} L`;
    return `${symbol}${formatINR(v)}`;
  }
  if (v >= 1e12) return `${symbol}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${symbol}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${symbol}${(v / 1e6).toFixed(2)}M`;
  return `${symbol}${v.toLocaleString()}`;
};

const fmtSupply = (n: number) => {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
};

const ChangeCell = ({ value }: { value: number }) => {
  const positive = value >= 0;
  return (
    <span className={`font-medium ${positive ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
      {positive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  );
};

const CryptoTable = ({ data, showINR, livePrices, isConnected = false, lastUpdate = null }: CryptoTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>('top');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const hasLiveData = livePrices && livePrices.size > 0;

  // Merge static data with live prices
  const mergedData = useMemo(() => {
    if (!hasLiveData) return data;
    return data.map((c) => {
      const live = livePrices.get(c.symbol);
      if (!live) return c;
      return {
        ...c,
        price: live.price,
        change24h: live.changePercent24h,
        volume24h: live.quoteVolume,
        marketCap: live.price * c.circulatingSupply,
      };
    });
  }, [data, livePrices, hasLiveData]);

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'rank' ? 'asc' : 'desc'); }
  };

  const tabData = useMemo(() => {
    switch (tab) {
      case 'trending': return [...mergedData].sort((a, b) => b.volume24h - a.volume24h);
      case 'gainers': return [...mergedData].sort((a, b) => b.change24h - a.change24h);
      case 'losers': return [...mergedData].sort((a, b) => a.change24h - b.change24h);
      default: return mergedData;
    }
  }, [mergedData, tab]);

  const sorted = useMemo(() => {
    const arr = [...tabData];
    arr.sort((a, b) => {
      let va: number, vb: number;
      switch (sortKey) {
        case 'name': return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        default: va = a[sortKey] as number; vb = b[sortKey] as number;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [tabData, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'top', label: 'Top' },
    { key: 'trending', label: 'Trending' },
    { key: 'gainers', label: 'Gainers' },
    { key: 'losers', label: 'Losers' },
  ];

  const SortHeader = ({ label, sKey, tooltip, badge }: { label: string; sKey: SortKey; tooltip?: string; badge?: string }) => (
    <th
      className="px-3 py-3 text-left text-xs font-semibold text-gray-500 cursor-pointer select-none hover:text-gray-800 transition-colors whitespace-nowrap"
      onClick={() => handleSort(sKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#16C784] text-white rounded-sm leading-none">
            {badge}
          </span>
        )}
        {tooltip && <Info className="w-3 h-3 text-gray-400" />}
        {sortKey === sKey && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </div>
    </th>
  );

  return (
    <div>
      {/* Connection Status + Tabs row */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                tab === t.key
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
            </button>
          ))}
        </div>
        <ConnectionStatus isConnected={isConnected} lastUpdate={lastUpdate} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-200">
              <SortHeader label="#" sKey="rank" />
              <th className="px-1 py-3 w-8" />
              <SortHeader label="Name" sKey="name" />
              <SortHeader label="Price" sKey="price" badge={hasLiveData ? 'LIVE' : undefined} />
              <SortHeader label="1h %" sKey="change1h" />
              <SortHeader label="24h %" sKey="change24h" />
              <SortHeader label="7d %" sKey="change7d" />
              <SortHeader label="Market Cap" sKey="marketCap" tooltip="Total value of circulating supply" />
              <SortHeader label="Volume (24h)" sKey="volume24h" tooltip="24 hour trading volume" />
              <SortHeader label="Circulating Supply" sKey="circulatingSupply" tooltip="Coins currently in circulation" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, idx) => {
              const supplyPercent = c.maxSupply ? (c.circulatingSupply / c.maxSupply) * 100 : null;
              const isLive = hasLiveData && livePrices.has(c.symbol);
              return (
                <tr
                  key={c.symbol}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    idx % 2 === 1 ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <td className="px-3 py-4 text-sm text-gray-500 font-medium">{c.rank}</td>
                  <td className="px-1 py-4">
                    <button onClick={(e) => { e.stopPropagation(); toggleWatchlist(c.ticker); }}>
                      <Star
                        className={`w-4 h-4 transition-colors ${watchlist.has(c.ticker) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                      />
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.ticker.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-gray-900 text-right">
                    <LivePriceCell
                      formattedPrice={fmtPrice(c.price, showINR)}
                      rawPrice={c.price}
                      isLive={isLive}
                    />
                  </td>
                  <td className="px-3 py-4 text-sm text-right"><ChangeCell value={c.change1h} /></td>
                  <td className="px-3 py-4 text-sm text-right"><ChangeCell value={c.change24h} /></td>
                  <td className="px-3 py-4 text-sm text-right"><ChangeCell value={c.change7d} /></td>
                  <td className="px-3 py-4 text-sm text-gray-900 font-medium text-right">
                    {fmtCap(c.marketCap, showINR)}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <div className="text-sm text-gray-900 font-medium">{fmtCap(c.volume24h, showINR)}</div>
                    <div className="text-xs text-gray-400">{fmtSupply(c.volume24h / c.price)} {c.ticker}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm text-gray-900">{fmtSupply(c.circulatingSupply)} {c.ticker}</div>
                    {supplyPercent !== null && (
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div className="h-1 rounded-full bg-gray-500" style={{ width: `${Math.min(supplyPercent, 100)}%` }} />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <CryptoSparkline data={c.sparklineData} positive={c.change7d >= 0} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-sm text-gray-500">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, sorted.length)} out of {sorted.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 mt-4 pb-2">
        Prices update in real-time via Binance
      </div>
    </div>
  );
};

export default CryptoTable;
