import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CryptoSparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

const CryptoSparkline = ({ data, positive, width = 120, height = 40 }: CryptoSparklineProps) => {
  const chartData = data.map((value, i) => ({ i, value }));
  const color = positive ? '#16C784' : '#EA3943';

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
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
