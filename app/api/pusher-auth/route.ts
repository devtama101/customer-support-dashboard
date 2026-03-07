import { NextRequest, NextResponse } from 'next/server';
import pusher from '@/lib/pusher';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);

    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Only allow subscription to ticket channels for the user's team
    const teamId = session.user.teamId;

    if (!channel.startsWith(`private-ticket-${teamId}`) &&
        !channel.startsWith(`presence-team-${teamId}`)) {
      return NextResponse.json({ error: 'Forbidden channel' }, { status: 403 });
    }

    if (!pusher) {
      return NextResponse.json({ error: 'Pusher not configured' }, { status: 500 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
