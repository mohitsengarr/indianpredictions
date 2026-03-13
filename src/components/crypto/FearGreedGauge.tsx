interface FearGreedGaugeProps {
  value: number;
  label: string;
}

const FearGreedGauge = ({ value, label }: FearGreedGaugeProps) => {
  const radius = 40;
  const strokeWidth = 8;
  const center = 50;
  // Semi-circle: from 180deg to 0deg (left to right)
  const startAngle = Math.PI;
  const endAngle = 0;
  const range = startAngle - endAngle;
  const angle = startAngle - (value / 100) * range;

  const needleX = center + radius * Math.cos(angle);
  const needleY = center - radius * Math.sin(angle);

  // Arc path for semicircle background
  const arcPath = `M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`;

  // Color based on value
  const getColor = (v: number) => {
    if (v <= 25) return '#EA3943';
    if (v <= 45) return '#F5A623';
    if (v <= 55) return '#F5D623';
    if (v <= 75) return '#A4D65E';
    return '#16C784';
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 60" className="w-24 h-14">
        {/* Background arc */}
        <path d={arcPath} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Colored gradient segments */}
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA3943" />
            <stop offset="25%" stopColor="#F5A623" />
            <stop offset="50%" stopColor="#F5D623" />
            <stop offset="75%" stopColor="#A4D65E" />
            <stop offset="100%" stopColor="#16C784" />
          </linearGradient>
        </defs>
        <path d={arcPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke={getColor(value)}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={center} cy={center} r={3} fill={getColor(value)} />
        {/* Value text */}
        <text x={center} y={center + 12} textAnchor="middle" className="text-[8px] font-bold" fill={getColor(value)}>
          {value}
        </text>
      </svg>
      <span className="text-[10px] font-semibold mt-0.5" style={{ color: getColor(value) }}>
        {label}
      </span>
    </div>
  );
};

export default FearGreedGauge;
