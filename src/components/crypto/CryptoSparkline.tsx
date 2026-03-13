import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CryptoSparklineProps {
  data: number[];
  color?: string;
  positive: boolean;
}

const CryptoSparkline = ({ data, positive }: CryptoSparklineProps) => {
  const chartData = data.map((v, i) => ({ i, v }));
  const strokeColor = positive ? '#16C784' : '#EA3943';

  return (
    <div className="w-[120px] h-[40px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoSparkline;
