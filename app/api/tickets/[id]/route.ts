import { NextRequest, NextResponse } from 'next/server';
import { updateTicket as updateTicketAction } from '@/actions';
import { auth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const ticket = await updateTicketAction(id, body);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { getTicketById } = await import('@/actions');
    const ticket = await getTicketById(id);
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
