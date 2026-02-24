import Link from 'next/link';
import type { TicketWithRelations } from '@/types';

interface RecentTicketsProps {
  tickets: TicketWithRelations[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  const sentimentColor = (score: number | null) => {
    if (score && score > 0) return 'bg-green-500';
    if (score && score < 0) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-blue-100 text-blue-700',
    URGENT: 'bg-red-100 text-red-700',
  } as const;

  const statusColors = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    WAITING: 'bg-orange-100 text-orange-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-700',
  } as const;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Tickets</h3>
        <Link
          href="/dashboard/tickets"
          className="text-blue-600 text-sm hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tickets yet. Create your first ticket to get started.
          </div>
        ) : (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/dashboard/tickets/${ticket.id}`}
              className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${sentimentColor(ticket.sentimentScore)}`}
                title={`Sentiment: ${ticket.sentimentScore ?? 'N/A'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{ticket.subject}</p>
                <p className="text-sm text-gray-500 truncate">
                  {ticket.customer.name} • {formatTimeAgo(ticket.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  priorityColors[ticket.priority]
                }`}
              >
                {ticket.priority}
              </span>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  statusColors[ticket.status]
                }`}
              >
                {ticket.status.replace('_', ' ').toLowerCase()}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
