import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  trend,
  trendType = 'neutral',
  icon: Icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
}: StatsCardProps) {
  // Determine trend color
  const getTrendColor = () => {
    if (trendType === 'up') {
      return trend.includes('↑') ? 'text-red-500' : 'text-green-500';
    }
    if (trendType === 'down') {
      return trend.includes('↓') ? 'text-green-500' : 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className={cn('text-xs mt-1', getTrendColor())}>{trend}</p>
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
