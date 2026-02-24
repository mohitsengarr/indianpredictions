import { Market } from '@/lib/types';

interface MiniChartProps {
  market: Market;
}

const MiniChart = ({ market }: MiniChartProps) => {
  const data = market.priceHistory;
  if (data.length < 2) return null;

  const prices = data.map((d) => d.yes);
  const min = Math.min(...prices) - 0.05;
  const max = Math.max(...prices) + 0.05;
  const range = max - min || 1;

  const width = 300;
  const height = 120;
  const padding = 4;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.yes - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  const isUp = prices[prices.length - 1] >= prices[0];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
        <defs>
          <linearGradient id={`grad-${market.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? 'hsl(160, 60%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? 'hsl(160, 60%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${market.id})`} />
        <path
          d={pathD}
          fill="none"
          stroke={isUp ? 'hsl(160, 60%, 45%)' : 'hsl(0, 72%, 51%)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground px-1 -mt-1">
        <span>30d ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default MiniChart;
