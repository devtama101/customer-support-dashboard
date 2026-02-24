import { auth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { getTicketById } from '@/actions';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AISummaryCard } from '@/components/tickets/AISummaryCard';
import { MessageList } from '@/components/tickets/MessageList';
import { MessageInput } from '@/components/tickets/MessageInput';
import { TicketSidebar } from '@/components/tickets/TicketSidebar';
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
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Summarize
            </Button>
            <Button variant="outline" className="gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Suggest Reply
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <AISummaryCard summary={ticket.aiSummary} />
          <MessageList ticket={ticket} currentAgentId={currentAgentId} />

          {/* Reply Editor - only show if ticket is not closed */}
          {ticket.status !== 'CLOSED' && currentAgentId ? (
            <MessageInput
              ticketId={ticket.id}
              agentId={currentAgentId}
            />
          ) : ticket.status === 'CLOSED' ? (
            <div className="border-t bg-gray-50 p-6 text-center text-gray-500">
              This ticket is closed. Reopen to send messages.
            </div>
          ) : (
            <div className="border-t bg-gray-50 p-6 text-center text-gray-500">
              You must be assigned to this ticket to send messages.
            </div>
          )}
        </div>

        {/* Sidebar - Ticket Details */}
        <TicketSidebar ticket={ticket} currentAgentId={currentAgentId} />
      </div>
    </>
  );
}
