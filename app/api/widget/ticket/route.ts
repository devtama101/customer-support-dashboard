import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeSentiment, categorizeTicket } from '@/lib/ai';

/**
 * GET /api/widget/ticket?id=xxx
 * Check ticket status for rating prompt
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        status: true,
        rating: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to get ticket:', error);
    return NextResponse.json(
      { error: 'Failed to get ticket' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, name, email, message } = body;

    // Validate required fields
    if (!teamId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email,
          metadata: {
            source: 'widget',
            teamId,
          },
        },
      });
    }

    // Analyze the message
    const [sentimentScore, category] = await Promise.all([
      analyzeSentiment(message),
      categorizeTicket(message),
    ]);

    // Determine priority based on sentiment
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    if (sentimentScore < -0.5) {
      priority = 'HIGH';
    } else if (sentimentScore < -0.3) {
      priority = 'MEDIUM';
    } else if (sentimentScore > 0.3) {
      priority = 'LOW';
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject: message.slice(0, 100),
        customerId: customer.id,
        status: 'OPEN',
        priority,
        category,
        sentimentScore,
        teamId: teamId,
        description: message,
      },
    });

    // Find an agent to assign to (first available agent in the team)
    const agents = await prisma.agent.findMany({
      where: {
        teamId: teamId,
      },
      take: 1,
    });

    if (agents.length > 0) {
      const agent = agents[0];

      // Assign ticket to agent
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          assignedAgentId: agent.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      ticketDisplayId: ticket.id.slice(0, 8).toUpperCase(),
      message: 'Ticket created successfully',
    });
  } catch (error) {
    console.error('Failed to create widget ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
