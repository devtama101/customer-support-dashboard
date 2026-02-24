import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { TicketPriority, TicketStatus } from '@prisma/client';
import { analyzeSentiment, categorizeTicket } from '@/lib/ai';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // This is handled by the getTickets action, but we can redirect to it
  // Or implement separately for API clients
  return NextResponse.json({ error: 'Use server actions instead' }, { status: 501 });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      customerId,
      subject,
      description,
      priority,
      category,
      status,
      assignedAgentId,
    } = body;

    // Validate required fields
    if (!customerId || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId and subject' },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Analyze sentiment and category if not provided
    const messageContent = description || subject;
    const sentimentScore = priority
      ? 0
      : await analyzeSentiment(messageContent);
    const ticketCategory = category || await categorizeTicket(messageContent);

    // Determine priority based on sentiment if not provided
    let ticketPriority: TicketPriority = priority || 'MEDIUM';
    if (!priority) {
      if (sentimentScore < -0.5) {
        ticketPriority = 'HIGH';
      } else if (sentimentScore < -0.3) {
        ticketPriority = 'MEDIUM';
      } else if (sentimentScore > 0.3) {
        ticketPriority = 'LOW';
      }
    }

    // Get teamId from assigned agent or get the first available team
    let teamId: string | null = null;
    if (assignedAgentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: assignedAgentId },
        select: { teamId: true },
      });
      teamId = agent?.teamId || null;
    }

    // If no teamId yet, get the first team
    if (!teamId) {
      const firstTeam = await prisma.team.findFirst({
        select: { id: true },
      });
      teamId = firstTeam?.id || null;
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        customerId,
        teamId: teamId || '',
        status: (status as TicketStatus) || 'OPEN',
        priority: ticketPriority,
        category: ticketCategory,
        sentimentScore,
        assignedAgentId: assignedAgentId || null,
        description: description || null,
      },
    });

    // Create initial message if description provided
    if (description) {
      await prisma.message.create({
        data: {
          ticketId: ticket.id,
          senderType: 'AGENT',
          senderId: session.user?.id || '',
          body: description,
        },
      });
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
