import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateTicket } from '@/actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, rating, comment } = body;

    if (!ticketId || !rating) {
      return NextResponse.json(
        { error: 'ticketId and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if ticket exists and is resolved/closed
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
      return NextResponse.json(
        { error: 'Can only rate resolved or closed tickets' },
        { status: 400 }
      );
    }

    // Submit rating
    const updatedTicket = await rateTicket(ticketId, rating, comment);

    return NextResponse.json({
      success: true,
      ticket: {
        id: updatedTicket.id,
        rating: updatedTicket.rating,
      },
    });
  } catch (error) {
    console.error('Failed to rate ticket:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
