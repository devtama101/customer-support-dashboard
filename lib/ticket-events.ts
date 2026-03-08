// Custom event for reply suggestions between TicketActions and MessageInput
export const REPLY_SUGGESTION_EVENT = 'ticket:reply-suggestion';

export function dispatchReplySuggestion(reply: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(REPLY_SUGGESTION_EVENT, { detail: reply }));
  }
}
