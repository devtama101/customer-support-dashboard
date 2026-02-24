import type { TicketWithRelations } from '@/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  ticket: TicketWithRelations;
  currentAgentId?: string;
}

export function MessageList({ ticket, currentAgentId }: MessageListProps) {
  const { messages, customer, agent } = ticket;

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
    </div>
  );
}
