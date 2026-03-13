interface FearGreedGaugeProps {
  value: number;
  label: string;
}

const FearGreedGauge = ({ value, label }: FearGreedGaugeProps) => {
  // Map 0-100 to angle: -90 (left/extreme fear) to 90 (right/extreme greed)
  const angle = (value / 100) * 180 - 90;

  const getColor = (v: number) => {
    if (v <= 25) return '#EA3943';
    if (v <= 45) return '#EA8C00';
    if (v <= 55) return '#F5D100';
    if (v <= 75) return '#93D900';
    return '#16C784';
  };

  const color = getColor(value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/50">Fear & Greed:</span>
      <div className="relative w-8 h-4 overflow-hidden">
        <svg viewBox="0 0 40 22" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 2 20 A 18 18 0 0 1 38 20"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Colored arc portion */}
          <path
            d="M 2 20 A 18 18 0 0 1 38 20"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 56.5} 56.5`}
          />
          {/* Needle */}
          <line
            x1="20"
            y1="20"
            x2={20 + 14 * Math.cos((angle * Math.PI) / 180)}
            y2={20 - 14 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="2" fill="white" />
        </svg>
      </div>
      <span className="font-semibold" style={{ color }}>{value}</span>
      <span style={{ color }} className="font-medium">{label}</span>
    </div>
  );
};

export default FearGreedGauge;
