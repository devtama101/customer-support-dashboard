'use client';

import { useState } from 'react';
import { Send, Lightbulb, Bold, Italic, Link as LinkIcon, List, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  ticketId: string;
  agentId: string;
  onReplyGenerated?: (reply: string) => void;
}

export function MessageInput({ ticketId, agentId, onReplyGenerated }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          senderType: 'AGENT',
          senderId: agentId,
          body: message,
        }),
      });

      if (response.ok) {
        setMessage('');
        // Refresh the page to show new message
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/ai/suggest-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.reply || '');
        onReplyGenerated?.(data.reply);
      }
    } catch (error) {
      console.error('Failed to generate reply:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-6">
      <div className="border rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
          <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded" title="Link">
            <LinkIcon className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded" title="List">
            <List className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded" title="Code">
            <Code className="w-4 h-4" />
          </button>
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply... (Cmd+Enter to send)"
          className="border-0 focus-visible:ring-0 min-h-24 resize-none"
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="ghost"
          className="gap-2 text-purple-600 hover:text-purple-700"
          onClick={handleGenerateAI}
          disabled={isGenerating}
        >
          <Lightbulb className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate AI Reply'}
        </Button>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
}
