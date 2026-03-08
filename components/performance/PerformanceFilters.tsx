'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PerformanceFiltersProps {
  periodLabels?: {
    week: string;
    month: string;
    quarter: string;
  };
}

const defaultLabels = {
  week: 'This Week',
  month: 'This Month',
  quarter: 'This Quarter',
};

export function PerformanceFilters({ periodLabels = defaultLabels }: PerformanceFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || 'week';

  const periods = ['week', 'month', 'quarter'] as const;

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
      {periods.map((period) => {
        const isActive = currentPeriod === period;
        const params = new URLSearchParams(searchParams.toString());
        params.set('period', period);

        return (
          <Link
            key={period}
            href={`${pathname}?${params.toString()}`}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {periodLabels[period]}
          </Link>
        );
      })}
    </div>
  );
}
