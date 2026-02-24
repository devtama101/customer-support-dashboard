'use server';

import { prisma } from '@/lib/prisma';
import type { TicketFilters, TicketWithRelations, CreateTicketInput, UpdateTicketInput } from '@/types';
import { TicketStatus, TicketPriority } from '@prisma/client';

/**
 * Get all tickets with optional filters
 */
export async function getTickets(filters: TicketFilters = {}): Promise<TicketWithRelations[]> {
  const where: any = {};

  // Status filter
  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  // Priority filter
  if (filters.priority && filters.priority.length > 0) {
    where.priority = { in: filters.priority };
  }

  // Assignee filter
  if (filters.assignee) {
    where.assignedAgentId = filters.assignee;
  }

  // Search filter (subject or customer email/name)
  if (filters.search) {
    where.OR = [
      { subject: { contains: filters.search, mode: 'insensitive' } },
      { customer: { email: { contains: filters.search, mode: 'insensitive' } } },
      { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      customer: true,
      agent: true,
      team: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return tickets as TicketWithRelations[];
}

/**
 * Get a single ticket by ID
 */
export async function getTicketById(id: string): Promise<TicketWithRelations | null> {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      customer: true,
      agent: {
        include: {
          user: true,
        },
      },
      team: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  return ticket as TicketWithRelations | null;
}

/**
 * Create a new ticket
 */
export async function createTicket(data: CreateTicketInput & { teamId: string }): Promise<TicketWithRelations> {
  const ticket = await prisma.ticket.create({
    data: {
      teamId: data.teamId,
      customerId: data.customerId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || TicketPriority.MEDIUM,
      category: data.category,
      status: TicketStatus.OPEN,
    },
    include: {
      customer: true,
      agent: true,
      team: true,
      messages: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  return ticket as TicketWithRelations;
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<TicketWithRelations> {
  const updateData: any = { status };

  // Set resolvedAt when closing or resolving
  if (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) {
    updateData.resolvedAt = new Date();
  } else {
    updateData.resolvedAt = null;
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: updateData,
    include: {
      customer: true,
      agent: true,
      team: true,
      messages: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  return ticket as TicketWithRelations;
}

/**
 * Update ticket
 */
export async function updateTicket(id: string, data: UpdateTicketInput): Promise<TicketWithRelations> {
  const ticket = await prisma.ticket.update({
    where: { id },
    data,
    include: {
      customer: true,
      agent: true,
      team: true,
      messages: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  return ticket as TicketWithRelations;
}

/**
 * Assign ticket to an agent
 */
export async function assignTicket(id: string, agentId: string | null): Promise<TicketWithRelations> {
  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      assignedAgentId: agentId,
      ...(agentId && { status: TicketStatus.IN_PROGRESS }),
    },
    include: {
      customer: true,
      agent: true,
      team: true,
      messages: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  return ticket as TicketWithRelations;
}

/**
 * Delete ticket
 */
export async function deleteTicket(id: string): Promise<void> {
  await prisma.ticket.delete({
    where: { id },
  });
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats(teamId?: string) {
  const where = teamId ? { teamId } : {};

  const [
    openTickets,
    inProgressTickets,
    waitingTickets,
    resolvedTickets,
    totalTickets,
  ] = await Promise.all([
    prisma.ticket.count({ where: { ...where, status: TicketStatus.OPEN } }),
    prisma.ticket.count({ where: { ...where, status: TicketStatus.IN_PROGRESS } }),
    prisma.ticket.count({ where: { ...where, status: TicketStatus.WAITING } }),
    prisma.ticket.count({ where: { ...where, status: TicketStatus.RESOLVED } }),
    prisma.ticket.count({ where }),
  ]);

  // Calculate resolution rate (resolved / total closed or resolved)
  const closedOrResolved = await prisma.ticket.count({
    where: {
      ...where,
      status: { in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] },
    },
  });

  const resolutionRate = totalTickets > 0
    ? Math.round((closedOrResolved / totalTickets) * 100)
    : 0;

  // Calculate average response time (simplified - time to first response)
  const ticketsWithFirstResponse = await prisma.ticket.findMany({
    where: {
      ...where,
      messages: { some: { senderType: 'AGENT' } },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 2,
      },
    },
    take: 100,
  });

  let totalResponseTime = 0;
  let responseCount = 0;

  for (const ticket of ticketsWithFirstResponse) {
    if (ticket.messages.length >= 2) {
      const customerMsg = ticket.messages.find((m) => m.senderType === 'CUSTOMER');
      const agentMsg = ticket.messages.find((m) => m.senderType === 'AGENT');
      if (customerMsg && agentMsg) {
        const diffMs = agentMsg.createdAt.getTime() - customerMsg.createdAt.getTime();
        totalResponseTime += diffMs;
        responseCount++;
      }
    }
  }

  const avgResponseTime = responseCount > 0
    ? Math.round(totalResponseTime / responseCount / 1000 / 60) // minutes
    : 0;

  return {
    openTickets,
    inProgressTickets,
    waitingTickets,
    resolvedTickets,
    totalTickets,
    resolutionRate,
    avgResponseTime,
  };
}

/**
 * Get volume data for the last 7 days
 */
export async function getVolumeData(teamId?: string) {
  const where = teamId ? { teamId } : {};

  // Get tickets from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const tickets = await prisma.ticket.findMany({
    where: {
      ...where,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group by date
  const volumeByDate: Record<string, number> = {};

  // Initialize all days with 0
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    volumeByDate[dateStr] = 0;
  }

  // Count tickets per day
  for (const ticket of tickets) {
    const dateStr = ticket.createdAt.toISOString().split('T')[0];
    if (volumeByDate.hasOwnProperty(dateStr)) {
      volumeByDate[dateStr]++;
    }
  }

  return Object.entries(volumeByDate).map(([date, count]) => ({
    date,
    count,
  }));
}

/**
 * Get sentiment data
 */
export async function getSentimentData(teamId?: string) {
  const where = teamId ? { teamId } : {};

  const tickets = await prisma.ticket.findMany({
    where,
    select: {
      sentimentScore: true,
    },
  });

  let positive = 0;
  let neutral = 0;
  let negative = 0;

  for (const ticket of tickets) {
    if (ticket.sentimentScore === null) {
      neutral++;
    } else if (ticket.sentimentScore > 0) {
      positive++;
    } else if (ticket.sentimentScore < 0) {
      negative++;
    } else {
      neutral++;
    }
  }

  return { positive, neutral, negative };
}
