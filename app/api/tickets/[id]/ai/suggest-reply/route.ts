import { NextRequest, NextResponse } from 'next/server';
import { generateTicketReply } from '@/actions';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: ticketId } = await params;
  const body = await request.json();

  try {
    // For now, return a mock reply since we don't have the AI set up
    const reply = await generateTicketReply(ticketId);

    if (!reply) {
      // Fallback mock reply
      return NextResponse.json({
        reply: 'Thank you for reaching out. I understand your concern and I\'m looking into this right away. I\'ll get back to you shortly with an update.',
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Failed to generate reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}
