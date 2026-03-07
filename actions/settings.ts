'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';

// Types for auto-assignment rules
export interface AutoAssignRule {
  id: string;
  condition: 'urgent' | 'high' | 'billing' | 'technical' | 'unassigned';
  assignTo?: string; // agentId
  type?: 'round-robin' | 'direct';
  agentName?: string; // for display purposes
}

interface TeamSettings {
  autoAssignRules?: AutoAssignRule[];
  [key: string]: unknown;
}

/**
 * Update team name
 */
export async function updateTeamName(teamId: string, name: string) {
  const team = await prisma.team.update({
    where: { id: teamId },
    data: { name },
  });

  revalidatePath('/dashboard/settings');
  return team;
}

/**
 * Get team settings with auto-assign rules
 */
export async function getTeamSettings(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      settings: true,
    },
  });

  if (!team) return null;

  const settings = team.settings as TeamSettings | null;

  return {
    ...team,
    autoAssignRules: settings?.autoAssignRules || [],
  };
}

/**
 * Add auto-assignment rule
 */
export async function addAutoAssignRule(
  teamId: string,
  rule: Omit<AutoAssignRule, 'id'>
) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { settings: true },
  });

  if (!team) throw new Error('Team not found');

  const currentSettings = (team.settings as TeamSettings) || {};
  const currentRules = currentSettings.autoAssignRules || [];

  const newRule: AutoAssignRule = {
    ...rule,
    id: `rule-${Date.now()}`,
  };

  const updatedSettings: TeamSettings = {
    ...currentSettings,
    autoAssignRules: [...currentRules, newRule],
  };

  await prisma.team.update({
    where: { id: teamId },
    data: {
      settings: updatedSettings as Prisma.JsonObject,
    },
  });

  revalidatePath('/dashboard/settings');
  return newRule;
}

/**
 * Delete auto-assignment rule
 */
export async function deleteAutoAssignRule(teamId: string, ruleId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { settings: true },
  });

  if (!team) throw new Error('Team not found');

  const currentSettings = (team.settings as TeamSettings) || {};
  const currentRules = currentSettings.autoAssignRules || [];

  const updatedSettings: TeamSettings = {
    ...currentSettings,
    autoAssignRules: currentRules.filter((r) => r.id !== ruleId),
  };

  await prisma.team.update({
    where: { id: teamId },
    data: {
      settings: updatedSettings as Prisma.JsonObject,
    },
  });

  revalidatePath('/dashboard/settings');
}
