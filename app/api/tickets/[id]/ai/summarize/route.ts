import { NextRequest, NextResponse } from 'next/server';
import { generateTicketSummary } from '@/actions';
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

  try {
    const summary = await generateTicketSummary(ticketId);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Failed to generate summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
