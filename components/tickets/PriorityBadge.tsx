import type { TicketPriority } from '@/types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  LOW: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-700',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700',
  },
  HIGH: {
    label: 'High',
    className: 'bg-blue-100 text-blue-700',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-700',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span className={cn('px-2 py-1 text-xs rounded-full', config.className)}>
      {config.label}
    </span>
  );
}
