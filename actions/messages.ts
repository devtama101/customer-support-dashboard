'use server';

import { prisma } from '@/lib/prisma';
import type { CreateMessageInput } from '@/lib/schemas';
import { SenderType } from '@prisma/client';
import { analyzeSentiment, categorizeTicket } from '@/lib/ai';

/**
 * Get all messages for a ticket
 */
export async function getTicketMessages(ticketId: string) {
  return await prisma.message.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Add a new message to a ticket
 * Triggers AI analysis for customer messages
 */
export async function addMessage(data: CreateMessageInput) {
  // First, create the message
  const message = await prisma.message.create({
    data: {
      ticketId: data.ticketId,
      senderType: data.senderType,
      senderId: data.senderId,
      body: data.body,
    },
  });

  // If this is a customer message, run AI analysis
  if (data.senderType === SenderType.CUSTOMER) {
    // Get the ticket to update
    const ticket = await prisma.ticket.findUnique({
      where: { id: data.ticketId },
    });

    if (ticket) {
      // Run sentiment analysis and categorization in parallel
      const [sentimentScore, category] = await Promise.all([
        analyzeSentiment(data.body).catch(() => 0),
        ticket.category
          ? Promise.resolve(ticket.category)
          : categorizeTicket(`${ticket.subject}\n\n${data.body}`).catch(() => 'other'),
      ]);

      // Update ticket with AI insights
      await prisma.ticket.update({
        where: { id: data.ticketId },
        data: {
          sentimentScore,
          category,
          // If ticket was in resolved/closed status, move back to open
          ...(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
            ? { status: 'OPEN' }
            : {}),
        },
      });
    }
  }

  return message;
}

/**
 * Delete a message
 */
export async function deleteMessage(id: string): Promise<void> {
  await prisma.message.delete({
    where: { id },
  });
}
