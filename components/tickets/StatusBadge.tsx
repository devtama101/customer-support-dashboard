import type { TicketStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  OPEN: {
    label: 'Open',
    className: 'bg-blue-100 text-blue-700',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-purple-100 text-purple-700',
  },
  WAITING: {
    label: 'Waiting',
    className: 'bg-orange-100 text-orange-700',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-700',
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-gray-100 text-gray-700',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn('px-2 py-1 text-xs rounded-full', config.className)}>
      {config.label}
    </span>
  );
}
