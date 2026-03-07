'use server';

import { prisma } from '@/lib/prisma';
import type { TicketStatus } from '@prisma/client';

// Types
export interface AgentPerformanceData {
  agentId: string;
  agentName: string;
  teamId: string;
  role: string;
  resolvedCount: number;
  closedCount: number;
  totalAssigned: number;
  avgResponseTimeHours: number;
  resolutionRate: number;
  avgRating: number;
  totalRatings: number;
}

export interface TeamPerformanceStats {
  totalResolved: number;
  totalClosed: number;
  totalAssigned: number;
  avgResponseTimeHours: number;
  teamResolutionRate: number;
  avgSatisfaction: number;
  avgRating: string;
}

/**
 * Get performance metrics for a specific team
 */
export async function getTeamStats(teamId: string, days: number = 7): Promise<TeamPerformanceStats> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const [
    openTickets,
    inProgressTickets,
    waitingTickets,
    resolvedTickets,
    closedTickets,
    assignedTickets,
  ] = await Promise.all([
    prisma.ticket.count({ where: { teamId, status: 'OPEN', createdAt: { gte: startDate } } }),
    prisma.ticket.count({ where: { teamId, status: 'IN_PROGRESS', createdAt: { gte: startDate } } }),
    prisma.ticket.count({ where: { teamId, status: 'WAITING', createdAt: { gte: startDate } } }),
    prisma.ticket.count({ where: { teamId, status: 'RESOLVED', createdAt: { gte: startDate } } }),
    prisma.ticket.count({ where: { teamId, status: 'CLOSED', createdAt: { gte: startDate } } }),
    prisma.ticket.count({ where: { teamId, createdAt: { gte: startDate }, assignedAgentId: { not: null } } }),
  ]);

  const totalResolved = resolvedTickets + closedTickets;
  const totalAssigned = openTickets + inProgressTickets + waitingTickets + assignedTickets;

  const teamResolutionRate = totalAssigned > 0
    ? Math.round((totalResolved / totalAssigned) * 100)
    : 0;

  // Calculate average response time (first agent message - ticket created time)
  const ticketsWithFirstResponse = await prisma.ticket.findMany({
    where: {
      teamId,
      createdAt: { gte: startDate },
      messages: { some: { senderType: 'AGENT' } },
    },
    select: {
      createdAt: true,
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
    const customerMsg = ticket.messages.find((m) => m.senderType === 'CUSTOMER');
    const agentMsg = ticket.messages.find((m) => m.senderType === 'AGENT');

    if (customerMsg && agentMsg && agentMsg.createdAt > customerMsg.createdAt) {
      const diffMs = agentMsg.createdAt.getTime() - customerMsg.createdAt.getTime();
      totalResponseTime += diffMs;
      responseCount++;
    }
  }

  const avgResponseTimeHours = responseCount > 0
    ? Math.round(totalResponseTime / responseCount / (1000 * 60 * 60))
    : 0;

  // Calculate satisfaction metrics
  const ratedTickets = await prisma.ticket.findMany({
    where: {
      teamId,
      rating: { not: null },
      createdAt: { gte: startDate },
    },
    select: {
      rating: true,
    },
  });

  let totalRatings = 0;
  let avgRating = 0;

  for (const ticket of ratedTickets) {
    totalRatings += ticket.rating || 0;
  }

  if (ratedTickets.length > 0) {
    avgRating = totalRatings / ratedTickets.length;
  }

  return {
    totalResolved,
    totalClosed: closedTickets,
    totalAssigned,
    avgResponseTimeHours,
    teamResolutionRate,
    avgSatisfaction: ratedTickets.length,
    avgRating: avgRating.toFixed(1),
  };
}

/**
 * Get performance metrics for all agents in a team
 */
export async function getAgentPerformance(teamId: string, days: number = 7): Promise<AgentPerformanceData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Get all agents
  const agents = await prisma.agent.findMany({
    where: { teamId },
    include: {
      user: true,
    },
  });

  // Get tickets for all agents in the date range
  const tickets = await prisma.ticket.findMany({
    where: {
      teamId,
      createdAt: { gte: startDate },
      assignedAgentId: { not: null },
    },
    select: {
      assignedAgentId: true,
      status: true,
      createdAt: true,
      resolvedAt: true,
      rating: true,
    },
  });

  // Group tickets by agent
  const ticketsByAgent: Record<string, typeof tickets> = {};
  for (const ticket of tickets) {
    if (ticket.assignedAgentId) {
      if (!ticketsByAgent[ticket.assignedAgentId]) {
        ticketsByAgent[ticket.assignedAgentId] = [];
      }
      ticketsByAgent[ticket.assignedAgentId].push(ticket);
    }
  }

  return agents.map((agent) => {
    const agentTickets = ticketsByAgent[agent.id] || [];

    // Calculate metrics for each agent
    const resolvedCount = agentTickets.filter(
      (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
    ).length;
    const closedCount = agentTickets.filter(
      (t) => t.status === 'CLOSED'
    ).length;
    const assignedCount = agentTickets.filter(
      (t) => t.status === 'IN_PROGRESS' || t.status === 'WAITING'
    ).length;
    const totalAssigned = agentTickets.length;

    // Calculate resolution rate
    const resolutionRate = totalAssigned > 0 ? Math.round((resolvedCount / totalAssigned) * 100) : 0;

    // Calculate satisfaction
    const ratedTickets = agentTickets.filter((t) => t.rating !== null);
    const totalRatings = ratedTickets.reduce((sum, t) => sum + (t.rating || 0), 0);
    const avgRating = ratedTickets.length > 0 ? totalRatings / ratedTickets.length : 0;

    return {
      agentId: agent.id,
      agentName: agent.user?.name || 'Unknown',
      teamId: agent.teamId,
      role: agent.role,
      resolvedCount,
      closedCount,
      totalAssigned,
      avgResponseTimeHours: 0,
      resolutionRate,
      avgRating,
      totalRatings: ratedTickets.length,
    };
  }).sort((a, b) => b.resolvedCount - a.resolvedCount);
}
