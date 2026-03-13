import { useState, useMemo } from 'react';
import { Star, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { CryptoAsset, INR_RATE } from '@/data/crypto-data';
import CryptoSparkline from './CryptoSparkline';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SortKey = 'rank' | 'name' | 'price' | 'change1h' | 'change24h' | 'change7d' | 'marketCap' | 'volume24h' | 'circulatingSupply';
type SortDir = 'asc' | 'desc';
type Tab = 'top' | 'trending' | 'gainers' | 'losers';

interface CryptoTableProps {
  data: CryptoAsset[];
  showINR: boolean;
}

const formatPrice = (price: number, showINR: boolean) => {
  const val = showINR ? price * INR_RATE : price;
  const sym = showINR ? '₹' : '$';
  if (val < 0.001) return `${sym}${val.toFixed(7)}`;
  if (val < 1) return `${sym}${val.toFixed(4)}`;
  if (val < 10) return `${sym}${val.toFixed(2)}`;
  return `${sym}${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatMarketCap = (v: number, showINR: boolean) => {
  const val = showINR ? v * INR_RATE : v;
  const sym = showINR ? '₹' : '$';
  if (val >= 1e12) return `${sym}${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `${sym}${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${sym}${(val / 1e6).toFixed(2)}M`;
  return `${sym}${val.toLocaleString()}`;
};

const formatSupply = (v: number) => {
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  return v.toLocaleString('en-IN');
};

const ChangeCell = ({ value }: { value: number }) => {
  const positive = value >= 0;
  return (
    <span className={`font-medium flex items-center gap-0.5 justify-end ${positive ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
      {positive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
};

const HeaderTooltip = ({ label, tip }: { label: string; tip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="flex items-center gap-1 cursor-help">
        {label}
        <Info className="w-3 h-3 text-gray-500" />
      </span>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[200px] text-xs">
      {tip}
    </TooltipContent>
  </Tooltip>
);

const CryptoTable = ({ data, showINR }: CryptoTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>('top');
  const [page, setPage] = useState(0);
  const perPage = 15;

  const toggleWatchlist = (ticker: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' || key === 'name' ? 'asc' : 'desc');
    }
  };

  const tabData = useMemo(() => {
    switch (tab) {
      case 'trending':
        return [...data].sort((a, b) => b.volume24h - a.volume24h);
      case 'gainers':
        return [...data].sort((a, b) => b.change24h - a.change24h);
      case 'losers':
        return [...data].sort((a, b) => a.change24h - b.change24h);
      default:
        return data;
    }
  }, [data, tab]);

  const sorted = useMemo(() => {
    const arr = [...tabData];
    arr.sort((a, b) => {
      let va: number | string = a[sortKey as keyof CryptoAsset] as number;
      let vb: number | string = b[sortKey as keyof CryptoAsset] as number;
      if (sortKey === 'name') { va = a.name; vb = b.name; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [tabData, sortKey, sortDir]);

  const pageData = sorted.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />;
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'top', label: 'Top' },
    { key: 'trending', label: 'Trending' },
    { key: 'gainers', label: 'Gainers' },
    { key: 'losers', label: 'Losers' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(0); }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[#3861FB] text-[#3861FB]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-xs">
              <th className="text-left py-3 px-2 font-medium w-10 cursor-pointer" onClick={() => handleSort('rank')}>
                # <SortIcon k="rank" />
              </th>
              <th className="w-8" />
              <th className="text-left py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                Name <SortIcon k="name" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('price')}>
                Price <SortIcon k="price" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('change1h')}>
                <HeaderTooltip label="1h %" tip="Price change in the last 1 hour" /> <SortIcon k="change1h" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('change24h')}>
                <HeaderTooltip label="24h %" tip="Price change in the last 24 hours" /> <SortIcon k="change24h" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('change7d')}>
                <HeaderTooltip label="7d %" tip="Price change in the last 7 days" /> <SortIcon k="change7d" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer hidden md:table-cell" onClick={() => handleSort('marketCap')}>
                <HeaderTooltip label="Market Cap" tip="Total market value of circulating supply" /> <SortIcon k="marketCap" />
              </th>
              <th className="text-right py-3 px-2 font-medium cursor-pointer hidden md:table-cell" onClick={() => handleSort('volume24h')}>
                <HeaderTooltip label="Volume(24h)" tip="Total trading volume in 24 hours" /> <SortIcon k="volume24h" />
              </th>
              <th className="text-right py-3 px-2 font-medium hidden lg:table-cell cursor-pointer" onClick={() => handleSort('circulatingSupply')}>
                <HeaderTooltip label="Circulating Supply" tip="Coins currently in circulation" /> <SortIcon k="circulatingSupply" />
              </th>
              <th className="text-right py-3 px-2 font-medium hidden lg:table-cell">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((coin) => {
              const isWatched = watchlist.has(coin.ticker);
              const supplyPct = coin.maxSupply ? (coin.circulatingSupply / coin.maxSupply) * 100 : null;
              return (
                <tr
                  key={coin.ticker}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-2 text-gray-500 font-medium">{coin.rank}</td>
                  <td className="py-3 px-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin.ticker); }}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${isWatched ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: coin.color }}
                      >
                        {coin.ticker.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-[#3861FB] transition-colors">
                          {coin.name}
                        </div>
                        <div className="text-xs text-gray-400">{coin.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-900">
                    {formatPrice(coin.price, showINR)}
                  </td>
                  <td className="py-3 px-2 text-right"><ChangeCell value={coin.change1h} /></td>
                  <td className="py-3 px-2 text-right"><ChangeCell value={coin.change24h} /></td>
                  <td className="py-3 px-2 text-right"><ChangeCell value={coin.change7d} /></td>
                  <td className="py-3 px-2 text-right hidden md:table-cell font-medium text-gray-700">
                    {formatMarketCap(coin.marketCap, showINR)}
                  </td>
                  <td className="py-3 px-2 text-right hidden md:table-cell">
                    <div className="font-medium text-gray-700">
                      {formatMarketCap(coin.volume24h, showINR)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatSupply(coin.volume24h / coin.price)} {coin.ticker}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right hidden lg:table-cell">
                    <div className="font-medium text-gray-700">
                      {formatSupply(coin.circulatingSupply)} {coin.ticker}
                    </div>
                    {supplyPct !== null && (
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-400"
                          style={{ width: `${Math.min(supplyPct, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 hidden lg:table-cell">
                    <CryptoSparkline data={coin.sparklineData} positive={coin.change7d >= 0} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>
          Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, sorted.length)} out of {sorted.length}
        </span>
        {totalPages > 1 && (
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTable;
