import Link from 'next/link';
import type { TicketWithRelations } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SentimentIndicator } from './SentimentIndicator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TicketRowProps {
  ticket: TicketWithRelations;
}

// Tag colors mapping
const tagColors: Record<string, string> = {
  bug: 'bg-red-100 text-red-700',
  oauth: 'bg-blue-100 text-blue-700',
  refund: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
  billing: 'bg-green-100 text-green-700',
  feature: 'bg-purple-100 text-purple-700',
  ui: 'bg-indigo-100 text-indigo-700',
  help: 'bg-cyan-100 text-cyan-700',
  // Default color for unknown tags
  default: 'bg-gray-100 text-gray-700',
};

function getTagColor(tag: string): string {
  return tagColors[tag.toLowerCase()] || tagColors.default;
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m`;
}

export function TicketRow({ ticket }: TicketRowProps) {
  // Get initials for avatar
  const initials = ticket.customer.name
    ? ticket.customer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : ticket.customer.email.slice(0, 2).toUpperCase();

  // Get category from ticket or AI
  const category = ticket.category || 'General';

  return (
    <Link
      href={`/dashboard/tickets/${ticket.id}`}
      className="grid grid-cols-12 gap-4 px-6 py-4 border-b hover:bg-blue-50 items-center"
    >
      {/* Sentiment */}
      <div className="col-span-1">
        <SentimentIndicator score={ticket.sentimentScore} />
      </div>

      {/* Subject */}
      <div className="col-span-3">
        <p className="font-medium text-gray-800">{ticket.subject}</p>
        <p className="text-sm text-gray-500">
          {category} •{' '}
          <span className="text-purple-600">AI-categorized</span>
        </p>
      </div>

      {/* Customer */}
      <div className="col-span-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs bg-gray-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{ticket.customer.name}</span>
        </div>
      </div>

      {/* Tags - using category as tag for now */}
      <div className="col-span-2">
        {ticket.category ? (
          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${getTagColor(ticket.category)}`}
            >
              {ticket.category.toLowerCase()}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </div>

      {/* Status */}
      <div className="col-span-2">
        <StatusBadge status={ticket.status} />
      </div>

      {/* Priority */}
      <div className="col-span-1">
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Updated */}
      <div className="col-span-1 text-sm text-gray-500">
        {formatRelativeTime(ticket.updatedAt)}
      </div>
    </Link>
  );
}
