'use client';

import { useState, useEffect } from 'react';
import { AISummaryCard } from './AISummaryCard';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TicketSidebar } from './TicketSidebar';
import { REPLY_SUGGESTION_EVENT } from '@/lib/ticket-events';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Agent {
  id: string;
  userId: string;
  user: { name: string | null; email: string };
}

interface Message {
  id: string;
  body: string;
  senderType: string;
  senderId: string | null;
  createdAt: Date;
  sender?: { name: string | null } | null;
}

interface Ticket {
  id: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  sentimentScore: number | null;
  category: string | null;
  aiSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  agentId: string | null;
  teamId: string;
  customer: Customer;
  agent: Agent | null;
  messages: Message[];
}

interface TicketContentProps {
  ticket: Ticket;
  currentAgentId: string | undefined;
}

export function TicketContent({ ticket, currentAgentId }: TicketContentProps) {
  const [suggestedReply, setSuggestedReply] = useState<string>('');
  const [replyKey, setReplyKey] = useState(0);

  // Listen for reply suggestions from TicketActions
  useEffect(() => {
    const handleReplySuggestion = (e: CustomEvent<string>) => {
      setSuggestedReply(e.detail);
      setReplyKey((k) => k + 1);
    };

    window.addEventListener(REPLY_SUGGESTION_EVENT, handleReplySuggestion as EventListener);
    return () => {
      window.removeEventListener(REPLY_SUGGESTION_EVENT, handleReplySuggestion as EventListener);
    };
  }, []);

  return (
    <div className="flex-1 flex">
      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        <AISummaryCard summary={ticket.aiSummary} />
        <MessageList ticket={ticket as any} currentAgentId={currentAgentId} />

        {/* Reply Editor - only show if ticket is not closed */}
        {ticket.status !== 'CLOSED' && currentAgentId ? (
          <MessageInput
            key={replyKey}
            ticketId={ticket.id}
            agentId={currentAgentId}
            initialMessage={suggestedReply}
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
      <TicketSidebar ticket={ticket as any} currentAgentId={currentAgentId} />
    </div>
  );
}
