'use server';

import { prisma } from '@/lib/prisma';
import type { Agent, Team, User } from '@prisma/client';

export type AgentWithTeam = Agent & {
  user: User;
  team: Team;
};

/**
 * Get all agents with their user and team info
 */
export async function getAgents(): Promise<AgentWithTeam[]> {
  const agents = await prisma.agent.findMany({
    include: {
      user: true,
      team: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return agents as AgentWithTeam[];
}

/**
 * Get a team by ID
 */
export async function getTeam(teamId?: string | null): Promise<Team | null> {
  if (!teamId) {
    return null;
  }

  return await prisma.team.findUnique({
    where: { id: teamId },
  });
}
