'use client';

import Pusher from 'pusher-js';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

let pusher: Pusher | null = null;

if (pusherKey && pusherCluster && typeof window !== 'undefined') {
  pusher = new Pusher(pusherKey, {
    cluster: pusherCluster,
    authEndpoint: '/api/pusher-auth',
  });
}

export function getPusherClient(): Pusher | null {
  return pusher;
}

export function subscribeToTicketChannel(ticketId: string) {
  if (!pusher) return null;
  return pusher.subscribe(`ticket-${ticketId}`);
}

export function unsubscribeFromTicketChannel(ticketId: string) {
  if (!pusher) return;
  pusher.unsubscribe(`ticket-${ticketId}`);
}
