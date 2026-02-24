import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

// OpenAI configuration
export const aiModel = openai('gpt-4o-mini');

/**
 * Analyze sentiment of text
 * Returns -1 (negative) to 1 (positive)
 */
export async function analyzeSentiment(text: string): Promise<number> {
  const { text: response } = await generateText({
    model: aiModel,
    prompt: `Analyze the sentiment of this customer support message. Return ONLY a number between -1 (very negative) and 1 (very positive). No explanation.\n\nMessage: "${text}"`,
    temperature: 0,
  });

  const score = parseFloat(response.trim());
  return isNaN(score) ? 0 : Math.max(-1, Math.min(1, score));
}

/**
 * Categorize ticket based on content
 */
export async function categorizeTicket(content: string): Promise<string> {
  const { text } = await generateText({
    model: aiModel,
    prompt: `Categorize this customer support message into ONE of these categories:
- billing
- technical
- feature_request
- bug
- account
- other

Return ONLY the category name (lowercase, no spaces).\n\nMessage: "${content}"`,
    temperature: 0,
  });

  return text.trim().toLowerCase();
}

/**
 * Generate summary of ticket conversation
 */
export async function generateSummary(messages: Array<{ body: string; senderType: string; createdAt: Date }>): Promise<string> {
  const conversation = messages
    .map((m) => `${m.senderType === 'CUSTOMER' ? 'Customer' : 'Agent'}: ${m.body}`)
    .join('\n\n');

  const { text } = await generateText({
    model: aiModel,
    prompt: `Summarize this customer support conversation in 2-3 sentences. Focus on the issue, what was discussed, and current status.\n\n${conversation}`,
    temperature: 0.3,
  });

  return text.trim();
}

/**
 * Suggest a reply for a ticket
 */
export async function suggestReply(
  ticketSubject: string,
  messages: Array<{ body: string; senderType: string }>
): Promise<string> {
  const conversation = messages
    .map((m) => `${m.senderType === 'CUSTOMER' ? 'Customer' : 'Agent'}: ${m.body}`)
    .join('\n\n');

  const { text } = await generateText({
    model: aiModel,
    prompt: `You are a customer support agent. Suggest a helpful, professional reply to this customer ticket.

Subject: ${ticketSubject}

Conversation:
${conversation}

Provide a draft response that the agent can edit before sending. Be empathetic, clear, and helpful.`,
    temperature: 0.7,
  });

  return text.trim();
}

/**
 * Suggest priority based on ticket content
 */
export async function suggestPriority(subject: string, description: string, sentimentScore: number): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> {
  const { text } = await generateText({
    model: aiModel,
    prompt: `Based on this ticket, suggest a priority level. Return ONLY ONE of: LOW, MEDIUM, HIGH, URGENT

Subject: ${subject}
Description: ${description}
Sentiment Score: ${sentimentScore} (-1 to 1)

Consider:
- URGENT: System down, data loss, security issue
- HIGH: Broken feature affecting work, billing errors
- MEDIUM: Questions, minor issues, feature requests
- LOW: General inquiries, feedback

Priority:`,
    temperature: 0,
  });

  const priority = text.trim().toUpperCase();
  if (['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) {
    return priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }
  return 'MEDIUM';
}
