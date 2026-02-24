'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SentimentChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

const COLORS = {
  positive: '#22c55e', // green-500
  neutral: '#eab308',  // yellow-500
  negative: '#ef4444', // red-500
};

export function SentimentChart({ positive, neutral, negative }: SentimentChartProps) {
  const total = positive + neutral + negative;

  // If no data, show empty state
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No sentiment data available
      </div>
    );
  }

  const data = [
    { name: 'Positive', value: positive, color: COLORS.positive },
    { name: 'Neutral', value: neutral, color: COLORS.neutral },
    { name: 'Negative', value: negative, color: COLORS.negative },
  ].filter((item) => item.value > 0);

  const calculatePercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="flex items-center gap-8">
      <div className="w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => (value ?? 0) + ' tickets'}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">
              {item.name} ({calculatePercentage(item.value)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
