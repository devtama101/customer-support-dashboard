import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { getTicketById } from '@/actions';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TicketContent } from '@/components/tickets/TicketContent';
import { TicketActions } from '@/components/tickets/TicketActions';
import type { Metadata } from 'next';

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TicketDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return {
      title: 'Ticket Not Found',
    };
  }

  return {
    title: `${ticket.subject} - SupportHub`,
  };
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const session = await auth();
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  // Get current agent ID from session
  const currentAgentId = session?.user?.agentId;

  // Format relative time for creation
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  // Generate ticket ID display (T-XXXX format)
  const ticketIdDisplay = `T-${ticket.id.slice(0, 6).toUpperCase()}`;

  // Serialize ticket for client component (convert Date objects to strings)
  const serializedTicket = {
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt.toISOString(),
    })),
  };

  return (
    <>
      <Header
        title={
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tickets"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{ticket.subject}</h2>
              <p className="text-gray-500 text-sm">
                Ticket #{ticketIdDisplay} • Created {formatRelativeTime(ticket.createdAt)}
              </p>
            </div>
          </div>
        }
        subtitle=""
        actions={
          ticket.status !== 'CLOSED' && currentAgentId ? (
            <TicketActions ticketId={ticket.id} />
          ) : null
        }
      />

      <TicketContent ticket={serializedTicket as any} currentAgentId={currentAgentId} />
    </>
  );
}
