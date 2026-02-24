import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/actions';
import { auth } from '@/lib/auth';
import type { SenderType } from '@prisma/client';

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

  // Validate sender info
  if (!body.senderType || !body.senderId || !body.body) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const message = await addMessage({
      ticketId,
      senderType: body.senderType as SenderType,
      senderId: body.senderId,
      body: body.body,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to add message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
