'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';

interface VolumeChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

const DAY_LABELS: Record<string, string> = {
  Mon: 'Mon',
  Tue: 'Tue',
  Wed: 'Wed',
  Thu: 'Thu',
  Fri: 'Fri',
  Sat: 'Sat',
  Sun: 'Sun',
};

export function VolumeChart({ data }: VolumeChartProps) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No volume data available
      </div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  // Format date to short day label
  const formattedData = data.map((item) => {
    const date = new Date(item.date);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      ...item,
      label: dayLabel,
    };
  });

  // Check if weekend (Saturday or Sunday) for lighter color
  const isWeekend = (label: string) => label === 'Sat' || label === 'Sun';

  const getBarColor = (label: string) => {
    return isWeekend(label) ? '#93c5fd' : '#3b82f6'; // blue-300 for weekend, blue-500 for weekday
  };

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={formattedData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          dy={10}
        />
        <YAxis hide={true} />
        <Tooltip
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '12px',
          }}
          formatter={(value: number | undefined) => (value ?? 0) + ' tickets'}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.label)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
