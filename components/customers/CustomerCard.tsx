import Link from 'next/link';
import type { CustomerWithTickets } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Ticket, Clock } from 'lucide-react';

interface CustomerCardProps {
  customer: CustomerWithTickets;
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

function getSentimentColor(avgScore: number | null): string {
  if (avgScore === null) return 'bg-yellow-500';
  if (avgScore > 0.3) return 'bg-green-500';
  if (avgScore < -0.3) return 'bg-red-500';
  return 'bg-yellow-500';
}

function getSentimentTrend(avgScore: number | null): { label: string; className: string } {
  if (avgScore === null) return { label: 'Neutral →', className: 'text-yellow-600' };
  if (avgScore > 0.3) return { label: 'Positive ↑', className: 'text-green-600' };
  if (avgScore < -0.3) return { label: 'Negative ↓', className: 'text-red-600' };
  return { label: 'Neutral →', className: 'text-yellow-600' };
}

function getEngagementLevel(ticketCount: number): string {
  if (ticketCount >= 10) return 'High';
  if (ticketCount >= 5) return 'Medium';
  return 'Low';
}

function getEngagementBadge(ticketCount: number): { label: string; className: string } {
  const level = getEngagementLevel(ticketCount);
  if (level === 'High') return { label: 'High Engagement', className: 'bg-blue-100 text-blue-700' };
  if (level === 'Medium') return { label: 'Medium Engagement', className: 'bg-gray-100 text-gray-700' };
  return { label: 'Low Engagement', className: 'bg-gray-100 text-gray-700' };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m ago`;
}

// Mock sentiment trend bars (in real app, calculate from historical data)
function getSentimentBars(avgScore: number | null): string[] {
  if (avgScore === null) return ['bg-yellow-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-yellow-400', 'bg-yellow-500'];
  if (avgScore > 0.3) return ['bg-green-400', 'bg-green-500', 'bg-green-400', 'bg-green-500', 'bg-green-500', 'bg-green-600'];
  if (avgScore < -0.3) return ['bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-500', 'bg-red-400', 'bg-red-500'];
  return ['bg-yellow-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-yellow-400', 'bg-yellow-500'];
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const initials = getInitials(customer.name, customer.email);
  const ticketCount = customer._count?.tickets || 0;
  const engagementBadge = getEngagementBadge(ticketCount);
  const sentimentTrend = getSentimentTrend(null); // Would calculate from historical data
  const sentimentBars = getSentimentBars(null);

  // Get the most recent ticket date
  const lastTicketDate = customer.tickets && customer.tickets.length > 0
    ? new Date(Math.max(...customer.tickets.map((t) => t.createdAt.getTime())))
    : customer.createdAt;

  return (
    <Link
      href={`/dashboard/customers/${customer.id}`}
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer block"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gray-200 text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">
                  {customer.name || 'Unknown'}
                </h4>
                <p className="text-gray-500 text-sm">{customer.email}</p>
              </div>
              <span
                className={`w-3 h-3 rounded-full ${getSentimentColor(null)}`}
                title="Current sentiment"
              />
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <Ticket className="w-4 h-4" />
                {ticketCount} ticket{ticketCount !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                Last: {formatRelativeTime(lastTicketDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Sentiment Trend</span>
            <span className={`font-medium ${sentimentTrend.className}`}>
              {sentimentTrend.label}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {sentimentBars.map((color, i) => (
              <div key={i} className={`w-2 h-6 ${color} rounded-sm`} />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs rounded-full ${engagementBadge.className}`}
          >
            {engagementBadge.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
