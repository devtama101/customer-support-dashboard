'use client';

import { useEffect, useState, useRef } from 'react';
import type { TicketWithRelations, Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { getPusherClient } from '@/lib/pusher-client';

interface MessageListProps {
  ticket: TicketWithRelations;
  currentAgentId?: string;
}

export function MessageList({ ticket, currentAgentId }: MessageListProps) {
  const [messages, setMessages] = useState(ticket.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { customer, agent } = ticket;

  // Subscribe to real-time updates
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(`private-ticket-${ticket.teamId}-${ticket.id}`);

    channel.bind('new-message', (data: Message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-ticket-${ticket.teamId}-${ticket.id}`);
    };
  }, [ticket.id, ticket.teamId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSenderName = (message: { senderType: string; senderId: string }) => {
    if (message.senderType === 'CUSTOMER') {
      return customer.name || customer.email;
    }
    if (message.senderType === 'AGENT' && agent) {
      return agent.user?.name || 'Support Agent';
    }
    return 'Unknown';
  };

  const isCurrentUser = (message: { senderType: string; senderId: string }) => {
    return message.senderType === 'AGENT' && message.senderId === currentAgentId;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          senderName={getSenderName(message)}
          isCurrentUser={isCurrentUser(message)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
