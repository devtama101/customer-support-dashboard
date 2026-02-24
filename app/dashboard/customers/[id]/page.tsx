import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { getCustomerById } from '@/actions';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Ticket, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { QuickActions } from '@/components/customers/QuickActions';

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: CustomerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    return {
      title: 'Customer Not Found',
    };
  }

  return {
    title: `${customer.name || customer.email} - SupportHub`,
  };
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

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const session = await auth();
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const initials = getInitials(customer.name, customer.email);
  const tickets = customer.tickets || [];
  const ticketCount = customer._count?.tickets || tickets.length;

  // Calculate stats
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;
  const avgSentiment = tickets.length > 0
    ? tickets.reduce((sum, t) => sum + (t.sentimentScore || 0), 0) / tickets.length
    : 0;

  const sentimentLabel =
    avgSentiment > 0.3 ? 'Positive' : avgSentiment < -0.3 ? 'Negative' : 'Neutral';

  // Get customer metadata
  const metadata = customer.metadata as Record<string, unknown> | null;
  const plan = metadata?.plan || 'Free';
  const company = metadata?.company || 'N/A';
  const location = metadata?.location || 'N/A';
  const timezone = metadata?.timezone || 'N/A';

  return (
    <>
      <Header
        title={
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/customers"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {customer.name || 'Unknown'}
              </h2>
              <p className="text-gray-500 text-sm">
                Customer since{' '}
                {customer.createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        }
        actions={
          <Link href={`/dashboard/customers/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        {/* Customer Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20 bg-gray-200">
              <AvatarFallback className="text-2xl bg-gray-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">
                  {customer.name || 'Unknown'}
                </h3>
                {ticketCount >= 10 && (
                  <Badge className="bg-purple-100 text-purple-700">
                    VIP
                  </Badge>
                )}
              </div>
              <p className="text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                {String(metadata?.phone || 'No phone number')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Link href={`/dashboard/tickets/new?customerId=${customer.id}`}>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-800">{ticketCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-blue-600">{openTickets}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Avg Sentiment</p>
            <p
              className={`text-3xl font-bold ${
                sentimentLabel === 'Positive'
                  ? 'text-green-600'
                  : sentimentLabel === 'Negative'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {sentimentLabel}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-1">Lifetime Value</p>
            <p className="text-3xl font-bold text-gray-800">
              {ticketCount > 0 ? '$' + (ticketCount * 200).toLocaleString() : '$0'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket History */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Ticket History</h3>
              <Link
                href={`/dashboard/tickets?search=${customer.email}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tickets yet for this customer.
                </div>
              ) : (
                tickets.slice(0, 5).map((ticket) => {
                  const sentimentColor =
                    ticket.sentimentScore && ticket.sentimentScore > 0
                      ? 'bg-green-500'
                      : ticket.sentimentScore && ticket.sentimentScore < 0
                        ? 'bg-red-500'
                        : 'bg-yellow-500';

                  const statusColors: Record<string, string> = {
                    OPEN: 'bg-blue-100 text-blue-700',
                    IN_PROGRESS: 'bg-purple-100 text-purple-700',
                    WAITING: 'bg-orange-100 text-orange-700',
                    RESOLVED: 'bg-green-100 text-green-700',
                    CLOSED: 'bg-gray-100 text-gray-700',
                  };

                  const category = ticket.category || 'General';

                  return (
                    <Link
                      key={ticket.id}
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="block p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`w-2 h-2 rounded-full ${sentimentColor} mt-2`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{ticket.subject}</p>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                statusColors[ticket.status]
                              }`}
                            >
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {category} • {formatRelativeTime(ticket.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notes & Sentiment */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Customer Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-medium">{String(plan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-medium">{String(company)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">{String(location)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timezone</span>
                  <span className="font-medium">{String(timezone)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions customerId={customer.id} customerEmail={customer.email} />
          </div>
        </div>
      </div>
    </>
  );
}
