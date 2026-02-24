import type { Message, SenderType } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SentimentIndicator } from './SentimentIndicator';

interface MessageBubbleProps {
  message: Message;
  senderName: string;
  senderAvatar?: string | null;
  isCurrentUser?: boolean;
}

const senderColors: Record<SenderType, string> = {
  CUSTOMER: 'bg-white border',
  AGENT: 'bg-blue-50 border border-blue-200',
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MessageBubble({
  message,
  senderName,
  senderAvatar,
  isCurrentUser = false,
}: MessageBubbleProps) {
  const initials = getInitials(senderName);

  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10">
        <AvatarFallback className={message.senderType === 'AGENT' ? 'bg-blue-100' : 'bg-gray-200'}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {senderName}
            {isCurrentUser && ' (You)'}
          </span>
          <span className="text-sm text-gray-500">
            {formatRelativeTime(message.createdAt)}
          </span>
          {message.senderType === 'CUSTOMER' && (
            <SentimentIndicator score={null} />
          )}
        </div>
        <div className={`${senderColors[message.senderType]} rounded-xl p-4`}>
          <p className="whitespace-pre-wrap">{message.body}</p>
        </div>
      </div>
    </div>
  );
}
