'use client';

import { useState } from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dispatchReplySuggestion } from '@/lib/ticket-events';

interface TicketActionsProps {
  ticketId: string;
}

export function TicketActions({ ticketId }: TicketActionsProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Refresh to show the updated summary in the AISummaryCard
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSuggestReply = async () => {
    setIsSuggesting(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/ai/suggest-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Dispatch custom event to communicate with MessageInput
        dispatchReplySuggestion(data.reply || '');
      }
    } catch (error) {
      console.error('Failed to generate reply:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="gap-2"
        onClick={handleSummarize}
        disabled={isSummarizing}
      >
        <Sparkles className="w-4 h-4 text-purple-600" />
        {isSummarizing ? 'Summarizing...' : 'AI Summarize'}
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={handleSuggestReply}
        disabled={isSuggesting}
      >
        <Lightbulb className="w-4 h-4 text-amber-500" />
        {isSuggesting ? 'Generating...' : 'Suggest Reply'}
      </Button>
    </div>
  );
}
