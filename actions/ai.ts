'use server';

import { prisma } from '@/lib/prisma';
import { generateSummary, suggestReply, suggestPriority } from '@/lib/ai';
import { AiActionType } from '@prisma/client';

/**
 * Generate AI summary for a ticket
 * Logs the action for token tracking
 */
export async function generateTicketSummary(ticketId: string): Promise<string> {
  const messages = await prisma.message.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' },
  });

  if (messages.length === 0) {
    return 'No messages to summarize.';
  }

  const summary = await generateSummary(messages);

  // Log to AiLog
  await prisma.aiLog.create({
    data: {
      ticketId,
      actionType: AiActionType.SUMMARIZE,
      input: { messageCount: messages.length },
      output: { summary },
    },
  });

  // Update ticket with summary
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { aiSummary: summary },
  });

  return summary;
}

/**
 * Get existing summary or generate new one
 */
export async function getTicketSummary(ticketId: string): Promise<string> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { aiSummary: true, subject: true },
  });

  if (ticket?.aiSummary) {
    return ticket.aiSummary;
  }

  return await generateTicketSummary(ticketId);
}

/**
 * Suggest a reply for a ticket
 */
export async function generateTicketReply(ticketId: string): Promise<string> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!ticket || ticket.messages.length === 0) {
    return 'Unable to generate a suggestion.';
  }

  const reply = await suggestReply(ticket.subject, ticket.messages);

  // Log to AiLog
  await prisma.aiLog.create({
    data: {
      ticketId,
      actionType: AiActionType.SUGGEST_REPLY,
      output: { reply },
    },
  });

  return reply;
}

/**
 * Suggest priority for a ticket
 */
export async function generateTicketPriority(ticketId: string): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      subject: true,
      description: true,
      sentimentScore: true,
    },
  });

  if (!ticket) {
    return 'MEDIUM';
  }

  const priority = await suggestPriority(
    ticket.subject,
    ticket.description || '',
    ticket.sentimentScore || 0
  );

  // Log to AiLog
  await prisma.aiLog.create({
    data: {
      ticketId,
      actionType: AiActionType.SUGGEST_PRIORITY,
      input: {
        subject: ticket.subject,
        sentiment: ticket.sentimentScore,
      },
      output: { priority },
    },
  });

  return priority;
}

/**
 * Get AI logs for a ticket (for debugging/tracking)
 */
export async function getTicketAiLogs(ticketId: string) {
  return await prisma.aiLog.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get total AI token usage (for cost tracking)
 */
export async function getAiTokenUsage(teamId?: string) {
  const where = teamId
    ? { ticket: { teamId } }
    : {};

  const logs = await prisma.aiLog.findMany({
    where,
    select: {
      tokensUsed: true,
      actionType: true,
    },
  });

  const totalTokens = logs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0);

  const byAction = logs.reduce((acc, log) => {
    acc[log.actionType] = (acc[log.actionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalTokens,
    totalRequests: logs.length,
    byAction,
  };
}
